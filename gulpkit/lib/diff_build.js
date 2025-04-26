import { resolve, relative, sep } from 'node:path';
import { exec }                   from 'node:child_process';
import { readFile }               from 'node:fs/promises';

import through   from 'through2';
import fancyLog  from 'fancy-log';
import chalk     from 'chalk';

import lastDiff from './last_diff.js';

const
  WRITING_DELAY_TIME = 2000
;
const
  defaultSettings = {
    name      : '',
    allForOne : false,
    anabled   : true,
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

/*
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

  if ( settings.oneToOne === true ) {

    /**
     * one source → one destination 用。
     * Git Diff で検知されたfile のみを対象にする。
     */
    return through.obj(
      async function( file, enc, callback ) {
        try {
          await processor.setFileContentsByGitDiff( file, callback );
        } catch ( err ) {
          callback( err );
        }
      },
      async function( callback ) {
        try {
          lastDiff.set( settings.name, processor.currentDiffData );
          _writeDiffData();
          _log( settings.name, processor.targetFiles.size, processor.targetFiles.size );
          callback();
        } catch ( err ) {
          callback( err );
        }
      },
    );
  } else {

    /**
     * 渡されてきたファイルが依存するその他のファイルを調べ、それらのファイルも一緒にstream に渡す。
     * 例えば、pug、sass のコンパイルタスク用。
     * or
     * 渡されてきたファイル以外に必要な対象ファイルを併せてstream に渡す。
     * 例えば、iconFont sprite.smithなどのタスク用。
     */
    return through.obj(
      async function( file, enc, callback ) {
        try {
          await processor.collectFiles( file );
          callback();
        } catch ( err ) {
          callback( err );
        }
      },
      async function( callback ) {
        if ( processor.currentDiffData === null ) {
          return callback();
        }
        try {
          await processor.flushFiles( this );
          _log( settings.name, processor.targetFiles.size, processor.selectedFiles.size );
          lastDiff.set( settings.name, processor.currentDiffData );
          _writeDiffData();
          callback();
        } catch ( err ) {
          callback( err );
        }
      },
    );

  }
}

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
    this.selectedFiles = new Map();
    this.collection = new Map();
    this.targetFiles = new Map();
    this.promiseGetGitDiffData = _getGitDiffData( settings.command );
    this.promiseGetLastDiffData = lastDiff.get( settings.name );
  }

  async setFileContentsByGitDiff( file, callback ) {
    // 対象ファイルを選定
    await this.#filterByGitDiff( file );
    if ( !this.targetFiles.get( file.path ) ) {
      return callback();
    }
    await this.#setFileContents( file );
    callback( null, file );
  }

  async collectFiles( file ) {
    if ( typeof this.settings.allForOne === 'string' ) {
      this.settings.group = this.settings.allForOne.replace( /[/\\]/g, sep );
    } else {
      this.settings.group = false;
    }
    // すべてのファイル情報を収集
    this.#collectAllFiles( file );
    // 対象ファイルを選定
    await this.#filterByGitDiff( file );
    // グループ情報を設定
    if ( this.settings.group ) {
      this.#assignGroup( file, this.settings.group );
    }
    // 依存関係を収集
    this.#collectDependencies( file );
  }

  async flushFiles( stream ) {
    // 削除されたファイルも対象にする。
    this.#collectDeletedFiles();
    // Git が未検知のファイルも対象にする。
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
   * @param {Object} file - chunk
   */
  async #filterByGitDiff( file ) {
    this.currentDiffData = await this.promiseGetGitDiffData;
    this.lastDiffData    = await this.promiseGetLastDiffData;
    if (
      _includes( this.currentDiffData, file.path ) ||
      _includes( this.lastDiffData, file.path )
    ) {
      this.targetFiles.set( file.path, 1 );
    }
  }

  /**
   * one source → one destination 用。
   * Gulp.src のオプション、 { read: false } の速さに期待して。
   * contents をreadFile で改めて読み込み、file.contents に代入する。
   * @param {file} file - chunk
   */
  async #setFileContents( file ) {
    file.contents = await readFile( file.path );
  }

  /**
   * すべてのファイル情報を収集。
   * @param {Object} file - chunk
   */
  #collectAllFiles( file ) {
    this.allFiles.set( file.path, file.clone() );
    this.allFiles.get( file.path ).contents = null;
  }

  /**
   * グループ情報を設定。
   * 複数のsrc ファイルを一つのdist にするようなタスク用。
   * 自身のパスをkey に、所属するグループ（設定ファイルで付けられた任意のディレクトリ名）を値に。
   * @param {Object} file - chunk
   * @param {String} group - グループ名
   */
  #assignGroup( file, group ) {
    const groupPath = file.path.slice( 0, file.path.indexOf( group ) + group.length );
    this.allFiles.get( file.path ).group = groupPath;
  }

  /**
   * 依存関係を収集。
   * ファイルの依存関係をCallback で収集してもらう。
   * @param {Object} shared - 共有データ
   * @param {Function} collect - 依存関係収集用コールバック
   * @param {Object} file - chunk
   */
  #collectDependencies( file ) {
    if ( typeof this.collect === 'function' ) {
      this.collect( file, this.collection );
    }
  }

  /**
   * 消去されたファイルも対象にする。
   */
  #collectDeletedFiles() {
    for ( const [ filePath, info ] of Object.entries( this.currentDiffData ) ) {
      if ( info.status.includes( 'D' ) ) {
        this.targetFiles.set( resolve( process.cwd(), filePath ), 1 );
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
        this.targetFiles.set( resolve( process.cwd(), filePath ), 1 );
      }
    }
  }

  /**
   * 例えば候補が1ファイルでも、所属している同じグループのその他のファイルも選択する。
   * 複数src ファイルを一つに束ねる様なタスク用。
   * @param {Map} selectedFiles - 通過させるファイルパスの格納用
   * @param {String} group - グループ名
   */
  #selectGroupedFiles( group ) {
    for ( const [ filePath ] of this.allFiles ) {
      for ( const [ targetFilePath ] of this.targetFiles ) {
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
          this.selectedFiles.set( filePath, 1 );
        }
      } // for
    } // for
  }

  /**
   * 収集したすべてのファイルパス情報をselectedFiles にセットする。
   * @param {Object} shared - 共有データ
   * @param {Map} selectedFiles - 通過させるファイルパスの格納用
   */
  #selectAllFiles( shared, selectedFiles ) {
    for ( const [ filePath ] of shared.allFiles ) {
      selectedFiles.set( filePath, 1 );
    }
  }

  /**
   * 収集した依存ファイルからstream に渡したいファイルを選択。
   * callback 関数で選択してもらう。
   * @param {Map} selectedFiles - 通過させるファイルパスの格納用
   * @param {Function} select - 通過ファイル選択用コールバック
   */
  #selectFilesFromCollection( select ) {
    for ( const [ filePath ] of this.targetFiles ) {
      const collection = this.collection.get( filePath );
      if ( collection ) {
        collection.forEach( ( depPath ) => this.selectedFiles.set( depPath, 1 ) );
      }
      if ( this.allFiles.has( filePath ) ) {
        this.selectedFiles.set( filePath, 1 );
      } else {
        continue;
      }
      if ( typeof select === 'function' ) {
        select( filePath, this.collection, this.selectedFiles );
      }
    }
  }

  /**
   * 選択された通過ファイルをstream にプッシュする。
   * @param {Map} selectedFiles - 通過させるファイルパスの格納用
   * @param {Stream} stream - Gulp stream
   * @returns {Promise} - プロミス
   */
  async #pushSelectedFilesToStream( stream ) {
    const promiseReadFileAll = [];
    for ( const [ filePath ] of this.selectedFiles ) {
      promiseReadFileAll.push(
        _promisePushReadFileToStream( filePath, this.allFiles, stream )
      );
    }
    await Promise.all( promiseReadFileAll );
  }


}

/**
 * 候補ファイルに依存するファイルを再帰選択する。
 * through2.obj()の flush function の内部で実行。
 * @param {String} filePath - ファイルパス
 * @param {Object} collection - 収集した依存関係
 * @param {Map} selectedFiles - 通過候補
 */
function organizeSelectedFileMap( filepath, collection, selectedFiles ) {
  _recurse( filepath );
  function _recurse( path ) {
    const deps = collection.get( path );
    if ( Array.isArray( deps ) ) {
      deps.forEach( ( dep ) => {
        selectedFiles.set( dep, 1 );
        if ( collection.has( dep ) ) {
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
 * @returns {Promise<Object>} - 差分ファイルリスト
 */
function _getGitDiffData( command ) {
  return new Promise( ( resolvePromise ) => {
    exec( command, ( err, stdout, stderr ) => {
      const diffData = {};
      if ( err || stderr ) {
        fancyLog.error( chalk.red( 'diff_build.js \n' + ( err || stderr ) ) );
        return resolvePromise( diffData );
      }
      if ( stdout ) {
        const matches = stdout.matchAll( /^(.{2})\s([^\n]+?)\n/mg );
        for ( const match of matches ) {
          let path = match[ 2 ];
          // リネームの際の文字列をリネーム後のパスの形に変換する。
          if ( path.indexOf( ' -> ' ) > -1 ) {
            path = path.split( ' -> ' )[ 1 ];
          }
          diffData[ path ] = { status: match[ 1 ] };
        }
      }
      resolvePromise( diffData );
    } );
  } );
}
