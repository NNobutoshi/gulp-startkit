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
    detection : true,
    command   : 'git status -suall',
  }
;
let
  writingTimeoutId = null
;

export {
  diff_build as default,
  selectTargetFiles,
};

/*
 * Git で管理する前提での差分ビルド。
 * /

/*
 * @param {Object} options - オプション
 * @param {Function} collect - 依存関係収集用コールバック
 * @param {Function} select - 通過候補選択用コールバック
 */
function diff_build( options, collect, select ) {
  const
    settings = mergeWith( {}, defaultSettings, options )
    ,shared = {
      allFiles         : new Map(), // 全chumk用
      collection       : new Map(), // 依存関係収集用
      targets          : new Map(), // 通過候補
      currentDiffData  : null,
      lastDiffData     : null,
      promiseGetGitDiffData  : null,
      promiseGetLastDiffData : null,
    }
  ;

  if ( settings.enabled === false ) {
    return through.obj();
  }

  shared.promiseGetGitDiffData = _getGitDiffData( settings.command );
  shared.promiseGetLastDiffData = lastDiff.get( settings.name );

  if ( typeof settings.allForOne === 'string' ) {
    settings.group = settings.allForOne.replace( /[/\\]/g, sep );
  }

  if ( settings.oneToOne === true ) {
    return through.obj(
      _setFileContentsByGitDiff( shared ),
      _setTargetFiles( shared, settings.name ),
    );
  }

  return through.obj(
    _collectTargetFiles( shared, settings, collect ),
    _pushSelectedFilesToStream( shared, settings, select ),
  );
}

/**
 * @param {Object} shared - 共有データ
 * @param {Object} settings - 設定
 * @param {Function} collect - 依存関係収集用コールバック
 */
function _collectTargetFiles( shared, settings, collect ) {
  return async function _transform( file, enc, callback ) {

    if ( file.isStream && file.isStream() ) {
      return callback( new Error( 'Streaming not supported' ) );
    }

    /*
     * すべてのchunk の情報を収集しておく。
     */
    shared.allFiles.set( file.path, file.clone() );
    shared.allFiles.get( file.path ).contents = null;

    /*
     * git コマンドで得た差分ファイルリストにchunk のpath があればstream で通す候補にし、
     * リストになくても、直近最後の差分としてリストにあればそれも候補にする。
     * そうしないと、git のrevert などが未検知になってしまうため。
     */
    try {
      shared.currentDiffData = await shared.promiseGetGitDiffData;
      shared.lastDiffData    = await shared.promiseGetLastDiffData;
      if (
        _includes( shared.currentDiffData, file.path ) ||
        _includes( shared.lastDiffData, file.path )
      ) {
        shared.targets.set( file.path, 1 );
      }

      /*
       * 複数のsrc ファイルを一つのdist にするようなタスク用。
       * 自身のパスをkey に、所属するグループ（設定で指定されたポイントとなるディレクトリ）を値に。
       */
      if ( settings.group ) {
        const groupPath = file.path.slice(
          0,
          file.path.indexOf( settings.group ) + settings.group.length,
        );
        shared.allFiles.get( file.path ).group = groupPath;
      }

      /*
       * ファイルの依存関係をcall back で収集してもらう。
       */
      if ( typeof collect === 'function' ) {
        collect( file, shared.collection );
      }
      callback();
    } catch ( err ) {
      callback( err );
    }

  };
}

/**
 * ストリームに通すファイルをけっていする。
 * @param {Object} shared - 共有データ
 * @param {Object} settings - 設定
 * @param {Function} select - 通過候補選択用コールバック
 */
function _pushSelectedFilesToStream( shared, settings, select ) {
  return async function _flush( callback ) {
    const
      stream = this
      ,destFiles = new Map()
      ,{ name, group } = settings
      ,promiseReadFileAll = []
    ;

    if ( shared.currentDiffData === null ) {
      return callback();
    }

    /*
     * 消去されたファイルもtargetに。
     */
    for ( const [ filePath, info ] of Object.entries( shared.currentDiffData ) ) {
      if ( info.status.includes( 'D' ) ) {
        shared.targets.set( resolve( process.cwd(), filePath ), 1 );
      }
    }

    for ( const [ filePath, info ] of Object.entries( shared.lastDiffData ) ) {
      if (
        !shared.currentDiffData[ filePath ] &&
        info.status.includes( '?' )
      ) {
        shared.targets.set( resolve( process.cwd(), filePath ), 1 );
      }
    }

    /*
     * 例えば候補が1ファイルでも、所属している同じグループのファイルは、全部通す。
     * 複数ファイルを一つのdist にするようなタスク用。
     */
    if ( group ) {

      for ( const [ filePath ] of shared.allFiles ) {
        for ( const [ targetFilePath ] of shared.targets ) {
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
            destFiles.set( filePath, 1 );
          }
        } // for
      } // for

    /*
     * 全部道連れにする場合。
     */
    } else if ( settings.allForOne === true ) {
      for ( const [ filePath ] of shared.allFiles ) {
        destFiles.set( filePath, 1 );
      }

    /*
     * 候補として収集したものを通す。
     */
    } else {
      for ( const [ filePath ] of shared.targets ) {
        const collection = shared.collection.get( filePath );
        if ( collection ) {
          collection.forEach( ( depPath ) => destFiles.set( depPath, 1 ) );
        }
        if ( shared.allFiles.has( filePath ) ) {
          destFiles.set( filePath,1 );
        } else {
          continue;
        }

        /*
         * 収集した依存関係から候補ファイルと関係のあるファイルの最終的な選択。
         */
        if ( typeof select === 'function' ) {
          select( filePath, shared.collection, destFiles );
        }
      } //for
    }

    /*
     * allFilesから destFiles （最終候補）のpath がkey になっている値を取得して、
     * その値からFile を生成してstream にプッシュする。
     */
    for ( const [ filePath ] of destFiles ) {
      promiseReadFileAll.push(
        _promisePushReadFileToStream( filePath, shared.allFiles, stream )
      );
    }

    try {
      await Promise.all( promiseReadFileAll );
      _log( name, shared.targets.size, destFiles.size );
      lastDiff.set( name, shared.currentDiffData );
      _writeDiffData();
      callback();
    } catch ( err ) {
      callback( err );
    }

  };

}

/**
 * ファイルを読み込みストリームにプッシュする。
 * @param {String} filePath - ファイルパス
 * @param {Map} allFiles - 全chunk用
 * @param {Stream} stream - Gulp stream
 */
async function _promisePushReadFileToStream( filePath, allFiles, stream ) {
  try {
    const content = await readFile( filePath );
    const file = allFiles.get( filePath );
    file.contents = content;
    stream.push( file );
  } catch ( err ) {
    stream.emit( 'error', err );
  }
}

/**
 * one source → one destination 用。
 * Gulp.src のオプション、 { read: false } の速さに期待して。
 * Gulp.src() { read: false } で得たfile.path がGit のdiff の結果の中に含まれているなら、
 * contents をreadFile で改めて読み込み、file.contents に代入する。
 * @param {Object} shared - 共有データ
 * @returns {Function} - transform function
 */
function _setFileContentsByGitDiff( shared ) {
  return async function _transform( file, enc, callback ) {
    if ( file.isStream && file.isStream() ) {
      return callback( new Error( 'Streaming not supported' ) );
    }
    shared.currentDiffData = await shared.promiseGetGitDiffData;
    shared.lastDiffData    = await shared.promiseGetLastDiffData;
    try {
      if (
        _includes( shared.currentDiffData, file.path ) ||
        _includes( shared.lastDiffData, file.path )
      ) {
        ( async function() {
          try {
            file.contents = await readFile( file.path );
            shared.targets.set( file.path, 1 );
            callback( null, file );
          } catch ( err ) {
            callback( err );
          }
        } )();
      } else {
        callback();
      }
    } catch ( err ) {
      callback( err );
    }
  };

}

/**
 * @param {Object} shared - 共有データ
 * @param {String} name - タスク名
 */
function _setTargetFiles( shared, name ) {
  return function _flush( callback ) {
    lastDiff.set( name, shared.currentDiffData );
    _writeDiffData();
    _log( name, shared.targets.size, shared.targets.size );
    callback();
  };
}

/**
 * 候補ファイルに依存するファイルを再帰選択する。
 * through2.obj()の flush function の内部で、実行。
 * @param {String} filePath - ファイルパス
 * @param {Object} collection - 収集した依存関係
 * @param {Map} destFiles - 通過候補
 */
function selectTargetFiles( filepath, collection, destFiles ) {
  _recurse( filepath );
  function _recurse( path ) {
    const deps = collection.get( path );
    if ( Array.isArray( deps ) ) {
      deps.forEach( ( dep ) => {
        destFiles.set( dep, 1 );
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
 * 検知数と通過させた数のログ
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
