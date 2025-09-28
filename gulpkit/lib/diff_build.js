/**
 * @module lib/diff_build
 * @description 差分取得用コマンドの出力に従ってファイルを選び、<br>
 * 依存関係にあるファイルや任意で設定したグループに属する他のファイル等もビルド対象にする。
 * @requires node:process
 * @requires node:fs/promises
 * @requires node:child_process
 * @requires node:path
 * @requires through2
 * @requires fancy-log
 * @requires chalk
 * @requires p-limit
 * @requires ./last_diff.js
 * @requires ../utilities/event_emitter.js
 */

import process      from 'node:process';
import { readFile } from 'node:fs/promises';
import { exec }     from 'node:child_process';
import path         from 'node:path';

import through  from 'through2';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';
import pLimit   from 'p-limit';

import lastDiff         from './last_diff.js';
import { eventEmitter } from '../utilities/event_emitter.js';

const
  WRITING_DELAY_TIME = 1000
  ,MAX_BUFFER_SIZE   = 1024 * 1024 * 10
  ,CWD = process.cwd()
;
const
  defaultSettings = {
    group         : '',
    enabled       : true,
    isRefsEnabled : false,
    command       : 'git status -suall',
    oneToOne      : false,
    pLimitSize    : 5,
  }
;
let
  writingTimeoutId = null
  ,writing_error
  ,diffBldProc = null
;
export {
  diff_build as default,
  organizeSelectedFileMap, // タスクで汎用的に使えるためエクスポートする。
};

/**
 * プロジェクトをGit で管理する前提で行う差分ビルド。<br>
 * Git の差分取得用コマンド（Git status or Git diff ）で検知されたファイルのみを対象とする。<br>
 * 初回時のみDiffBuildProccessor のインスタンスを作成。<br>
 * インスタンスの共有データを初期化するメンバ関数をリスナー登録。<br>
 * 各タスクで差分データ用のPromise を共有する。<br>
 * オプションから、ブランチやコミット間の差分が対象か、作業中の差分が対象かを判別。<br>
 * 依存ファイル収集や最終選択用のコールバックをタスクごとに保有。<br>
 * One source → One destination 用か、依存関係を伴うファイル用か、グループファイル用のストリームかをオプションから判別。<br>
 * default としてエクスポート。
 * @memberof module:lib/diff_build
 * @param {object} options - オプション
 * @param {function} collect - 依存関係収集用コールバック
 * @param {function} select - 通過ファイル選択用コールバック
 * @returns {Stream} - 処理されたストリーム
 */
function diff_build( options, collect, select ) {
  const
    settings = { ...defaultSettings, name : Symbol(), ...options }
  ;
  const
    taskName   = settings.name
    ,isGrouped = settings.group && typeof settings.group === 'string'
  ;
  let
    ref1, ref2
  ;
  if ( settings.enabled === false ) {
    return through.obj();
  }
  // group が設定されている場合、OS に合わせてパス区切り文字を変換しておく。
  if ( isGrouped === true ) {
    settings.group = settings.group.replace( /\//g, path.sep );
  }
  // ブランチ名、もしくはコミットハッシュをコマンドラインの引数から取得。
  if ( settings.isRefsEnabled === true ) {
    [ ref1, ref2 ] = process.argv.slice( 2 );
  }
  // モジュールスコープであるdiffBldProc がnull の場合にのみインスタンス化。
  if ( !diffBldProc ) {
    diffBldProc = new DiffBuildProcessor();
    if ( settings.firstTasksEndedEventName && settings.tasksEndedEventName ) {
    // 共有する値を初期化するdiffBldProc のメンバ関数をリスナー登録。
      _addResetStateListeners(
        eventEmitter,
        // this の参照が代わらないようdiffBldProc にbind 。
        diffBldProc.resetSharedState.bind( diffBldProc ),
        settings.firstTasksEndedEventName,
        settings.tasksEndedEventName,
      );
    }
  }
  // exec は処理が重いため、各タスクで1つのPromise を共有させる。
  if ( !diffBldProc.promiseToGetDiffData ) {
    diffBldProc.promiseToGetDiffData = _getGitDiffData( settings, ref1, ref2 );
    // ブランチ間、コミット間の比較（refs）が無効の場合にのみ直近の差分データを取得する。
    if ( settings.isRefsEnabled === false ) {
      diffBldProc.promiseToGetLastDiffData = lastDiff.get();
    }
  }
  // 被依存ファイル情報の収集用コールバックを各タスクごとに保有する。
  if ( collect && diffBldProc.collector.has( taskName ) === false ) {
    diffBldProc.collector.set( settings.name, collect );
  }
  // 最終選択用コールバックを各タスクごとに保有する。
  if ( select && diffBldProc.selector.has( taskName ) === false ) {
    diffBldProc.selector.set( settings.name, select );
  }
  // 選定、収集、選択用のMap 及び Set オブジェクトを準備。
  diffBldProc.setUpChildMaps( settings );

  if ( settings.oneToOne === true ) {
    // One source → One destination 用のストリームを作成する。
    return _createOneToOneFilesStream( diffBldProc, settings );
  } else if ( isGrouped === true ) {
    // 任意のグループに属するファイルも流すストリームを作成する。
    return _createGroupedFilesStream( diffBldProc, settings );
  } else {
    // 依存等の関係を伴う他のファイルも流すストリームを作成する。
    return _createDependencyFilesStream( diffBldProc, settings );
  }
}

/**
 * 差分データの取得に伴って共有された値をリセットするリスナーを登録。<br>
 * 各タスクの初回の実行時と、その後のSrc 更新時に共有データを初期化する。
 * @private
 * @param {object} eventEmmter - イベント発行オブジェクト
 * @param {function} resetSharedState - リスナー関数
 * @param {string} onceEventName - 初回のタスクの実行時に発火するイベント名
 * @param {string} repeatingEventName - Src の更新時に発火するイベント名
 */
function _addResetStateListeners(
  eventEmmter, resetSharedState, onceEventName, repeatingEventName
) {
  // 多重回数の呼び出しを抑止するため、1度remove しておく。
  eventEmmter.removeListener( onceEventName, resetSharedState );
  eventEmmter.removeListener( repeatingEventName, resetSharedState );
  // onceEventName のリスナーは1回の呼び出し。
  // repeatingEventName のリスナーはSrc の更新ごとに呼び出し。
  eventEmmter.once( onceEventName, resetSharedState );
  eventEmmter.on( repeatingEventName, resetSharedState );
}

/**
 * git status の結果を整形。<br>
 * git status -suall &lt;dir&gt;で得られるファイルパスをkey に、<br>
 * 属性（「M」 や「?」 など）をその値にして oject（差分データ） を作成。
 * @private
 * @param {string} command - git コマンド
 * @param {string} name - タスク名
 * @returns {Promise<object>} - 差分ファイルリスト
 */
function _getGitDiffData( settings, ref1, ref2 ) {
  const
    name = settings.name
  ;
  let
    command = settings.command
    ,isRefsEnabled = ( ref1 && ref2 )
  ;
  if ( isRefsEnabled ) {
    command = command.replace( '<ref1>', ref1 ).replace( '<ref2>', ref2 );
  }
  return new Promise( ( resolvePromise, rejectPromise ) => {
    exec( command, { maxBuffer : MAX_BUFFER_SIZE }, ( err, stdout, stderr ) => {
      if ( err ) {
        return rejectPromise( err );
      }
      if ( stderr ) {
        fancyLog.warn( chalk.yellow( `${ name }\n${ stderr }` ) );
      }
      if ( stdout ) {
        return resolvePromise( _createObjectFromDiffStdout( stdout, isRefsEnabled ) );
      }
      return resolvePromise( {} );
    } );
  } );
}

/**
 * One source → One destination 用のストリーム作成。<br>
 * @private
 * @param {diffBldProc} diffBldProc - 差分ビルド処理を行うクラスのインスタンス
 * @param {object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createOneToOneFilesStream( diffBldProc, settings ) {
  const
    selectedFileSet = diffBldProc.selectedFileMap.get( settings.name )
    ,targetFileSet  = diffBldProc.targetFileMap.get( settings.name )
  ;
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // 差分データを保持する。
        await diffBldProc.setDiffData();
        // 対象ファイルであれば、ストリームに渡す。
        if ( diffBldProc.isFileInDiffData( file.path ) === true ) {
          targetFileSet.add( file.path );
        } else {
          return callback();
        }
        // Gulp src のオプション、{read :false } でfile.contents はnull なので、
        // 対象ファイルは改めてfile を読み込み、file.contents に代入する。
        await diffBldProc.setContentsToFile( file, settings );
        selectedFileSet.add( file.path );
        callback( null, file );
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        await _finalizeProcessor( diffBldProc, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
  );
}

/**
 * 依存関係を伴う他のファイルも流すストリームを作成。<br>
 * 例えば、Pug、Sass のコンパイルタスク用。
 * @private
 * @param {diffBldProc} diffBldProc - 差分ビルド処理を行うクラスのインスタンス
 * @param {object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createDependencyFilesStream( diffBldProc, settings ) {
  const
    targetFileSet = diffBldProc.targetFileMap.get( settings.name )
  ;
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // 差分データを保持する。
        await diffBldProc.setDiffData();
        // いったんすべてのファイル情報を収集。
        diffBldProc.setAnyFileInfoToAllFiles( file, settings );
        // 対象ファイルを選定。
        if ( diffBldProc.isFileInDiffData( file.path ) === true ) {
          targetFileSet.add( file.path );
        }
        // 依存関係にあるファイルを収集。
        diffBldProc.setImporterFileToCollection( file, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        // 収集した依存関係にあるファイルからストリームに渡したいファイルを選択。
        diffBldProc.addFilesFromCollectionToSelection( settings );
        // 最終選択されたファイルをストリームに渡す。
        await diffBldProc.pushFilesFromSelectionToStream(
          this, settings, _readAndPushFilesToStream,
        );
        await _finalizeProcessor( diffBldProc, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    }
  );
}

/**
 * 任意で設定したグループに属する他のファイルも流すストリームを作成。<br>
 * 例えば、iconFont 、sprite.smith などのタスク用。
 */
function _createGroupedFilesStream( diffBldProc, settings ) {
  const
    targetFileSet = diffBldProc.targetFileMap.get( settings.name )
  ;
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // 差分データを保持する。
        await diffBldProc.setDiffData();
        // いったんすべてのファイル情報を収集。
        diffBldProc.setAnyFileInfoToAllFiles( file, settings );
        // 対象ファイルを選定。
        if ( diffBldProc.isFileInDiffData( file.path ) === true ) {
          targetFileSet.add( file.path );
        }
        // グループ情報を整理。
        diffBldProc.setAssignedGroupToAllFiles( file, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        // 削除されたファイルが属するグループの他のファイルを対象にする。
        diffBldProc.addFilesFromSameGroupAsDeletedToTargets( settings );
        // 対象ファイルが属するグループの他のファイルも選択。
        diffBldProc.addFilesFromGroupToSelection( settings );
        // 最終選択されたファイルをストリームに渡す。
        await diffBldProc.pushFilesFromSelectionToStream(
          this, settings, _readAndPushFilesToStream,
        );
        await _finalizeProcessor( diffBldProc, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    }
  );
}

/**
 * 差分ビルド処理を行うクラス。<br>
 * Git の差分データを基に対象を絞り、対象ファイルと依存関係にあるファイルや所属する同じグループのファイルを収集し選択する。<br>
 * 加えて、最終選択されたファイルをストリームに渡す。
 */
class DiffBuildProcessor {

  constructor() {
    this.collector = new Map();
    this.selector  = new Map();
    this.resetSharedState();
  }

  /**
   * 各共有データを初期化する。
   */
  resetSharedState() {
    this.allFileMap = new Map();
    this.targetFileMap = new Map();
    this.collectedFileMap = new Map();
    this.selectedFileMap = new Map();
    this.currentDiffData = null;
    this.lastDiffData = null;
    this.mergedDiffData = null;
    this.promiseToGetDiffData = null;
    this.promiseToGetLastDiffData = null;
  }

  /**
   * 選定、収集、選択用のMap 及び Set オブジェクトを各タスク事に準備する。
   * @param {object} settings - 設定オブジェクト
   */
  setUpChildMaps( settings ) {
    const
      name = settings.name
    ;
    this.#setChildMapTo( name, this.allFileMap );
    this.#setChildSetTo( name, this.targetFileMap );
    this.#setChildMapTo( name, this.collectedFileMap );
    this.#setChildSetTo( name, this.selectedFileMap );
  }

  /**
   * Git の差分データを保持する。
   * @returns {Promise<void>} - Promise
   */
  async setDiffData() {
    if ( this.currentDiffData !== null ) {
      return;
    }
    try {
      this.currentDiffData = await this.promiseToGetDiffData;
      this.lastDiffData    = await this.promiseToGetLastDiffData;
      this.mergedDiffData  = { ...this.currentDiffData, ...this.lastDiffData };
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * 差分データにfilePath が含まれているか調べる。
   * @param {string} filePath - ファイルの絶対パス
   * @returns {boolean} - true or false
   */
  isFileInDiffData( filePath ) {
    const
      relativePath = path.relative( CWD, filePath ).replace( /[\\]/g, '/' )
      ,mergedDiffData = this.mergedDiffData
    ;
    return mergedDiffData && Object.keys( mergedDiffData ).includes( relativePath );
  }

  /**
   * one source → one destination 用。<br>
   * Gulp.src のオプション、{ read: false } の速さに期待して。<br>
   * contents はreadFile で改めて読み込み、file.contents に代入する。
   * @param {object} file - 参照するファイル (Vinyl オブジェクト)
   * @returns {Promise<void>} - Promise
   */
  async setContentsToFile( file ) {
    try {
      file.contents = await readFile( file.path );
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * すべてのファイル情報を収集。<br>
   * 後にpath の情報が必要であり、グループ情報の設定の為にも必要。<br>
   * 複製されたVinyl オブジェクトのcontents にはnull を代入してメモリの占有を緩和する。
   * @param {object} file - 参照するファイル (Vinyl オブジェクト)
   * @param {object} settings - 設定オブジェクト
   */
  setAnyFileInfoToAllFiles( file, settings ) {
    const
      name = settings.name
    ;
    const
      allFileMap = this.allFileMap.get( name )
    ;
    allFileMap.set( file.path, file.clone() );
    // 容量の大きいcontents プロパティにはいったんnull を代入する。
    // 最終的に選択された際に再代入する。
    allFileMap.get( file.path ).contents = null;
  }

  /**
   * 依存関係からインポート元のファイルを収集。<br>
   * ファイルの依存関係をCallback で収集してもらう。
   * @param {object} file - 参照するファイル (Vinyl オブジェクト)
   * @param {object} settings - 設定オブジェクト
   */
  setImporterFileToCollection( file, settings ) {
    const
      name = settings.name
    ;
    const
      collectedFileMap = this.collectedFileMap.get( name )
    ;
    this.collector.get( name )?.( file, collectedFileMap );
  }

  /**
   * 収集した依存関係ファイルからストリームに渡したいファイルをコールバック関数で最終選択してもらう。
   * @param {object} settings - 設定オブジェクト
   */
  addFilesFromCollectionToSelection( settings ) {
    const
      name = settings.name
    ;
    const
      targetFileSet     = this.targetFileMap.get( name )
      ,collectedFileMap = this.collectedFileMap.get( name )
      ,selectedFileSet  = this.selectedFileMap.get( name )
      ,allFileMap       = this.allFileMap.get( name )
    ;
    for ( const targetFilePath of targetFileSet ) {
      const
        collection = collectedFileMap.get( targetFilePath )
      ;
      collection?.forEach( ( depPath ) => selectedFileSet.add( depPath ) );
      if ( allFileMap.has( targetFilePath ) === true ) {
        selectedFileSet.add( targetFilePath );
      } else {
        continue;
      }
      this.selector.get( name )?.(
        targetFilePath,
        collectedFileMap,
        selectedFileSet,
      );
    } // for
  }

  /**
   * グループ情報を設定。<br>
   * 複数のsrc ファイルを1つのdist にするようなタスク用。<br>
   * 参照するファイルのパスをkey に持つallFileMap のその値（vinly オブジェクト）にgroup プロパティを代入する。
   * @param {object} file - 参照するファイル (Vinyl オブジェクト)
   * @param {object} settings - 設定オブジェクト
   */
  setAssignedGroupToAllFiles( file, settings ) {
    const
      name      = settings.name
      ,group    = settings.group
      ,filePath = file.path
    ;
    const
      allFileMap  = this.allFileMap.get( name )
      ,groupIndex = filePath.indexOf( group )
    ;
    const
      // groupPath は設定された任意のグループ名（ディレクトリ名）を末尾に持つ絶対パス。
      groupPath = filePath.slice( 0, groupIndex + group.length )
    ;
    allFileMap.get( filePath ).group = groupPath;
  }

  /**
   * 削除されたファイルと未追跡のファイルは、<br>
   * そのファイルが属する同じグループの他のファイルすべてを対象ファイルにする。
   * @param {object} settings - 設定オブジェクト
   */
  addFilesFromSameGroupAsDeletedToTargets( settings ) {
    const
      name = settings.name
    ;
    const
      targetFileSet   = this.targetFileMap.get( name )
      ,allFileMap     = this.allFileMap.get( name )
      ,mergedDiffData = this.mergedDiffData
    ;
    for ( const [ relativeDiffFilePath, info ] of Object.entries( mergedDiffData ) ) {
      if ( info.status.includes( 'D' ) === false && info.status.includes( '?' ) === false ) {
        continue;
      }
      const
        // 相対パスから絶対パスに。
        diffFilePath = path.resolve( CWD, relativeDiffFilePath )
      ;
      const
        detectedFileDirName = path.dirname( diffFilePath )
      ;
      for ( const [ , fileOfMap ] of allFileMap ) {
        if ( targetFileSet.has( diffFilePath ) === true ) {
          continue;
        }
        if ( detectedFileDirName === fileOfMap?.group ) {
          targetFileSet.add( diffFilePath );
        }
      }
    }
  }

  /**
   * 対象ファイル以外にそのファイルが属している同じグループの他のファイルも選択する。<br>
   * 複数src ファイルを1つに束ねる様なタスク用。
   * @param {object} settings - 設定オブジェクト
   */
  addFilesFromGroupToSelection( settings ) {
    const
      name = settings.name
    ;
    const
      targetFileSet    = this.targetFileMap.get( name )
      ,allFileMap      = this.allFileMap.get( name )
      ,selectedFileSet = this.selectedFileMap.get( name )
      ,group = settings.group
    ;
    for ( const targetFilePath of targetFileSet ) {
      const
        targetGroup = allFileMap.get( targetFilePath )?.group // targetGroup は絶対パス。
        ,groupIndex = targetFilePath.indexOf( group )
      ;
      const
        myGroup = targetFilePath.slice( 0, groupIndex + group.length ) // teargetFilePath も絶対パス。
      ;
      for ( const [ filePath, file ] of allFileMap ) {
        if (
          ( targetGroup && filePath.startsWith( targetGroup ) )
          || myGroup === file?.group
        ) {
          selectedFileSet.add( filePath );
        }
      } // for
    } // for
  }

  /**
   * 最終選択されたファイルをストリームにプッシュする。<br>
   * ファイルの非同期読み込みの過負荷をp-limt で緩和させる。
   * @param {Stream} stream - Gulp stream
   * @param {object} settings - 設定オブジェクト
   * @param {function} readAndPusher - stream にファイルを読み込んでプッシュする関数
   * @returns {Promise<void>} - Promise
   */
  async pushFilesFromSelectionToStream( stream, settings, readAndPusher ) {
    const
      name        = settings.name
      ,pLimitSize = settings.pLimitSize
    ;
    const
      allFileMap = this.allFileMap.get( name )
      ,limit = pLimit( pLimitSize )
      ,allPromisesToReadFiles = []
    ;
    for ( const filePath of this.selectedFileMap.get( name ) ) {
      const
        limitedTask = limit( () => readAndPusher( filePath, allFileMap, stream ) )
      ;
      allPromisesToReadFiles.push( limitedTask );
    }
    try {
      await Promise.all( allPromisesToReadFiles );
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * 各タスク名をkey にしてMap を親のMap に追加する。
   * @param {string} name - タスク名
   * @param {Map} parentMap - 親のMap
   */
  #setChildMapTo( name, parentMap ) {
    if ( parentMap.has( name ) === true ) {
      return;
    }
    parentMap.set( name, new Map() );
  }

  /**
   * 各タスク名をkey にしてSet を親のMap に追加する。
   * @param {string} name - タスク名
   * @param {Map} parentMap - 親のMap
   */
  #setChildSetTo( name, parentMap ) {
    if ( parentMap.has( name ) === true ) {
      return;
    }
    parentMap.set( name, new Set() );
  }

}

/**
 * 候補ファイルに依存するファイルを再帰選択する。<br>
 * through2.obj()の flush function 内部で実行。<br>
 * 各タスクで汎用的に使用できるため、エクスポートする。
 * @memberof module:lib/diff_build
 * @param {string} filePath - ファイルパス
 * @param {Map} collectedFileMap - 収集した依存関係
 * @param {Set} selectedFileMap - 最終選択ファイルのパスの格納用
 */
function organizeSelectedFileMap( filepath, collectedFileMap, selectedFileMap ) {
  const
    visited = new Set()
  ;
  _recurse( filepath );
  function _recurse( path ) {
    if ( visited.has( path ) === true ) {
      return;
    }
    visited.add( path );
    const
      deps = collectedFileMap.get( path )
    ;
    deps?.forEach( ( dep ) => {
      selectedFileMap.add( dep );
      if ( collectedFileMap.has( dep ) === true ) {
        _recurse( dep );
      }
    } );
  }
}

/**
 * ファイルを読み込みストリームにプッシュする。
 * @private
 * @param {string} filePath - ファイルパス
 * @param {Map} allFiles - すべてのファイルの情報
 * @param {Stream} stream - Gulp stream
 * @returns {Promise<void>} - Promise
 */
async function _readAndPushFilesToStream( filePath, allFiles, stream ) {
  try {
    const
      contents = await readFile( filePath )
      ,file = allFiles.get( filePath )
    ;
    file.contents = contents;
    stream.push( file );
  } catch ( err ) {
    throw err;
  }
}

/**
 * プロセスの最終処理。<br>
 * 検知数と通過させた数のログを出力。<br>
 * 現行の差分データを直近の差分データとしてlastDiff にセットし、ファイルに書き込む。
 * @private
 * @param {diffBldProc} diffBldProc - 差分ビルド処理を行うクラスのインスタンス
 * @param {object} settings - 設定
 * @returns {Promise<void>} - Promise
 */
async function _finalizeProcessor( diffBldProc, settings ) {
  const
    name = settings.name
  ;
  const
    targetFileSet = diffBldProc.targetFileMap.get( name )
    ,selectedFileSet = diffBldProc.selectedFileMap.get( name )
  ;
  _logFileCount(
    name,
    targetFileSet.size,
    selectedFileSet.size,
  );
  if ( settings.isRefsEnabled === false ) {
    lastDiff.set( diffBldProc.currentDiffData );
    await _writeDiffData();
    if ( writing_error ) {
      // ファイルローカルの変数に保持していたエラーをここでthrow する。
      throw writing_error;
    }
  }
}

/**
 * 差分一覧のファイルへの書き込み。<br>
 * ある程度時間を置いての処理で良いため、連続の呼び出しは、間引く。
 * @private
 * @returns {Promise<void>} - Promise
 */
async function _writeDiffData() {
  clearTimeout( writingTimeoutId );
  writingTimeoutId = setTimeout( async function() {
    try {
      await lastDiff.write();
      writing_error = null;
    } catch ( err ) {
      // throw したエラーが伝播しないので、モジュールスコープの変数に保持しておく。
      writing_error = err;
    } finally {
      writingTimeoutId = null;
    }
  }, WRITING_DELAY_TIME );
}

/**
 * 検知数と通過させた数のログを出力。
 * @private
 * @param {string} name - タスク名
 * @param {number} detected - 検知されたファイル数
 * @param {number} total - 通過したファイル数
 */
function _logFileCount( name, detected, total ) {
  if ( typeof name === 'symbol' ) {
    name = String( name );
  }
  if ( name ) {
    fancyLog( chalk.gray( `[${ name }]: detected ${ detected } files diff` ) );
    fancyLog( chalk.gray( `[${ name }]: passed ${ total } files` ) );
  }
}

/**
 * 渡された文字列をObject にして返す。
 * @private
 * @param {string} str - 基にする文字列
 * @returns {object} - 生成したObject
 */
function _createObjectFromDiffStdout( str, isRefsEnabled ) {
  const
    matches = str.matchAll( /^([^\r\n]+?)[^\f\r\n\S]+([^\r\n]+)\n/mg )
    ,renameSeparator = ( isRefsEnabled === true ) ? /\s+/ : /\s+->\s+/ //コマンドによって区切り文字が違うため。
    ,retObj = {}
  ;
  for ( const match of matches ) {
    let path = match[ 2 ];
    // リネームのステータスは変更前と変更後の2つのパスを示す文字列になるのでリネーム後の文字列で置き換える。
    if ( match[ 1 ].indexOf( 'R' ) > -1 ) {
      path = path.split( renameSeparator )[ 1 ];
    }
    // 属性によってはパスは文字列にダブルクォーテーションが含まれることがあるので削除しておく。
    retObj[ path.replace( /"/g,'' ) ] = { status : match[ 1 ] };
  }
  return retObj;
}
