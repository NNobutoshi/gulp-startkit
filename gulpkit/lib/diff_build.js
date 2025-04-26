import { resolve, relative, sep } from 'node:path';
import { exec }                   from 'node:child_process';
import { readFile }               from 'node:fs/promises';

import through   from 'through2';
import mergeWith from 'lodash/mergeWith.js';
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
  const
    settings = mergeWith( {}, defaultSettings, options )
    ,shared = {
      allFiles        : new Map(), // 全chumk用
      collection      : new Map(), // 依存関係収集用
      targetFiles     : new Map(), // 対象ファイル用
      currentDiffData : null,
      lastDiffData    : null,
      promiseGetGitDiffData  : null,
      promiseGetLastDiffData : null,
    }
    ,selectedFiles = new Map()
  ;
  let
    group
  ;

  if ( settings.enabled === false ) {
    return through.obj();
  }

  shared.promiseGetGitDiffData = _getGitDiffData( settings.command );
  shared.promiseGetLastDiffData = lastDiff.get( settings.name );

  if ( settings.oneToOne === true ) {

    /**
     * one source → one destination 用。
     * Git Diff で検知されたfile のみを対象にする。
     */
    return through.obj(
      async function _transform( file, enc, callback ) {
        try {
          await _filterByGitDiff( shared, file );
          if ( !shared.targetFiles.get( file.path ) ) {
            return callback();
          }
          await _setFileContents( file );
          callback( null, file );
        } catch ( err ) {
          callback( err );
        }
      },
      function _flush( callback ) {
        lastDiff.set( settings.name, shared.currentDiffData );
        _writeDiffData();
        _log( settings.name, shared.targetFiles.size, shared.targetFiles.size );
        callback();
      }
    );
  }

  if ( typeof settings.allForOne === 'string' ) {
    group = settings.allForOne.replace( /[/\\]/g, sep );
  } else {
    group = false;
  }

  /**
   * 渡されてきたファイルが依存するその他のファイルを調べ、それらのファイルも一緒にstream に渡す。
   * 例えば、pug、sass のコンパイルタスク用。
   * or
   * 渡されてきたファイル以外に必要な対象ファイルを併せてstream に渡す。
   * 例えば、iconFont sprite.smithなどのタスク用。
   */
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        // すべてのファイル情報を収集
        _collectAllFiles( shared, file );
        // 対象ファイルを選定
        await _filterByGitDiff( shared, file );
        // グループ情報を設定
        if ( group ) {
          _assignGroup( shared, file, group );
        }
        // 依存関係を収集
        _collectDependencies( shared, collect, file );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
    async function _flush( callback ) {
      const stream = this;
      if ( shared.currentDiffData === null ) {
        return callback();
      }
      try {
        // 削除されたファイルも対象にする。
        _collectDeletedFiles( shared );
        // Git が未検地のファイルも対象にする。
        _collectUntrackedFiles( shared );
        if ( group ) {
        // 所属する同じグループのファイルも選択。
          _selectGroupedFiles( shared, selectedFiles, group );
        } else if ( settings.allForOne === true ) {
          // すべてのファイルの情報を選択。
          _selectAllFiles( shared, selectedFiles );
        } else {
          // 収集した依存ファイルからstream に渡したいファイルを選択。
          _selectFilesFromCollection( shared, selectedFiles, select );
        }
        // 収集した依存ファイルからファイルを選択し、stream に渡す。
        try {
          await _pushSelectedFilesToStream( shared, selectedFiles, stream );
        } catch ( err ) {
          callback( 'error', err );
        }
        _log( settings.name, shared.targetFiles.size, selectedFiles.size );
        lastDiff.set( settings.name, shared.currentDiffData );
        _writeDiffData();
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
  );
}

/**
 * Git 差分データを取得して対象ファイルを選定。
 * 差分データに無い場合も、直近の差分データにあれば対象ファイルにする。
 * そうしなければ、git のrevert などが未検知になってしまうため。
 * @param {Object} shared - 共有データ
 * @param {Object} file - chunk
 */
async function _filterByGitDiff( shared, file ) {
  shared.currentDiffData = await shared.promiseGetGitDiffData;
  shared.lastDiffData    = await shared.promiseGetLastDiffData;
  if (
    _includes( shared.currentDiffData, file.path ) ||
    _includes( shared.lastDiffData, file.path )
  ) {
    shared.targetFiles.set( file.path, 1 );
  }
}

/**
 * one source → one destination 用。
 * Gulp.src のオプション、 { read: false } の速さに期待して。
 * contents をreadFile で改めて読み込み、file.contents に代入する。
 * @param {file} file - chunk
 */
async function _setFileContents( file ) {
  file.contents = await readFile( file.path );
}

/**
 * すべてのファイル情報を収集。
 * @param {Object} shared - 共有データ
 * @param {Object} file - chunk
 */
function _collectAllFiles( shared, file ) {
  shared.allFiles.set( file.path, file.clone() );
  shared.allFiles.get( file.path ).contents = null;
}

/**
 * グループ情報を設定。
 * 複数のsrc ファイルを一つのdist にするようなタスク用。
 * 自身のパスをkey に、所属するグループ（設定ファイルで付けられた任意のディレクトリ名）を値に。
 * @param {Object} shared - 共有データ
 * @param {Object} file - chunk
 * @param {String} group - グループ名
 */
function _assignGroup( shared, file, group ) {
  const groupPath = file.path.slice( 0, file.path.indexOf( group ) + group.length );
  shared.allFiles.get( file.path ).group = groupPath;
}

/**
 * 依存関係を収集。
 * ファイルの依存関係をCallback で収集してもらう。
 * @param {Object} shared - 共有データ
 * @param {Function} collect - 依存関係収集用コールバック
 * @param {Object} file - chunk
 */
function _collectDependencies( shared, collect, file ) {
  if ( typeof collect === 'function' ) {
    collect( file, shared.collection );
  }
}

/**
 * 消去されたファイルも対象にする。
 * @param {Object} shared - 共有データ
 */
function _collectDeletedFiles( shared ) {
  for ( const [ filePath, info ] of Object.entries( shared.currentDiffData ) ) {
    if ( info.status.includes( 'D' ) ) {
      shared.targetFiles.set( resolve( process.cwd(), filePath ), 1 );
    }
  }
}

/**
 * Git が未追跡のファイルも対象にする。
 * @param {Object} shared - 共有データ
 */
function _collectUntrackedFiles( shared ) {
  for ( const [ filePath, info ] of Object.entries( shared.currentDiffData ) ) {
    if (
      !shared.currentDiffData[ filePath ] &&
      info.status.includes( '?' )
    ) {
      shared.targetFiles.set( resolve( process.cwd(), filePath ), 1 );
    }
  }
}

/**
 * 例えば候補が1ファイルでも、所属している同じグループのその他のファイルも選択する。
 * 複数src ファイルを一つに束ねる様なタスク用。
 * @param {Object} shared - 共有データ
 * @param {Map} selectedFiles - 通過させるファイルパスの格納用
 * @param {String} group - グループ名
 */
function _selectGroupedFiles( shared, selectedFiles, group ) {
  for ( const [ filePath ] of shared.allFiles ) {
    for ( const [ targetFilePath ] of shared.targetFiles ) {
      const
        target = shared.allFiles.get( targetFilePath )
        ,targetGroup = target?.group
        ,myGroup = targetFilePath.slice(
          0,
          targetFilePath.indexOf( group ) + group.length
        )
          ;
      if (
        ( targetGroup && filePath.startsWith( targetGroup ) ) ||
            myGroup === shared.allFiles.get( filePath )?.group
      ) {
        selectedFiles.set( filePath, 1 );
      }
    } // for
  } // for
}

/**
 * 収集したすべてのファイルパス情報をselectedFiles にセットする。
 * @param {Object} shared - 共有データ
 * @param {Map} selectedFiles - 通過させるファイルパスの格納用
 */
function _selectAllFiles( shared, selectedFiles ) {
  for ( const [ filePath ] of shared.allFiles ) {
    selectedFiles.set( filePath, 1 );
  }
}

/**
 * 収集した依存ファイルからstream に渡したいファイルを選択。
 * callback 関数で選択してもらう。
 * @param {Object} shared - 共有データ
 * @param {Map} selectedFiles - 通過させるファイルパスの格納用
 * @param {Function} select - 通過ファイル選択用コールバック
 */
function _selectFilesFromCollection( shared, selectedFiles, select ) {
  for ( const [ filePath ] of shared.targetFiles ) {
    const collection = shared.collection.get( filePath );
    if ( collection ) {
      collection.forEach( ( depPath ) => selectedFiles.set( depPath, 1 ) );
    }
    if ( shared.allFiles.has( filePath ) ) {
      selectedFiles.set( filePath, 1 );
    } else {
      continue;
    }
    if ( typeof select === 'function' ) {
      select( filePath, shared.collection, selectedFiles );
    }
  }
}

/**
 * 選択された通過ファイルをstream にプッシュする。
 * @param {Object} shared - 共有データ
 * @param {Map} selectedFiles - 通過させるファイルパスの格納用
 * @param {Stream} stream - Gulp stream
 * @returns {Promise} - プロミス
 */
async function _pushSelectedFilesToStream( shared, selectedFiles, stream ) {
  const promiseReadFileAll = [];
  for ( const [ filePath ] of selectedFiles ) {
    promiseReadFileAll.push(
      _promisePushReadFileToStream( filePath, shared.allFiles, stream )
    );
  }
  await Promise.all( promiseReadFileAll );
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
