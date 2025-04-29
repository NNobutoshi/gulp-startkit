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
  const processor = new DiffBuildProcessor( settings, collect, select );
  return ( settings.oneToOne === true )
    ? _createOneToOneStream( processor, settings )
    : _createDependencyStream( processor, settings )
  ;
}

/**
 * one source → one destination 用のストリーム作成。
 * Git Diff で検知されたfile のみを対象にする。
 * @param {DiffBuildProcessor} processor - 差分処理プロセッサ
 * @param {Object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createOneToOneStream( processor, settings ) {
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        await processor.setFileContentsByGitDiff( file, callback );
      } catch ( err ) {
        callback( err );
      }
    },
    function _flush( callback ) {
      try {
        _finalizeProcessor( processor, settings, callback );
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
 * @param {DiffBuildProcessor} processor - 差分処理プロセッサ
 * @param {Object} settings - 設定オブジェクト
 * @returns {Stream} - 処理されたストリーム
 */
function _createDependencyStream( processor, settings ) {
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        await processor.collectAndGroupFiles( file, callback );
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      try {
        if ( processor.currentDiffData !== null ) {
          await processor.finalizeFileStream( this );
          _finalizeProcessor( processor, settings, callback );
        }
      } catch ( err ) {
        callback( err );
      }
    }
  );
}

/**
 * プロセスの最終処理。
 * @param {Object} processor - DiffBuildProcessor
 * @param {Object} settings - 設定
 * @param {Function} callback - コールバック
 */
function _finalizeProcessor( processor, settings, callback ) {
  lastDiff.set( settings.name, processor.currentDiffData );
  _writeDiffData();
  _log( settings.name, processor.targetFiles.size, processor.selectedFiles.size );
  callback();
}

/**
 * 差分ビルド処理を行うクラス。
 * Git の差分データを基に、対象ファイルの選定や依存関係の収集、グループ化などを行う。
 * また、選定されたファイルをストリームに渡す処理も提供する。
 */
class DiffBuildProcessor {

  constructor( settings, collect, select ) {
    this.settings = settings;
    this.collect = collect;
    this.select  = select;
    this.diffData = {};
    this.lastDiff = lastDiff;
    this.gitDiffData = null;
    this.gitDiffDataPromise = null;
    this.allFiles = new Map();
    this.targetFiles = new Set();
    this.selectedFiles = new Set();
    this.collectedFiles = new Map();
    this.promiseGetGitDiffData = _getGitDiffData( settings.command, settings.name );
    this.promiseGetLastDiffData = lastDiff.get( settings.name );
  }

  /**
   * Git 差分データを基に、対象ファイルの内容を設定。
   * 対象ファイルが差分リストに含まれている場合、その内容を読み込み、
   * file.contents に代入し、選択されたファイルリストに追加する。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Function} callback - 処理完了時に呼び出されるコールバック関数
   */
  async setFileContentsByGitDiff( file, callback ) {
    // 対象ファイルを選定
    await this.#filterByGitDiff( file );
    if ( this.targetFiles.has( file.path ) === false ) {
      return callback();
    }
    // 改めてfile を読み込み、file.contents に代入する。
    await this.#setFileContents( file );
    callback( null, file );
  }

  /**
   * ファイルを収集し、必要に応じてグループ化を行う。
   * 対象ファイルを差分データに基づいて選定し、依存関係を収集する。
   * グループ化が設定されている場合、ファイルにグループ情報を付与する。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {Function} callback - 処理完了時に呼び出されるコールバック関数
   */
  async collectAndGroupFiles( file, callback ) {
    if ( typeof this.settings.allForOne === 'string' ) {
      this.settings.group = this.settings.allForOne.replace( /[/\\]/g, sep );
    } else {
      this.settings.group = false;
    }
    // すべてのファイル情報を収集。
    this.#collectAllFiles( file );
    // 対象ファイルを選定。
    await this.#filterByGitDiff( file );
    // グループ情報を設定。
    if ( this.settings.group ) {
      this.#assignGroup( file, this.settings.group );
    }
    // 依存関係を収集。
    this.#collectDependencies( file );
    callback();
  }

  /**
   * ストリームの最終処理を行う。
   * 削除されたファイルや未追跡のファイルを対象に追加し、
   * 必要に応じてグループ化や依存関係の選定を行い、選択されたファイルをストリームに渡す。
   * @param {Stream} stream - Gulp ストリーム
   */
  async finalizeFileStream( stream ) {
    // 削除されたファイルも対象にする。
    this.#collectDeletedFiles();
    // Git が未追跡のファイルも対象にする。
    this.#collectUntrackedFiles();
    if ( this.settings.group ) {
      // 所属する同じグループのファイルも選択。
      this.#selectGroupedFiles( this.settings.group );
    } else if ( this.settings.allForOne === true ) {
      // すべてのファイルの情報を選択。
      this.#selectAllFiles();
    } else {
      // 収集した依存ファイルからstream に渡したいファイルを選択。
      this.#selectFilesFromCollection( this.select );
    }
    // 収集した依存ファイルからファイルを選択し、stream に渡す。
    await this.#pushSelectedFilesToStream( stream );
  }

  /**
   * Git 差分データを取得して対象ファイルを選定。
   * 差分データに無い場合も、直近の差分データにあれば対象ファイルにする。
   * そうしなければ、git のrevert などが未検知になってしまうため。
   * @param {Object} file - 処理対象のファイル (Vinylオブジェクト)
   */
  async #filterByGitDiff( file ) {
    this.currentDiffData = await this.promiseGetGitDiffData;
    this.lastDiffData    = await this.promiseGetLastDiffData;
    if (
      _includes( this.currentDiffData, file.path ) ||
      _includes( this.lastDiffData, file.path )
    ) {
      this.targetFiles.add( file.path );
    }
  }

  /**
   * one source → one destination 用。
   * Gulp.src のオプション、 { read: false } の速さに期待して。
   * contents をreadFile で改めて読み込み、file.contents に代入する。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  async #setFileContents( file ) {
    file.contents = await readFile( file.path );
    this.selectedFiles.add( file.path );
  }

  /**
   * すべてのファイル情報を収集。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  #collectAllFiles( file ) {
    this.allFiles.set( file.path, file.clone() );
    this.allFiles.get( file.path ).contents = null;
  }

  /**
   * グループ情報を設定。
   * 複数のsrc ファイルを一つのdist にするようなタスク用。
   * 自身のパスをkey に、所属するグループ（設定ファイルで付けられた任意のディレクトリ名）を値に。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {String} group - グループ名
   */
  #assignGroup( file, group ) {
    const groupPath = file.path.slice( 0, file.path.indexOf( group ) + group.length );
    this.allFiles.get( file.path ).group = groupPath;
  }

  /**
   * 依存関係を収集。
   * ファイルの依存関係をCallback で収集してもらう。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   */
  #collectDependencies( file ) {
    if ( typeof this.collect === 'function' ) {
      this.collect( file, this.collectedFiles );
    }
  }

  /**
   * 消去されたファイルも対象にする。
   */
  #collectDeletedFiles() {
    for ( const [ filePath, info ] of Object.entries( this.currentDiffData ) ) {
      if ( info.status.includes( 'D' ) ) {
        this.targetFiles.add( resolve( process.cwd(), filePath ) );
      }
    }
  }

  /**
   * Git が未追跡のファイルも対象にする。
   */
  #collectUntrackedFiles() {
    for ( const [ filePath, info ] of Object.entries( this.currentDiffData ) ) {
      if (
        !this.currentDiffData[ filePath ] &&
        info.status.includes( '?' )
      ) {
        this.targetFiles.add( resolve( process.cwd(), filePath ) );
      }
    }
  }

  /**
   * 例えば候補が1ファイルでも、所属している同じグループのその他のファイルも選択する。
   * 複数src ファイルを一つに束ねる様なタスク用。
   * @param {Set} selectedFiles - 通過させるファイルパスの格納用
   * @param {String} group - グループ名
   */
  #selectGroupedFiles( group ) {
    for ( const [ filePath ] of this.allFiles ) {
      for ( const targetFilePath of this.targetFiles ) {
        const
          target = this.allFiles.get( targetFilePath )
          ,targetGroup = target?.group
          ,myGroup = targetFilePath.slice(
            0,
            targetFilePath.indexOf( group ) + group.length
          )
            ;
        if (
          ( targetGroup && filePath.startsWith( targetGroup ) ) ||
              myGroup === this.allFiles.get( filePath )?.group
        ) {
          this.selectedFiles.add( filePath );
        }
      } // for
    } // for
  }

  /**
   * 収集したすべてのファイルパス情報をselectedFiles に追加する。
   */
  #selectAllFiles() {
    for ( const [ filePath ] of this.allFiles ) {
      this.selectedFiles.add( filePath );
    }
  }

  /**
   * 収集した依存ファイルからstream に渡したいファイルを選択。
   * callback 関数で選択してもらう。
   */
  #selectFilesFromCollection() {
    for ( const filePath of this.targetFiles ) {
      const collection = this.collectedFiles.get( filePath );
      if ( collection ) {
        collection.forEach( ( depPath ) => this.selectedFiles.add( depPath ) );
      }
      if ( this.allFiles.has( filePath ) === true ) {
        this.selectedFiles.add( filePath );
      } else {
        continue;
      }
      if ( typeof this.select === 'function' ) {
        this.select( filePath, this.collectedFiles, this.selectedFiles );
      }
    }
  }

  /**
   * 選択された通過ファイルをstream にプッシュする。
   * @param {Stream} stream - Gulp stream
   * @returns {Promise} - プロミス
   */
  async #pushSelectedFilesToStream( stream ) {
    const
      limit = pLmit( 5 )
      ,promiseReadFileAll = []
    ;
    for ( const filePath of this.selectedFiles ) {
      const limitedTask = limit(
        () => _promisePushReadFileToStream( filePath, this.allFiles, stream )
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
  const
    contents = await readFile( filePath )
    ,file = allFiles.get( filePath )
  ;
  file.contents = contents;
  stream.push( file );
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
