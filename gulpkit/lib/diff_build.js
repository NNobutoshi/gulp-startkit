/**
 * @module lib/diff_build
 * @description 差分用コマンドの出力に従ってファイルを選び、<br>
 * 依存関係にあるファイルや任意で設定したグループに属する他のファイル等をビルド対象にする。
 * @requires node:process
 * @requires node:fs/promises
 * @requires node:child_process
 * @requires node:path
 * @requires through2
 * @requires fancy-log
 * @requires chalk
 * @requires p-limit
 * @requires ./last_diff.js
 */

import process      from 'node:process';
import { readFile } from 'node:fs/promises';
import { exec }     from 'node:child_process';
import path         from 'node:path';

import through  from 'through2';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';
import pLmit    from 'p-limit';

import lastDiff from './last_diff.js';

const
  WRITING_DELAY_TIME = 1000
  ,MAX_BUFFER_SIZE = 1024 * 1024 * 10
  ,CWD = process.cwd()
;
const
  defaultSettings = {
    group       : '',
    enabled     : true,
    isRefsEnabled : false,
    command     : 'git status -suall',
    oneToOne    : false,
    allForOne   : false,
  }
;
let
  writingTimeoutId = null
  ,diffBuildProc = null
;
export {
  diff_build as default,
  organizeSelectedFileMap, // タスクで汎用的に使えるため
};

/**
 * Git で管理する前提での差分ビルド。<br>
 * diff コマンドで検知されたファイルのみを対象とする。<br>
 * default としてエクスポート。
 * @memberof module:lib/diff_build
 * @param {object} options - オプション
 * @param {Function} collect - 依存関係収集用コールバック
 * @param {Function} select - 通過ファイル選択用コールバック
 * @returns {Stream} - 処理されたストリーム
 */
function diff_build( options, collect, select ) {
  const
    settings = { ...defaultSettings, name : Symbol(), ...options }
  ;
  const
    taskName = settings.name
  ;
  let
    ref1, ref2
  ;
  if ( settings.enabled === false ) {
    return through.obj();
  }
  if ( typeof settings.group !== '' ) {
    settings.group = settings.group.replace( /\//g, path.sep );
  }
  // ブランチ名、もしくはコミットハッシュをコマンドラインの引数から取得。
  if ( settings.isRefsEnabled === true ) {
    [ ref1, ref2 ] = process.argv.slice( 2 );
  }

  // モジュールスコープのdiffBuildProc がnull の場合にのみ初期化。
  if ( !diffBuildProc ) {
    diffBuildProc = new DiffBuildProcessor();
    // diffBuildProc の共有する値を初期化するメンバ関数をリスナー登録。
    _addResetStateListeners(
    // リスナ-登録でthis の参照が代わらないようdiffBuildProc にbind 。
      diffBuildProc.resetSharedState.bind( diffBuildProc ),
      settings.firstTasksEndedEventName,
      settings.tasksEndedEventName,
    );
  } // if

  // exec は処理が重いため、実行が連続しないよう各タスクでPromis を共有させる
  if ( !diffBuildProc.promiseToGetDiffData ) {
    diffBuildProc.promiseToGetDiffData = _getGitDiffData( settings, ref1, ref2 );
    // refs （ブランチ間、コミット間）比較が無効の場合にのみ直近の差分データを取得する。
    if ( settings.isRefsEnabled === false ) {
      diffBuildProc.promiseToGetLastDiffData = lastDiff.get();
    }
  }
  // 被依存ファイル情報の収集用コールバックを各タスクごとに保有する。
  if ( collect && diffBuildProc.collector.has( taskName ) === false ) {
    diffBuildProc.collector.set( settings.name, collect );
  }
  // 最終選択用コールバックを各タスクごとに保有する。
  if ( select && diffBuildProc.selector.has( taskName ) === false ) {
    diffBuildProc.selector.set( settings.name, select );
  }

  return ( settings.oneToOne === true )
    ? _createOneToOneFilesStream( diffBuildProc, settings )
    : _createDependencyFilesStream( diffBuildProc, settings )
  ;
}

/**
 * 差分データの取得に伴い、共有データをリセットするリスナーを追加。<br>
 * 各タスクの初回の実行時と、その後のSrc 更新時に共有データを初期化する。
 * @private
 * @param {Function} resetSharedState - リスナー関数
 * @param {string} firstTasksEndedEventName - 初回のタスクの実行時に発火するイベント名。
 * @param {string} tasksEndedEventName - Src の更新時に発火するイベント名。
 */
function _addResetStateListeners(
  resetSharedState,
  firstTasksEndedEventName,
  tasksEndedEventName,
) {
  // 多重回数の呼び出しを抑止するため、1度remove しておく。
  process.removeListener( firstTasksEndedEventName, resetSharedState );
  process.removeListener( tasksEndedEventName, resetSharedState );
  // firstTasksEndedEventName のリスナーは1回の呼び出し。
  // tasksEndedEventName のリスナーはSrc の更新ごとの呼び出し。
  process.once( firstTasksEndedEventName, resetSharedState );
  process.on( tasksEndedEventName, resetSharedState );
}

/**
 * One source → One destination 用のストリーム作成。<br>
 * Git status または Git diff で検知されたfile のみを対象にする。
 * @private
 * @param {diffBuildProc} diffBuildProc - 差分ビルド処理を行うクラスのインスタンス
 * @param {object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createOneToOneFilesStream( diffBuildProc, settings ) {
  // 選定、収集、選択用のMap 及び Set オブジェクトを準備。
  diffBuildProc.setUpChildMaps( settings );
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // 対象ファイルを選定。
        await diffBuildProc.addDiffFilteredFileToTargetSet( file, settings );
        if ( diffBuildProc.targetFileMap.get( settings.name ).has( file.path ) === false ) {
          return callback();
        }
        // Gulp src のオプション、{read :false } でfile.contents はnull なので、
        // 改めてfile を読み込み、file.contents に代入する。
        await diffBuildProc.setContentsToFile( file, settings );
        callback( null, file );
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        await _finalizeProcessor( diffBuildProc, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
  );
}

/**
 * 依存関を伴う他のファイルも流すストリームを作成。<br>
 * 例えば、Pug、Sass のコンパイルタスク用。<br>
 * or<br>
 * 渡されてきたファイル以外に必要な対象ファイルを併せてストリームに渡す。<br>
 * 例えば、iconFont sprite.smithなどのタスク用。
 * @private
 * @param {diffBuildProc} diffBuildProc - 差分ビルド処理を行うクラスのインスタンス
 * @param {object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createDependencyFilesStream( diffBuildProc, settings ) {
  // 選定、収集、選択用のMap 及び Set オブジェクトを準備。
  diffBuildProc.setUpChildMaps( settings );
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // いったんすべてのファイル情報を収集。
        diffBuildProc.setAnyFileInfoToAllFileMap( file, settings );
        // 対象ファイルを選定。
        await diffBuildProc.addDiffFilteredFileToTargetSet( file, settings );
        // グループ情報を整理。
        if ( settings.group ) {
          diffBuildProc.setAssignedGroupToAllFileMap( file, settings );
        }
        // 依存関係にあるファイルを収集。
        diffBuildProc.setImporterFileToCollectionMap( file, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        if ( settings.group ) {
          // 削除されたファイルと同じグループのファイルを対象にする。
          diffBuildProc.addFilesGroupedWithDeletedToTarget( settings );
          // 属する同じグループのファイルも選択。
          diffBuildProc.addFilesFromGroupToSelectionSet( settings );
        } else if ( settings.allForOne === true ) {
          // すべてのファイルの情報を選択。
          diffBuildProc.addAllFilesToSelectionSet( settings );
        } else {
          // 収集した依存関係にあるファイルからストリームに渡したいファイルを選択。
          diffBuildProc.addFilesFromCollectionToSelectionSet( settings );
        }
        // 選択されたファイルをストリームに渡す。
        await diffBuildProc.pushSelectedFilesToStream(
          this,
          settings,
          _promiseReadAndPushFileToStream,
        );
        await _finalizeProcessor( diffBuildProc, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    }
  );
}

/**
 * 差分ビルド処理を行うクラス。<br>
 * Git の差分データを基に対象を絞り、対象ファイルと依存関係にあるファイルや所属する同グループのファイルを選定、選択。<br>
 * 加えて、最終選択されたファイルをストリームに渡す。
 */
class DiffBuildProcessor {

  constructor() {
    this.collector = new Map();
    this.selector  = new Map();
    this.resetSharedState();
  }

  /**
   * 各共有データの初期化する。
   */
  resetSharedState() {
    this.allFileMap = new Map();
    this.targetFileMap = new Map();
    this.selectedFileMap = new Map();
    this.collectedFileMap = new Map();
    this.currentDiffData = null;
    this.lastDiffData = null;
    this.promiseToGetDiffData = null;
    this.promiseToGetLastDiffData = null;
  }

  /**
   * 選定、収集、選択用のMap 及び Set オブジェクトを各タスク事に準備する。
   * @param {object} settings - 設定オブジェクト
   */
  setUpChildMaps( settings ) {
    const name = settings.name;
    this.#setChildMapTo( name, this.allFileMap );
    this.#setChildSetTo( name, this.targetFileMap );
    this.#setChildMapTo( name, this.collectedFileMap );
    this.#setChildSetTo( name, this.selectedFileMap );
  }

  /**
   * Git で差分データを取得して対象ファイルを絞る。<br>
   * Git のrevert なども検知させるため、差分データに無い場合も直近の差分データにあれば対象ファイルにする。
   * @param {object} file - 参照するファイル (Vinyl オブジェクト)
   * @param {object} settings - 設定オブジェクト
   * @returns {Promise<void>}
   */
  async addDiffFilteredFileToTargetSet( file, settings ) {
    try {
      const
        name = settings.name
      ;
      const
        targetFileSet = this.targetFileMap.get( name )
      ;
      this.currentDiffData = await this.promiseToGetDiffData;
      this.lastDiffData    = await this.promiseToGetLastDiffData;
      if ( this.#isFileInDiffData( file.path ) === true ) {
        targetFileSet.add( file.path );
      }
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * one source → one destination 用。<br>
   * Gulp.src のオプション、 { read: false } の速さに期待して。<br>
   * contents はreadFile で改めて読み込み、file.contents に代入する。
   * @param {object} file - 参照するファイル (Vinyl オブジェクト)
   * @param {object} settings - 設定オブジェクト
   * @returns {Promise<void>}
   */
  async setContentsToFile( file, settings ) {
    const
      name = settings.name
    ;
    const
      selectedFileSet = this.selectedFileMap.get( name )
    ;
    try {
      file.contents = await readFile( file.path );
      selectedFileSet.add( file.path );
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
  setAnyFileInfoToAllFileMap( file, settings ) {
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
   * グループ情報を設定。<br>
   * 複数のsrc ファイルを1つのdist にするようなタスク用。<br>
   * 参照するファイルのパスをkey に持つallFileMap のその値（vinly オブジェクト）に、group プロパティを追加する。
   * @param {object} file - 参照するファイル (Vinyl オブジェクト)
   * @param {object} settings - 設定オブジェクト
   */
  setAssignedGroupToAllFileMap( file, settings ) {
    const
      name   = settings.name
      ,group = settings.group
    ;
    const
      allFileMap = this.allFileMap.get( name )
      ,groupIndex = file.path.indexOf( group )
    ;
    const
      groupPath = file.path.slice( 0, groupIndex + group.length )
    ;
    // groupPath は設定された任意のグループ名（ディレクトリ名）を末尾に持つ絶対パス。
    allFileMap.get( file.path ).group = groupPath;
  }

  /**
   * 依存関係からインポート元のファイルを収集。<br>
   * ファイルの依存関係をCallback で収集してもらう。
   * @param {object} file - 参照するファイル (Vinyl オブジェクト)
   * @param {object} settings - 設定オブジェクト
   */
  setImporterFileToCollectionMap( file, settings ) {
    const
      name = settings.name
    ;
    const
      collectedFileMap = this.collectedFileMap.get( name )
    ;
    this.collector.get( name )?.( file, collectedFileMap );
  }

  /**
   * 削除されたファイルと直近の差分で未追跡のファイルは、<br>
   * それが属するグループの他のファイルを対象ファイルにする。
   * @param {object} settings - 設定オブジェクト
   */
  addFilesGroupedWithDeletedToTarget( settings ) {
    const
      name = settings.name
    ;
    const
      targetFileSet = this.targetFileMap.get( name )
      ,allFileMap   = this.allFileMap.get( name )
      ,mergeDiffData = { ...this.currentDiffData, ...this.lastDiffData }
    ;
    for ( const [ filePathOfDiffData, info ] of Object.entries( mergeDiffData ) ) {
      if ( info.status.includes( 'D' ) === false && info.status.includes( '?' ) === false ) {
        continue;
      }
      const
        resolveFilePathOfDiffData = path.resolve( CWD, filePathOfDiffData )
      ;
      const
        dirNameOfDiffData = path.dirname( resolveFilePathOfDiffData )
      ;
      for ( const [ , fileOfMap ] of allFileMap ) {
        if ( targetFileSet.has( resolveFilePathOfDiffData ) === true ) {
          continue;
        }
        if ( dirNameOfDiffData === fileOfMap?.group ) {
          targetFileSet.add( resolveFilePathOfDiffData );
        }
      }
    }
  }

  /**
   * 例えば候補が1ファイルでも、属している同じグループの他のファイルも選択する。<br>
   * 複数src ファイルを1つに束ねる様なタスク用。
   * @param {object} settings - 設定オブジェクト
   */
  addFilesFromGroupToSelectionSet( settings ) {
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
        myGroup = targetFilePath.slice( 0, groupIndex + group.length ) // teargetFilePath は絶対パス。
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
   * 収集したすべてのファイルパス情報を選択ファイルとしてselectedMap に追加する。
   * @param {object} settings - 設定オブジェクト
   */
  addAllFilesToSelectionSet( settings ) {
    const
      name = settings.name
    ;
    const
      selectedFileSet = this.selectedFileMap.get( name )
      ,allFileMap     = this.allFileMap.get( name )
    ;
    for ( const [ filePath ] of allFileMap ) {
      selectedFileSet.add( filePath );
    }
  }

  /**
   * 収集した依存関係ファイルからストリームに渡したいファイルをCallback で選択してもらう。
   * @param {object} settings - 設定オブジェクト
   */
  addFilesFromCollectionToSelectionSet( settings ) {
    const
      name = settings.name
    ;
    const
      targetFileSet     = this.targetFileMap.get( name )
      ,collectedFileMap = this.collectedFileMap.get( name )
      ,selectedFileSet  = this.selectedFileMap.get( name )
      ,allFileMap       = this.allFileMap.get( name )
    ;
    for ( const filePath of targetFileSet ) {
      const collection = collectedFileMap.get( filePath );
      if ( Array.isArray( collection ) === true ) {
        collection.forEach( ( depPath ) => selectedFileSet.add( depPath ) );
      }
      if ( allFileMap.has( filePath ) === true ) {
        selectedFileSet.add( filePath );
      } else {
        continue;
      }
      this.selector.get( name )?.(
        filePath,
        collectedFileMap,
        selectedFileSet,
      );
    } // for
  }

  /**
   * 選択された通過ファイルをストリームにプッシュする。<br>
   * ファイルの非同期読み込みの過負荷をp-limt で緩和させる。
   * @param {Stream} stream - Gulp stream
   * @param {object} settings - 設定オブジェクト
   * @param {Function} promiseReadAndPush - stream にファイルを読み込んでプッシュする関数
   * @returns {Promise<void>}
   */
  async pushSelectedFilesToStream( stream, settings, promiseReadAndPush ) {
    const
      name = settings.name
    ;
    const
      allFileMap = this.allFileMap.get( name )
      ,limit = pLmit( 5 )
      ,promiseReadFileAll = []
    ;
    for ( const filePath of this.selectedFileMap.get( name ) ) {
      const limitedTask = limit( () => promiseReadAndPush( filePath, allFileMap, stream ) );
      promiseReadFileAll.push( limitedTask );
    }
    await Promise.all( promiseReadFileAll );
  }

  /**
   * 各タスク名をkey にしてMap を親のMap に追加する。
   * @param {Sting} name - タスク名
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
   * @param {Sting} name - タスク名
   * @param {Map} parentMap - 親のMap
   */
  #setChildSetTo( name, parentMap ) {
    if ( parentMap.has( name ) === true ) {
      return;
    }
    parentMap.set( name, new Set() );
  }

  /**
   * 差分データに、filePath が含まれているか調べる。
   * @private
   * @param {string} filePath - ファイルの絶対パス
   * @returns {boolean} - true or false
   */
  #isFileInDiffData( filePath ) {
    const
      relativePath = path.relative( CWD, filePath ).replace( /[\\]/g, '/' )
      ,mergeDiffData = { ...this.currentDiffData, ...this.lastDiffData }
    ;
    return mergeDiffData && Object.keys( mergeDiffData ).includes( relativePath );
  }
}

/**
 * 候補ファイルに依存するファイルを再帰選択する。<br>
 * through2.obj()の flush function の内部で実行。<br>
 * 各タスクで汎用的に使用できるため、エクスポートする。
 * @memberof module:lib/diff_build
 * @param {string} filePath - ファイルパス
 * @param {Map} collectedFileMap - 収集した依存関係
 * @param {Set} selectedFileMap - 通過させるファイルパスの格納用
 */
function organizeSelectedFileMap( filepath, collectedFileMap, selectedFileMap ) {
  const visited = new Set();
  _recurse( filepath );
  function _recurse( path ) {
    if ( visited.has( path ) === true ) {
      return;
    }
    visited.add( path );
    const deps = collectedFileMap.get( path );
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
async function _promiseReadAndPushFileToStream( filePath, allFiles, stream ) {
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
 * @param {diffBuildProc} diffBuildProc - 差分ビルド処理を行うクラスのインスタンス
 * @param {object} settings - 設定
 * @returns {Promise<void>} - Promise
 */
async function _finalizeProcessor( diffBuildProc, settings ) {
  const
    name = settings.name
  ;
  const
    targetFileSet = diffBuildProc.targetFileMap.get( name )
    ,selectedFileSet = diffBuildProc.selectedFileMap.get( name )
  ;
  _logFileCount(
    name,
    targetFileSet.size,
    selectedFileSet.size,
  );
  if ( settings.isRefsEnabled === false ) {
    lastDiff.set( diffBuildProc.currentDiffData );
    await _writeDiffData();
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
  writingTimeoutId = setTimeout( async() => {
    try {
      await lastDiff.write();
    } catch ( err ) {
      throw err;
    } finally {
      writingTimeoutId = null;
    }
  }, WRITING_DELAY_TIME );
}

/**
 * 検知数と通過させた数のログを出力。
 * @private
 * @param {string} name - タスク名
 * @param {Number} detected - 検知されたファイル数
 * @param {Number} total - 通過したファイル数
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
 * git status 結果を整形<br>
 * git status -suall &lt;dir&gt;で得られるファイルパスをkey に、<br>
 * 属性（「M」 や「?」 など）をその値にして、 oject（差分データ） を作成。
 * @private
 * @param {string} command - git コマンド
 * @param {string} name - タスク名
 * @returns {Promise<object>} - 差分ファイルリスト
 */
function _getGitDiffData( settings, ref1, ref2 ) {
  const name = settings.name;
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
 * 渡された文字列をObject にして返す。
 * @private
 * @param {string} str - 基にする文字列
 * @returns {object} - 生成したObject
 */
function _createObjectFromDiffStdout( str, isRefsEnabled ) {
  const
    matches = str.matchAll( /^([^\r\n]+?)[^\f\r\n\S]+([^\r\n]+)\n/mg )
    ,renameSeparator = ( isRefsEnabled ) ? /\s+/ : /\s+->\s+/ //コマンドによって区切り文字が違うため。
    ,retObj = {}
  ;
  for ( const match of matches ) {
    let path = match[ 2 ];
    // リネームのステータスは変更前と変更後の2つのパスを示す文字列になるので、
    // リネーム後の文字列で置き換える。
    if ( match[ 1 ].indexOf( 'R' ) > -1 ) {
      path = path.split( renameSeparator )[ 1 ];
    }
    // 属性が?? の場合パス文字列ににダブルクォーテーションが含まれるので削除しておく。
    retObj[ path.replace( /"/g,'' ) ] = { status : match[ 1 ] };
  }
  return retObj;
}
