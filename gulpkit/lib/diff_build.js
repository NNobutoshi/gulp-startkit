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
  ,EVENT_NAME_WATCH_START = 'myWatchStart'
  ,EVENT_NAME_WATCH_FINISH = 'myWatchFinish'
;
const
  defaultSettings = {
    name      : '',
    allForOne : false,
    enabled   : true,
    command   : 'git status -suall',
  }
;
let
  writingTimeoutId = null
  ,promiseGetGitDiffData = null
  ,promiseGetLastDiffData = null
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
 * @param {Function} select - 通過候補選択用コールバック
 */
function diff_build( options, collect, select ) {

  const settings = { ...defaultSettings, ...options };

  if ( settings.enabled === false ) {
    return through.obj();
  }

  if ( !promiseGetGitDiffData || !promiseGetLastDiffData ) {
    promiseGetGitDiffData  = _getGitDiffData( settings.command, settings.name );
    promiseGetLastDiffData = lastDiff.get( settings.name );
  }

  myProcessor = myProcessor || new DiffBuildProcessor( settings, collect, select );

  if ( myProcessor.collector.has( settings.name ) === false ) {
    myProcessor.collector.set( settings.name, collect );
  }

  if ( myProcessor.selector.has( settings.name ) === false ) {
    myProcessor.selector.set( settings.name, select );
  }

  /*
   * 各タスクの最初の実行後と、その後のWatch の実行の時にだけ差分データを取得する意図。
   */
  process.removeListener( EVENT_NAME_WATCH_START, _resetSharedObject );
  process.removeListener( EVENT_NAME_WATCH_FINISH, _resetSharedObject );

  if ( process.listenerCount( EVENT_NAME_WATCH_START ) === 0 ) {
    process.on( EVENT_NAME_WATCH_START, _resetSharedObject );
  }

  if ( process.listenerCount( EVENT_NAME_WATCH_FINISH ) === 0 ) {
    process.on( EVENT_NAME_WATCH_FINISH,  _resetSharedObject );
  }

  return ( settings.oneToOne === true )
    ? _createOneToOneStream( myProcessor, settings )
    : _createDependencyStream( myProcessor, settings )
  ;
}

/**
 * exec は処理が重く、各タスクで共有させるが、
 * すべてのタスクの実行後とその後のwatch タスクの開始時にだけ差分データを再取得させる意図。
 */
function _resetSharedObject() {
  myProcessor = null;
  promiseGetGitDiffData = null;
  promiseGetLastDiffData = null;
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
        await myProcessor.setFileContentsByGitDiff( settings.name, file, callback );
      } catch ( err ) {
        callback( err );
      }
    },
    function _flush( callback ) {
      try {
        _finalizeProcessor( myProcessor, settings, callback );
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
        await myProcessor.collectAndGroupFiles( file, settings, callback );
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        if ( myProcessor.currentDiffData !== null ) {
          await myProcessor.finalizeFileStream( settings, this );
          _finalizeProcessor( myProcessor, settings, callback );
        }
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

  constructor( settings ) {
    this.settings = settings;
    this.collector = new Map();
    this.selector  = new Map();
    this.lastDiff = lastDiff;
    this.allFileMap = new Map();
    this.targetFileMap = new Map();
    this.selectedFileMap = new Map();
    this.collectedFileMap = new Map();
    this.promiseGetGitDiffData = promiseGetGitDiffData;
    this.promiseGetLastDiffData = promiseGetLastDiffData;
  }

  /**
   * Git 差分データを基に、対象ファイルの内容を設定。
   * 対象ファイルが差分リストに含まれている場合、その内容を読み込み、
   * file.contents に代入し、選択されたファイルリストに追加する。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Function} callback - 処理完了時に呼び出されるコールバック関数
   */
  async setFileContentsByGitDiff( name, file, callback ) {
    // 対象ファイルを選定
    this.#setChildSetTo( name, this.targetFileMap );
    this.#setChildSetTo( name, this.selectedFileMap );
    await this.#filterByGitDiff( name, file );
    if ( this.targetFileMap.get( name ).has( file.path ) === false ) {
      return callback();
    }
    // 改めてfile を読み込み、file.contents に代入する。
    await this.#setFileContents( name, file );
    callback( null, file );
  }

  /**
   * ファイルを収集し、必要に応じてグループ化を行う。
   * 対象ファイルを差分データに基づいて選定し、依存関係を収集する。
   * グループ化が設定されている場合、ファイルにグループ情報を付与する。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Function} callback - 処理完了時に呼び出されるコールバック関数
   */
  async collectAndGroupFiles( file, settings, callback ) {
    if ( typeof this.settings.allForOne === 'string' ) {
      this.settings.group = this.settings.allForOne.replace( /[/\\]/g, sep );
    } else {
      this.settings.group = false;
    }
    this.#setChildMapTo( settings.name, this.allFileMap );
    this.#setChildSetTo( settings.name, this.targetFileMap );
    this.#setChildMapTo( settings.name, this.collectedFileMap );
    // すべてのファイル情報を収集。
    this.#collectAllFiles( settings.name, file );
    // 対象ファイルを選定。
    await this.#filterByGitDiff( settings.name, file );
    // グループ情報を設定。
    if ( this.settings.group ) {
      this.#assignGroup( file, settings.name, settings.group );
    }
    // 依存関係を収集。
    this.#collectDependencies( settings.name, file );
    callback();
  }

  /**
   * ストリームの最終処理を行う。
   * 削除されたファイルや未追跡のファイルを対象に追加し、
   * 必要に応じてグループ化や依存関係の選定を行い、選択されたファイルをストリームに渡す。
   * @param {Stream} stream - Gulp ストリーム
   */
  async finalizeFileStream( settings, stream ) {
    // 削除されたファイルも対象にする。
    this.#collectDeletedFiles( settings.name );
    // Git が未追跡のファイルも対象にする。
    this.#collectUntrackedFiles( settings.name );
    this.#setChildSetTo( settings.name, this.selectedFileMap );
    if ( settings.group ) {
      // 所属する同じグループのファイルも選択。
      this.#selectGroupedFiles( settings.name, this.settings.group );
    } else if ( this.settings.allForOne === true ) {
      // すべてのファイルの情報を選択。
      this.#selectAllFiles( settings.name );
    } else {
      // 収集した依存ファイルからstream に渡したいファイルを選択。
      this.#selectFilesFromCollection( settings.name );
    }
    // 収集した依存ファイルからファイルを選択し、stream に渡す。
    await this.#pushSelectedFilesToStream( settings.name, stream );
  }

  /**
   * Git 差分データを取得して対象ファイルを選定。
   * 差分データに無い場合も、直近の差分データにあれば対象ファイルにする。
   * そうしなければ、git のrevert などが未検知になってしまうため。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  async #filterByGitDiff( name, file ) {
    this.currentDiffData = await this.promiseGetGitDiffData;
    this.lastDiffData    = await this.promiseGetLastDiffData;
    if (
      _includes( this.currentDiffData, file.path ) ||
      _includes( this.lastDiffData, file.path )
    ) {
      this.targetFileMap.get( name ).add( file.path );
    }
  }

  /**
   * one source → one destination 用。
   * Gulp.src のオプション、 { read: false } の速さに期待して。
   * contents をreadFile で改めて読み込み、file.contents に代入する。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  async #setFileContents( name, file ) {
    try {
      file.contents = await readFile( file.path );
      this.selectedFileMap.get( name ).add( file.path );
    } catch ( err ) {
      throw err;
    }
  }

  /**
   * すべてのファイル情報を収集。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  #collectAllFiles( name, file ) {
    this.allFileMap.get( name ).set( file.path, file.clone() );
    // プロパティのなかで一番容量が大きいので。後で必要なものだけ読み込み直す。
    this.allFileMap.get( name ).get( file.path ).contents = null;
  }

  #setChildMapTo( name, parentMap ) {
    if ( parentMap.has( name ) === true ) {
      return;
    }
    parentMap.set( name, new Map() );
  }

  #setChildSetTo( name, parentMap ) {
    if ( parentMap.has( name ) === true ) {
      return;
    }
    parentMap.set( name, new Set() );
  }

  /**
   * グループ情報を設定。
   * 複数のsrc ファイルを一つのdist にするようなタスク用。
   * 自身のパスをkey に、所属するグループ（設定ファイルで付けられた任意のディレクトリ名）を値に。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {String} group - グループ名
   */
  #assignGroup( file, name, group ) {
    const
      groupIndex = file.path.indexOf( group )
      ,groupPath = file.path.slice( 0, groupIndex + group.length )
    ;
    this.allFileMap.get( name ).get( file.path ).group = groupPath;
  }

  /**
   * 依存関係を収集。
   * ファイルの依存関係をCallback で収集してもらう。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  #collectDependencies( name, file ) {
    this.collector.get( name )?.( file, this.collectedFileMap.get( name ) );
  }

  /**
   * 消去されたファイルも対象にする。
   */
  #collectDeletedFiles( name ) {
    for ( const [ filePath, info ] of Object.entries( this.currentDiffData ) ) {
      if ( info.status.includes( 'D' ) ) {
        this.targetFileMap.get( name ).add( resolve( process.cwd(), filePath ) );
      }
    }
  }

  /**
   * Git が未追跡のファイルも対象にする。
   */
  #collectUntrackedFiles( name ) {
    for ( const [ filePath, info ] of Object.entries( this.currentDiffData ) ) {
      if (
        !this.currentDiffData[ filePath ] && info.status.includes( '?' )
      ) {
        this.targetFileMap.get( name ).add( resolve( process.cwd(), filePath ) );
      }
    }
  }

  /**
   * 例えば候補が1ファイルでも、所属している同じグループのその他のファイルも選択する。
   * 複数src ファイルを一つに束ねる様なタスク用。
   * @param {Set} selectedFiles - 通過させるファイルパスの格納用
   * @param {String} group - グループ名
   */
  #selectGroupedFiles( name, group ) {
    for ( const targetFilePath of this.targetFileMap.get( name ) ) {
      const
        targetGroup = this.allFileMap.get( name ).get( targetFilePath )?.group
        ,groupIndex = targetFilePath.indexOf( group )
        ,myGroup    = targetFilePath.slice( 0, groupIndex + group.length )
      ;
      for ( const [ filePath, fileInfo ] of this.allFiles ) {
        if (
          ( targetGroup && filePath.startsWith( targetGroup ) )
          || myGroup === fileInfo?.group
        ) {
          this.selectedFileMap.get( name ).add( filePath );
        }
      } // for
    } // for
  }

  /**
   * 収集したすべてのファイルパス情報をselectedFiles に追加する。
   */
  #selectAllFiles( name ) {
    for ( const [ filePath ] of this.allFileMap.get( name ) ) {
      this.selectedFileMap.get( name ).add( filePath );
    }
  }

  /**
   * 収集した依存ファイルからstream に渡したいファイルを選択。
   * callback 関数で選択してもらう。
   */
  #selectFilesFromCollection( name ) {
    for ( const filePath of this.targetFileMap.get( name ) ) {
      const collection = this.collectedFileMap.get( filePath );
      if ( collection ) {
        collection.forEach( ( depPath ) => this.selectedFileMap.get( name ).add( depPath ) );
      }
      if ( this.allFileMap.get( name ).has( filePath ) === true ) {
        this.selectedFileMap.get( name ).add( filePath );
      } else {
        continue;
      }
      this.selector.get( name )?.(
        filePath,
        this.collectedFileMap.get( name ),
        this.selectedFileMap.get( name ),
      );
    }
  }

  /**
   * 選択された通過ファイルをstream にプッシュする。
   * @param {Stream} stream - Gulp stream
   * @returns {Promise} - プロミス
   */
  async #pushSelectedFilesToStream( name, stream ) {
    const
      limit = pLmit( 5 )
      ,promiseReadFileAll = []
    ;
    for ( const filePath of this.selectedFileMap.get( name ) ) {
      const limitedTask = limit(
        () => _promisePushReadFileToStream( filePath, this.allFileMap.get( name ), stream )
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
 * @param {Set} selectedFiles - 通過させるファイルパスの格納用。
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
function _finalizeProcessor( myProcessor, settings, callback ) {
  lastDiff.set( settings.name, myProcessor.currentDiffData );
  _writeDiffData();
  _log(
    settings.name,
    myProcessor.targetFileMap.get( settings.name ).size,
    myProcessor.selectedFileMap.get( settings.name ).size,
  );
  callback();
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
  const relPath = relative( process.cwd(), filePath ).replace( /[\\]/g, '/' );
  return data && Object.keys( data ).includes( relPath );
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
      const diffData = {};
      if ( err ) {
        return rejectPromise( err );
      }
      if ( stderr ) {
        fancyLog.warn( chalk.yellow( `${ name }\n${ stderr }` ) );
      }
      if ( stdout ) {
        const matches = stdout.matchAll( /^(.{2})\s([^\n]+?)\n/mg );
        for ( const match of matches ) {
          let path = match[ 2 ];
          // リネームの際の文字列をリネーム後のパスの形に変換する。
          if ( path.indexOf( ' -> ' ) > -1 ) {
            path = path.split( ' -> ' )[ 1 ];
          }
          diffData[ path ] = { status : match[ 1 ] };
        }
      }
      resolvePromise( diffData );
    } );
  } );
}
