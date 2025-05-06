import { resolve, relative, sep, dirname } from 'node:path';
import { exec }                   from 'node:child_process';
import { readFile }               from 'node:fs/promises';

import through  from 'through2';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';
import pLmit    from 'p-limit';

import lastDiff from './last_diff.js';

const
  WRITING_DELAY_TIME = 2000
  ,MAX_BUFFER_SIZE = 1024 * 1024 * 10
;
const
  defaultSettings = {
    name      : '',
    group     : '',
    enabled   : true,
    command   : 'git status -suall',
    oneToOne  : false,
    allForOne : false,
  }
;
let
  writingTimeoutId = null
  ,myProcessor = null
;
export {
  diff_build as default,
  organizeSelectedFileMap,
};

/**
/* Git で管理する前提での差分ビルド。
 * diff コマンドで検知されたファイルのみを対象とする。
 * @param {Object} options - オプション
 * @param {Function} collect - 依存関係収集用コールバック
 * @param {Function} select - 通過ファイル選択用コールバック
 */
function diff_build( options, collect, select ) {

  const settings = { ...defaultSettings, ...options };
  if ( settings.enabled === false ) {
    return through.obj();
  }

  if ( typeof settings.group !== '' ) {
    settings.group = settings.group.replace( /\//g, sep );
  }
  // モジュールスコープのmyProcessor がnull の場合にのみ初期化。
  if ( !myProcessor ) {
    myProcessor = new DiffBuildProcessor();
    // リスナ-登録でthis の参照が代わらないようにmyProcessor にbind 。
    myProcessor.resetSharedState = myProcessor.resetSharedState.bind( myProcessor );
    // myProcessor の共有する値を初期化するメンバ関数をリスナー登録。
    _addResetStateListeners(
      myProcessor.resetSharedState,
      settings.eventNameOnInit,
      settings.eventNameOnReset,
    );
  }
  // 差分データ取得のPromise を共有。
  if ( !myProcessor.promiseGetGitDiffData ) {
    myProcessor.promiseGetGitDiffData  = _getGitDiffData( settings.command, settings.name );
    myProcessor.promiseGetLastDiffData = lastDiff.get();
  }
  // 被依存ファイル情報の収集用コールバックを各タスク毎保有する。
  if ( collect ) {
    myProcessor.collector.set( settings.name, collect );
  }
  // 最終選択用コールバックを各タスク毎保有する。
  if ( select ) {
    myProcessor.selector.set( settings.name, select );
  }

  return ( settings.oneToOne === true )
    ? _createOneToOneFilesStream( myProcessor, settings )
    : _createDependencyFilesStream( myProcessor, settings )
  ;
}

/**
 * 各タスクの最初の実行後と、その後のsrc 更新毎にだけ差分データを取得する意図。
 * @param {Function} resetSharedState - リスナー関数
 * @param {String} eventNameOnInit - 発行元のイベント名で、コマンドで最初の1度の呼び出しを想定。
 * @param {String} eventNameOnReset - 発行元のイベント名で、Watch 等で待機中にSrc が更新される度に呼び出す想定。
 */
function _addResetStateListeners( resetSharedState, eventNameOnInit, eventNameOnReset ) {
  // 多重回数の呼び出しを抑止するため、1度remove しておく。
  process.removeListener( eventNameOnInit, resetSharedState );
  process.removeListener( eventNameOnReset, resetSharedState );
  // eventNameOnInit のリスナーは1回の呼び出し。
  // eventNameOnReset のリスナーはSrc の更新毎の呼び出し。
  process.once( eventNameOnInit, resetSharedState );
  process.on( eventNameOnReset,  resetSharedState );
}

/**
 * One source → One destination 用のストリーム作成。
 * Git Diff で検知されたfile のみを対象にする。
 * @param {DiffBuildProcessor} myProcessor - 差分処理プロセッサ
 * @param {Object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createOneToOneFilesStream( myProcessor, settings ) {
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // 選定、収集、選択用のMap 及び Set オブジェクトを準備。
        myProcessor.setUpChildMaps( settings );
        // 対象ファイルを選定。
        await myProcessor.filterByGitDiff( file, settings );
        if ( myProcessor.targetFileMap.get( settings.name ).has( file.path ) === false ) {
          return callback();
        }
        // Gulp src のオプション、{read :false } でfile.contents はnull なので、
        // 改めてfile を読み込み、file.contents に代入する。
        await myProcessor.setFileContents( file, settings );
        callback( null, file );
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        await _finalizeProcessor( myProcessor, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
  );
}

/**
 * 依存関を伴う他のファイルも含めるストリームを作成。
 * 例えば、Pug、Sass のコンパイルタスク用。
 * or
 * 渡されてきたファイル以外に必要な対象ファイルを併せてstream に渡す。
 * 例えば、iconFont sprite.smithなどのタスク用。
 * @param {Object} myProcessor - 差分処理プロセッサ
 * @param {Object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createDependencyFilesStream( myProcessor, settings ) {
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // 選定、収集、選択用のMap 及び Set オブジェクトを準備。
        myProcessor.setUpChildMaps( settings );
        // いったんすべてのファイル情報を収集。
        myProcessor.collectAllFiles( file, settings );
        // 対象ファイルを選定。
        await myProcessor.filterByGitDiff( file, settings );
        // グループ情報を整理。
        if ( settings.group ) {
          myProcessor.assignGroup( file, settings );
        }
        // 依存関係にあるファイルを収集。
        myProcessor.collectImporterFiles( file, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        // 削除されたファイルも対象にする。
        myProcessor.collectDeletedFiles( settings );
        if ( settings.group ) {
          // 所属する同じグループのファイルも選択。
          myProcessor.selectGroupedFiles( settings );
        } else if ( settings.allForOne === true ) {
          // すべてのファイルの情報を選択。
          myProcessor.selectAllFiles( settings );
        } else {
          // 収集した依存関係にあるファイルからstream に渡したいファイルを選択。
          myProcessor.selectFilesFromCollection( settings );
        }
        // 選択されたファイルをstream に渡す。
        await myProcessor.pushSelectedFilesToStream( this, settings );
        await _finalizeProcessor( myProcessor, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    }
  );
}

/**
 * 差分ビルド処理を行うクラス。
 * Git の差分データを基に、対象ファイルの選定や依存関係の収集、グループ化などを行う。
 * また、選定されたファイルをストリームに渡す処理も提供する。
 */
class DiffBuildProcessor {

  constructor() {
    this.collector = new Map();
    this.selector  = new Map();
    this.allFileMap = new Map();
    this.targetFileMap = new Map();
    this.selectedFileMap = new Map();
    this.collectedFileMap = new Map();
    this.currentDiffData = null;
    this.lastDiffData = null;
    this.promiseGetGitDiffData = null;
    this.promiseGetLastDiffData = null;
  }

  /**
   * exec は処理が重く、各タスクでPromis を共有させるが、その際、
   * すべてのタスクの実行後とその後のwatch タスクの開始時にだけ差分データを再取得させる意図。
   * 新たな差分データ取得に伴い、各共有データも初期化する。
   * 各タスクの最初の実行後と、その後のsrc 更新毎に初期化する。
   */
  resetSharedState() {
    this.allFileMap = new Map();
    this.targetFileMap = new Map();
    this.selectedFileMap = new Map();
    this.collectedFileMap = new Map();
    this.currentDiffData = null;
    this.lastDiffData = null;
    this.promiseGetGitDiffData = null;
    this.promiseGetLastDiffData = null;
  }

  /**
   * 選定、収集、選択用のMap 及び Set オブジェクトを各タスク事に準備する。
   * @param {Object} settings - 設定オブジェクト
   */
  setUpChildMaps( settings ) {
    const taskName = settings.name;
    this.#setChildMapTo( taskName, this.allFileMap );
    this.#setChildSetTo( taskName, this.targetFileMap );
    this.#setChildMapTo( taskName, this.collectedFileMap );
    this.#setChildSetTo( taskName, this.selectedFileMap );
  }

  /**
   * Git で差分データを取得して対象ファイルを選定。
   * 差分データに無い場合も、直近の差分データにあれば対象ファイルにする。
   * そうしなければ、git のrevert などが未検知になってしまうため。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Object} settings - 設定オブジェクト
   * @returns {Promise<void>}
   */
  async filterByGitDiff( file, settings ) {
    try {
      const
        myTaskName = settings.name
        ,myTargetFileSet = this.targetFileMap.get( myTaskName )
      ;
      this.currentDiffData = await this.promiseGetGitDiffData;
      this.lastDiffData    = await this.promiseGetLastDiffData;
      if (
        _includes( this.currentDiffData, file.path ) ||
        _includes( this.lastDiffData, file.path )
      ) {
        myTargetFileSet.add( file.path );
      }
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * one source → one destination 用。
   * Gulp.src のオプション、 { read: false } の速さに期待して。
   * contents をreadFile で改めて読み込み、file.contents に代入する。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Object} settings - 設定オブジェクト
   * @returns {Promise<void>}
   */
  async setFileContents( file, settings ) {
    const
      myTaskName = settings.name
      ,mySelectedFileSet = this.selectedFileMap.get( myTaskName )
    ;
    try {
      file.contents = await readFile( file.path );
      mySelectedFileSet.add( file.path );
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * すべてのファイル情報を収集。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Object} settings - 設定オブジェクト
   */
  collectAllFiles( file, settings ) {
    const
      myTaskName = settings.name
      ,myAllFileMap = this.allFileMap.get( myTaskName )
    ;
    myAllFileMap.set( file.path, file.clone() );
    // file.contents プロパティのなかで一番容量が大きいので、
    // このライフサイクル中はいったんnull を代入する。
    // 最終的に選択された際に再代入する。
    myAllFileMap.get( file.path ).contents = null;
  }

  /**
   * グループ情報を設定。
   * 複数のsrc ファイルを1つのdist にするようなタスク用。
   * 自身のパスがkey の値（file オブジェクト）に、
   * group プロパティを追加する。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Object} settings - 設定オブジェクト
   */
  assignGroup( file, settings ) {
    const
      myTaskName = settings.name
      ,myAllFileMap = this.allFileMap.get( myTaskName )
      ,group = settings.group
      ,groupIndex = file.path.indexOf( group )
      ,groupPath = file.path.slice( 0, groupIndex + group.length )
    ;
    // groupPath は設定された任意のグループ名（ディレクトリ名）を末尾に持つフルのパス。
    myAllFileMap.get( file.path ).group = groupPath;
  }

  /**
   * 依存関係からインポート元のファイルを収集。
   * ファイルの依存関係をCallback で収集してもらう。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Object} settings - 設定オブジェクト
   */
  collectImporterFiles( file, settings ) {
    const
      myTaskName = settings.name
      ,myCollectedFileMap = this.collectedFileMap.get( myTaskName )
     ;
    this.collector.get( myTaskName )?.( file, myCollectedFileMap );
  }

  /**
   * 消去されたファイルも対象にする。
   * @param {Object} settings - 設定オブジェクト
   */
  collectDeletedFiles( settings ) {
    const
      myTaskName = settings.name
      ,myTargetFileSet = this.targetFileMap.get( myTaskName )
      ,myAllFileMap = this.allFileMap.get( myTaskName )
      ,mergeDiffData = { ...this.currentDiffData, ...this.lastDiffData }
    ;
    for ( const [ filePathOfDiffData, info ] of Object.entries( mergeDiffData ) ) {
      if ( info.status.includes( 'D' ) === false && info.status.includes( '?' ) === false ) {
        continue;
      }
      const
        resolveFilePathOfDiffData = resolve( process.cwd(), filePathOfDiffData )
        ,dirNameOfDiffData = dirname( resolveFilePathOfDiffData )
      ;
      for ( const [ , fileOfMap ] of myAllFileMap ) {
        if ( myTargetFileSet.has( resolveFilePathOfDiffData ) === true ) {
          continue;
        }
        if ( dirNameOfDiffData === fileOfMap?.group ) {
          myTargetFileSet.add( resolveFilePathOfDiffData );
        }
      }
    }
  }

  /**
   * 例えば候補が1ファイルでも、所属している同じグループのその他のファイルも選択する。
   * 複数src ファイルを1つに束ねる様なタスク用。
   * @param {Object} settings - 設定オブジェクト
   */
  selectGroupedFiles( settings ) {
    const
      myTaskName = settings.name
      ,myTargetFileSet = this.targetFileMap.get( myTaskName )
      ,myAllFileMap = this.allFileMap.get( myTaskName )
      ,mySelectedFileSet = this.selectedFileMap.get( myTaskName )
      ,group = settings.group
    ;
    for ( const targetFilePath of myTargetFileSet ) {
      const
        targetGroup = myAllFileMap.get( targetFilePath )?.group
        ,groupIndex = targetFilePath.indexOf( group )
        ,myGroup = targetFilePath.slice( 0, groupIndex + group.length )
      ;
      for ( const [ filePath, file ] of myAllFileMap ) {
        if (
          ( targetGroup && filePath.startsWith( targetGroup ) )
          || myGroup === file?.group
        ) {
          mySelectedFileSet.add( filePath );
        }
      } // for
    } // for
  }

  /**
   * 収集したすべてのファイルパス情報をselectedMap に追加する。
   * @param {Object} settings - 設定オブジェクト
   */
  selectAllFiles( settings ) {
    const
      myTaskName = settings.name
      ,mySelectedFileSet = this.selectedFileMap.get( myTaskName )
      ,myAllFileMap = this.allFileMap.get( myTaskName )
    ;
    for ( const [ filePath ] of myAllFileMap ) {
      mySelectedFileSet.add( filePath );
    }
  }

  /**
   * 収集した依存関係ファイルからstream に渡したいファイルを選択。
   * Callback で選択してもらう。
   * @param {Object} settings - 設定オブジェクト
   */
  selectFilesFromCollection( settings ) {
    const
      myTaskName = settings.name
      ,myTargetFileSet = this.targetFileMap.get( myTaskName )
      ,myCollectedFileMap = this.collectedFileMap.get( myTaskName )
      ,mySelectedFileSet = this.selectedFileMap.get( myTaskName )
      ,myAllFileMap = this.allFileMap.get( myTaskName )
    ;
    for ( const filePath of myTargetFileSet ) {
      const collection = myCollectedFileMap.get( filePath );
      if ( Array.isArray( collection ) === true ) {
        collection.forEach( ( depPath ) => mySelectedFileSet.add( depPath ) );
      }
      if ( myAllFileMap.has( filePath ) === true ) {
        mySelectedFileSet.add( filePath );
      } else {
        continue;
      }
      this.selector.get( myTaskName )?.(
        filePath,
        myCollectedFileMap,
        mySelectedFileSet,
      );
    } // for
  }

  /**
   * 選択された通過ファイルをstream にプッシュする。
   * @param {Stream} stream - Gulp stream
   * @param {Object} settings - 設定オブジェクト
   * @returns {Promise<void>}
   */
  async pushSelectedFilesToStream( stream, settings ) {
    const
      myTaskName = settings.name
      ,myAllFileMap = this.allFileMap.get( myTaskName )
      ,limit = pLmit( 5 )
      ,promiseReadFileAll = []
    ;
    for ( const filePath of this.selectedFileMap.get( myTaskName ) ) {
      const limitedTask = limit(
        () => _promisePushReadFileToStream( filePath, myAllFileMap, stream )
      );
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

}

/**
 * 候補ファイルに依存するファイルを再帰選択する。
 * through2.obj()の flush function の内部で実行。
 * @param {String} filePath - ファイルパス
 * @param {Object} collectedFileMap - 収集した依存関係
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
    if ( Array.isArray( deps ) ) {
      deps.forEach( ( dep ) => {
        selectedFileMap.add( dep );
        if ( collectedFileMap.has( dep ) === true ) {
          _recurse( dep );
        }
      } );
    }
  }
}

/**
 * ファイルを読み込みストリームにプッシュする。
 * @param {String} filePath - ファイルパス
 * @param {Map} allFiles - 全chunk用
 * @param {Stream} stream - Gulp stream
 * @returns {Promise<void>}
 */
async function _promisePushReadFileToStream( filePath, allFiles, stream ) {
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
 * プロセスの最終処理。
 * @param {Object} myProcessor - DiffBuildProcessor
 * @param {Object} settings - 設定
 * @returns {Promise<void>}
 */
async function _finalizeProcessor( myProcessor, settings ) {
  const
    myTaskName = settings.name
    ,myTargetFileSet = myProcessor.targetFileMap.get( myTaskName )
    ,mySelectedFileSet = myProcessor.selectedFileMap.get( myTaskName )
  ;

  lastDiff.set( myProcessor.currentDiffData );
  _log(
    myTaskName,
    myTargetFileSet.size,
    mySelectedFileSet.size,
  );
  await _writeDiffData();
}

/**
 * 差分一覧のファイルへの書き込み。
 * ある程度時間を置いての処理で良いため、連続の呼び出しは、間引く。
 * @returns {Promise<void>}
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
 * 検知数と通過させた数のログ。
 * @param {String} name - タスク名
 * @param {Number} detected - 検知数
 * @param {Number} total - 通過数
 */
function _log( name, detected, total ) {
  if ( name ) {
    fancyLog( chalk.gray( `[${ name }]: detected ${ detected } files diff` ) );
    fancyLog( chalk.gray( `[${ name }]: passed ${ total } files` ) );
  }
}

/**
 * 差分ファイルリストに、filePath が含まれているか調べる。
 * @param {Object} diffData - 差分ファイルリスト
 * @param {String} filePath - ファイルパス
 * @returns {Boolean} - true or false
 */
function _includes( diffData, filePath ) {
  const relativePath = relative( process.cwd(), filePath ).replace( /[\\]/g, '/' );
  return diffData && Object.keys( diffData ).includes( relativePath );
}

/**
 * git status 結果を整形
 * 'git status -suall <dir>'で得られるファイルパスをkey に、
 * 属性（「M」 や「?」 など）をその値に、
 * oject（差分ファイルリスト） の作成。
 * @param {String} command - git コマンド
 * @param {String} name - タスク名
 * @returns {Promise<Object>} - 差分ファイルリスト
 */
function _getGitDiffData( command, name ) {
  return new Promise( ( resolvePromise, rejectPromise ) => {
    exec( command, { maxBuffer : MAX_BUFFER_SIZE }, ( err, stdout, stderr ) => {
      if ( err ) {
        return rejectPromise( err );
      }
      if ( stderr ) {
        fancyLog.warn( chalk.yellow( `${ name }\n${ stderr }` ) );
      }
      if ( stdout ) {
        return resolvePromise( _createObjectFromStrings( stdout ) );
      }
      return resolvePromise( {} );
    } );
  } );
}

/**
 * 渡された文字列をObject にして返す。
 * @param {string} str - 基にする文字列
 * @returns {Object} - 生成したObject
 */
function _createObjectFromStrings( str ) {
  const
    matches = str.matchAll( /^(.{2})\s([^\n]+?)\n/mg )
    ,retObj = {}
  ;
  for ( const match of matches ) {
    let path = match[ 2 ];
    // リネームの際の文字列をリネーム後のパスの形に変換する。
    if ( path.indexOf( ' -> ' ) > -1 ) {
      path = path.split( ' -> ' )[ 1 ];
    }
    // 属性が?? の場合パス文字列ににダブルクォーテーションが含まれるので削除しておく。
    retObj[ path.replace( /"/g,'' ) ] = { status : match[ 1 ] };
  }
  return retObj;
}
