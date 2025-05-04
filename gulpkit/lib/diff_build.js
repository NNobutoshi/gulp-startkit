import { resolve, relative, sep } from 'node:path';
import { exec }                   from 'node:child_process';
import { readFile }               from 'node:fs/promises';

import through  from 'through2';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';
import pLmit    from 'p-limit';

import lastDiff from './last_diff.js';

const
  WRITING_DELAY_TIME = 2000
  ,EVENT_NAME_WATCH_INIT = 'myWatchInit'
  ,EVENT_NAME_WATCH_START = 'myWatchStart'
;
const
  defaultSettings = {
    name    : '',
    group   : '',
    enabled : true,
    command : 'git status -suall',
  }
;
let
  writingTimeoutId = null
  ,myProcessor = null
  ,promiseGetGitDiffData = null
  ,promiseGetLastDiffData = null
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
 * @param {Function} select - 通過候補選択用コールバック
 */
function diff_build( options, collect, select ) {

  const settings = { ...defaultSettings, ...options };

  if ( settings.enabled === false ) {
    return through.obj();
  }
  if ( typeof settings.group !== '' ) {
    settings.group = settings.group.replace( /[/\\]/g, sep );
  }

  myProcessor = myProcessor || new DiffBuildProcessor( settings, collect, select );

  if ( !promiseGetGitDiffData || !promiseGetLastDiffData ) {
    promiseGetGitDiffData  = _getGitDiffData( settings.command, settings.name );
    promiseGetLastDiffData = lastDiff.get();
  }

  if ( myProcessor.collector.has( settings.name ) === false ) {
    myProcessor.collector.set( settings.name, collect );
  }

  if ( myProcessor.selector.has( settings.name ) === false ) {
    myProcessor.selector.set( settings.name, select );
  }

  // myProcessor の共有する値の初期化
  _addResetStateListeners( myProcessor );

  return ( settings.oneToOne === true )
    ? _createOneToOneStream( myProcessor, settings )
    : _createDependencyStream( myProcessor, settings )
  ;
}

/**
 * 各タスクの最初の実行後と、その後のWatch の実行の時にだけ差分データを取得する意図。
 */
function _addResetStateListeners( myProcessor ) {
  process.removeListener( EVENT_NAME_WATCH_INIT, myProcessor.resetSharedState );
  process.removeListener( EVENT_NAME_WATCH_START, myProcessor.resetSharedState );
  if ( process.listenerCount( EVENT_NAME_WATCH_INIT ) === 0 ) {
    process.on( EVENT_NAME_WATCH_INIT, myProcessor.resetSharedState );
  }
  if ( process.listenerCount( EVENT_NAME_WATCH_START ) === 0 ) {
    process.on( EVENT_NAME_WATCH_START,  myProcessor.resetSharedState );
  }
}

/**
 * one source → one destination 用のストリーム作成。
 * Git Diff で検知されたfile のみを対象にする。
 * @param {DiffBuildProcessor} myProcessor - 差分処理プロセッサ
 * @param {Object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createOneToOneStream( myProcessor, settings ) {
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
        // 改めてfile を読み込み、file.contents に代入する。
        await myProcessor.setFileContents( file, settings );
        callback( null, file );
      } catch ( err ) {
        callback( err );
      }
    },
    function _flush( callback ) {
      try {
        _finalizeProcessor( myProcessor, settings );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
  );
}

/**
 * 依存関係用のストリームを作成。
 * 渡されてきたファイルが依存するその他のファイルを調べ、それらのファイルも一緒にstream に渡す。
 * 例えば、pug、sass のコンパイルタスク用。
 * or
 * 渡されてきたファイル以外に必要な対象ファイルを併せてstream に渡す。
 * 例えば、iconFont sprite.smithなどのタスク用。
 * @param {DiffBuildProcessor} myProcessor - 差分処理プロセッサ
 * @param {Object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createDependencyStream( myProcessor, settings ) {
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // 選定、収集、選択用のMap 及び Set オブジェクトを準備。
        myProcessor.setUpChildMaps( settings );
        // すべてのファイル情報を収集。
        myProcessor.collectAllFiles( file, settings );
        await myProcessor.filterByGitDiff( file, settings );
        // グループ情報を設定。
        if ( settings.group ) {
          myProcessor.assignGroup( file, settings );
        }
        // 依存関係を収集。
        myProcessor.collectDependencies( file, settings );
        // 対象ファイルを選定。
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        // 削除されたファイルも対象にする。
        myProcessor.collectDeletedFiles( settings );
        // Git が未追跡のファイルも対象にする。
        myProcessor.collectUntrackedFiles( settings );
        if ( settings.group ) {
          // 所属する同じグループのファイルも選択。
          myProcessor.selectGroupedFiles( settings );
        } else if ( settings.allForOne === true ) {
          // すべてのファイルの情報を選択。
          myProcessor.selectAllFiles( settings );
        } else {
          // 収集した依存ファイルからstream に渡したいファイルを選択。
          myProcessor.selectFilesFromCollection( settings );
        }
        // 収集した依存ファイルからファイルを選択し、stream に渡す。
        await myProcessor.pushSelectedFilesToStream( this, settings );
        _finalizeProcessor( myProcessor, settings );
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
  }

  /**
   * exec は処理が重く、各タスクでPromis を共有させるが、
   * すべてのタスクの実行後とその後のwatch タスクの開始時にだけ差分データを再取得させる意図。
   */
  resetSharedState() {
    this.currentDiffData = null;
    this.lastDiffData = null;
    promiseGetGitDiffData = null;
    promiseGetLastDiffData = null;
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
   * グループ情報を設定。
   * 複数のsrc ファイルを一つのdist にするようなタスク用。
   * 自身のパスをkey に、所属するグループ（設定ファイルで付けられた任意のディレクトリ名）を値に。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Object} settings - 設定オブジェクト
   */
  assignGroup( file, settings ) {
    const
      taskName    = settings.name
      ,group      = settings.group
      ,groupIndex = file.path.indexOf( group )
      ,groupPath  = file.path.slice( 0, groupIndex + group.length )
    ;
    this.allFileMap.get( taskName ).get( file.path ).group = groupPath;
  }

  /**
   * 依存関係を収集。
   * ファイルの依存関係をCallback で収集してもらう。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Object} settings - 設定オブジェクト
   */
  collectDependencies( file, settings ) {
    const
      taskName = settings.name
    ;
    this.collector.get( taskName )?.( file, this.collectedFileMap.get( taskName ) );
  }

  /**
   * Git 差分データを取得して対象ファイルを選定。
   * 差分データに無い場合も、直近の差分データにあれば対象ファイルにする。
   * そうしなければ、git のrevert などが未検知になってしまうため。
   * @param {Object} settings - 設定オブジェクト
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  async filterByGitDiff( file, settings ) {
    try {
      const taskName = settings.name;
      this.currentDiffData = await promiseGetGitDiffData;
      this.lastDiffData    = await promiseGetLastDiffData;
      if (
        _includes( this.currentDiffData, file.path ) ||
        _includes( this.lastDiffData, file.path )
      ) {
        this.targetFileMap.get( taskName ).add( file.path );
      }
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * one source → one destination 用。
   * Gulp.src のオプション、 { read: false } の速さに期待して。
   * contents をreadFile で改めて読み込み、file.contents に代入する。
   * @param {Object} settings - 設定オブジェクト
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  async setFileContents( file, settings ) {
    const taskName = settings.name;
    try {
      file.contents = await readFile( file.path );
      this.selectedFileMap.get( taskName ).add( file.path );
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * すべてのファイル情報を収集。
   * @param {Sting} name - タスク名
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  collectAllFiles( file, settings ) {
    const taskName = settings.name;
    this.allFileMap.get( taskName ).set( file.path, file.clone() );
    // プロパティのなかで一番容量が大きいので。後で必要なものだけ読み込み直す。
    this.allFileMap.get( taskName ).get( file.path ).contents = null;
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
   * 消去されたファイルも対象にする。
   * @param {Sting} name - タスク名
   */
  collectDeletedFiles( settings ) {
    const taskName = settings.name;
    for ( const [ filePath, info ] of Object.entries( this.currentDiffData ) ) {
      if ( info.status.includes( 'D' ) ) {
        this.targetFileMap.get( taskName ).add( resolve( process.cwd(), filePath ) );
      }
    }
  }

  /**
   * Git が未追跡のファイルも対象にする。
   * @param {Sting} name - タスク名
   */
  collectUntrackedFiles( settings ) {
    const taskName = settings.name;
    for ( const [ filePath, info ] of Object.entries( this.currentDiffData ) ) {
      if (
        !this.currentDiffData[ filePath ] && info.status.includes( '?' )
      ) {
        this.targetFileMap.get( taskName ).add( resolve( process.cwd(), filePath ) );
      }
    }
  }

  /**
   * 例えば候補が1ファイルでも、所属している同じグループのその他のファイルも選択する。
   * 複数src ファイルを一つに束ねる様なタスク用。
   * @param {Sting} name - タスク名
   * @param {String} group - グループ名
   */
  selectGroupedFiles( settings ) {
    const
      taskName = settings.name
      ,group = settings.group
    ;
    for ( const targetFilePath of this.targetFileMap.get( taskName ) ) {
      const
        targetGroup = this.allFileMap.get( taskName ).get( targetFilePath )?.group
        ,groupIndex = targetFilePath.indexOf( group )
        ,myGroup    = targetFilePath.slice( 0, groupIndex + group.length )
      ;
      for ( const [ filePath, file ] of this.allFileMap.get( taskName ) ) {
        if (
          ( targetGroup && filePath.startsWith( targetGroup ) )
          || myGroup === file?.group
        ) {
          this.selectedFileMap.get( taskName ).add( filePath );
        }
      } // for
    } // for
  }

  /**
   * 収集したすべてのファイルパス情報をselectedMap に追加する。
   * @param {Sting} name - タスク名
   */
  selectAllFiles( settings ) {
    const taskName = settings.name;
    for ( const [ filePath ] of this.allFileMap.get( taskName ) ) {
      this.selectedFileMap.get( taskName ).add( filePath );
    }
  }

  /**
   * 収集した依存ファイルからstream に渡したいファイルを選択。
   * callback 関数で選択してもらう。
   * @param {Sting} name - タスク名
   */
  selectFilesFromCollection( settings ) {
    const taskName = settings.name;
    for ( const filePath of this.targetFileMap.get( taskName ) ) {
      const collection = this.collectedFileMap.get( filePath );
      if ( collection ) {
        collection.forEach( ( depPath ) => this.selectedFileMap.get( taskName ).add( depPath ) );
      }
      if ( this.allFileMap.get( taskName ).has( filePath ) === true ) {
        this.selectedFileMap.get( taskName ).add( filePath );
      } else {
        continue;
      }
      this.selector.get( taskName )?.(
        filePath,
        this.collectedFileMap.get( taskName ),
        this.selectedFileMap.get( taskName ),
      );
    } // for
  }

  /**
   * 選択された通過ファイルをstream にプッシュする。
   * @param {Sting} name - タスク名
   * @param {Stream} stream - Gulp stream
   * @returns {Promise} - プロミス
   */
  async pushSelectedFilesToStream( stream, settings ) {
    const
      taskName = settings.name
      ,limit = pLmit( 5 )
      ,promiseReadFileAll = []
    ;
    for ( const filePath of this.selectedFileMap.get( taskName ) ) {
      const limitedTask = limit(
        () => _promisePushReadFileToStream( filePath, this.allFileMap.get( taskName ), stream )
      );
      promiseReadFileAll.push( limitedTask );
    }
    await Promise.all( promiseReadFileAll );
  }

}

/**
 * 候補ファイルに依存するファイルを再帰選択する。
 * through2.obj()の flush function の内部で実行。
 * @param {String} filePath - ファイルパス
 * @param {Object} collectedFiles - 収集した依存関係
 * @param {Set} selectedFiles - 通過させるファイルパスの格納用
 */
function organizeSelectedFileMap( filepath, collectedFiles, selectedFiles ) {
  _recurse( filepath );
  function _recurse( path ) {
    const deps = collectedFiles.get( path );
    if ( Array.isArray( deps ) ) {
      deps.forEach( ( dep ) => {
        selectedFiles.add( dep );
        if ( collectedFiles.has( dep ) === true ) {
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
 * @param {Function} callback - コールバック
 */
function _finalizeProcessor( myProcessor, settings ) {
  const taskName = settings.name;
  lastDiff.set( myProcessor.currentDiffData );
  _writeDiffData();
  _log(
    taskName,
    myProcessor.targetFileMap.get( taskName ).size,
    myProcessor.selectedFileMap.get( taskName ).size,
  );
  // 各Map はタスク毎に消去する。
  myProcessor.allFileMap.delete( taskName );
  myProcessor.collectedFileMap.delete( taskName );
  myProcessor.targetFileMap.delete( taskName );
  myProcessor.selectedFileMap.delete( taskName );
}

/**
 * 差分一覧のファイルへの書き込み。
 * ある程度時間を置いての処理で良いため、連続の呼び出しは、間引く。
 */
function _writeDiffData() {
  clearTimeout( writingTimeoutId );
  writingTimeoutId = setTimeout( () => {
    lastDiff.write();
    clearTimeout( writingTimeoutId );
    writingTimeoutId  = null;
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
 * @param {Object} data - 差分ファイルリスト
 * @param {String} filePath - ファイルパス
 * @returns {Boolean} - true or false
 */
function _includes( data, filePath ) {
  const relativePath = relative( process.cwd(), filePath ).replace( /[\\]/g, '/' );
  return data && Object.keys( data ).includes( relativePath );
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
    exec( command, ( err, stdout, stderr ) => {
      if ( err ) {
        return rejectPromise( err );
      }
      if ( stderr ) {
        fancyLog.warn( chalk.yellow( `${ name }\n${ stderr }` ) );
      }
      if ( stdout ) {
        return resolvePromise( _createObjectFromStrings( stdout ) );
      }
      return resolve( {} );
    } );
  } );
}

/**
 * 渡された文字列をObject にして返す。
 * @param {string} str - 基にする文字列
 * @returns {Object} 生成したObject
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
    retObj[ path.replace( /"/g,'' ) ] = { status : match[ 1 ] };
  }
  return retObj;
}
