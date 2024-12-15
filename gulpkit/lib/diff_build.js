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
  ,defaultSettings = {
    name      : '',
    allForOne : false,
    detection : true,
    command   : 'git status -suall',
  }
;
let
  writing_timeoutId = null
;

export {
  diff_build as default,
  selectTargetFiles,
  diff_1to1,
};


/*
 * Git で管理する前提での差分ビルド。
 * /

/*
 * いったんGulp.src を通った後なので
 * Gulp.src( { since: Gulp.lastRun() } ) よりは遅い。
 */
function diff_build( options, collect, select ) {
  const
    shared = {
      allFiles         : new Map(), // 全chumk用
      collection       : new Map(), // 依存関係収集用
      targets          : new Map(), // 通過候補
      currentDiffData  : null,
      lastDiffData     : lastDiff.get(),
      promiseGetGitDiffData : null,
      promiseOnGitDiffData  : null,
    },
    settings = mergeWith( {}, defaultSettings, options )
  ;

  if ( settings.detection === false ) {
    return through.obj();
  }

  shared.promiseGetGitDiffData = _getGitDiffData(
    settings.name,
    settings.command,
    shared.lastDiffData,
  );

  if ( typeof settings.allForOne === 'string' ) {
    settings.group = settings.allForOne.replace( /[/\\]/g, sep );
  }

  shared.promiseOnGitDiffData = shared.promiseGetGitDiffData.then( ( data ) => {
    return new Promise( ( prmResolve ) => {
      shared.currentDiffData = data;
      prmResolve( data );
    } );
  } );

  return through.obj(
    _retTransform( shared, settings, collect ),
    _retFlush( shared, settings, select ),
  );
}

function _retTransform( shared, settings, collect ) {
  return function _transform( file, enc, callBack ) {

    if ( file.isStream && file.isStream() ) {
      this.emit( 'error' , new Error( 'Streaming not supported' ) );
      return callBack();
    }

    /*
     * すべてのchunk の情報を収集しておく
     */
    shared.allFiles.set( file.path, file.clone() );
    shared.allFiles.get( file.path ).contents = null;

    /*
     * git コマンドで得た差分ファイルリストにchunk のpath があればstream で通す候補にし、
     * リストになくても、直近最後の差分としてリストにあればそれも候補にする。
     * そうしないと、git のrevert などが未検知になってしまうため。
     */
    shared.promiseOnGitDiffData.then( () => {

      if (
        _includes( settings.name, shared.currentDiffData, file.path ) ||
        _includes( settings.name, shared.lastDiffData, file.path )
      ) {
        shared.targets.set( file.path, 1 );
      }

      /*
       * 複数のsrc ファイルを一つのdist にするようなタスク用。
       * 自身のパスをkey に、所属するグループ（設定で指定されたポイントとなるディレクトリ）を値に。
       */
      if ( settings.group ) {
        shared.allFiles.get( file.path ).group =
          file.path.slice( 0, file.path.indexOf( settings.group ) + settings.group.length );
      }

      /*
       * ファイルの依存関係をcall back で収集してもらう。
       */
      if ( typeof collect === 'function' ) {
        collect.call( null, file, shared.collection );
      }
      callBack();
    } );

  };
}

function _retFlush( shared, settings, select ) {
  return function _flush( callBack ) {
    const
      stream              = this
      ,destFiles          = new Map()
      ,name               = settings.name
      ,group              = settings.group
      ,promiseReadFileAll = []
    ;

    if ( shared.currentDiffData === null ) {
      return callBack();
    }

    /*
     * 消去されたファイルもtargetに。
     */
    for ( let [ filePath, value ] of Object.entries( shared.currentDiffData[ settings.name ] ) ) {
      if ( value.status.indexOf( 'D' )  > -1 ) {
        shared.targets.set( resolve( process.cwd(), filePath ), 1 );
      }
    }

    if ( shared.lastDiffData && shared.lastDiffData[ settings.name ] ) {
      for ( let [ filePath, value ] of Object.entries( shared.lastDiffData[ settings.name ] ) ) {
        if (
          !shared.currentDiffData[ settings.name ][ filePath ] &&
        value.status.indexOf( '?' ) > -1
        ) {
          shared.targets.set( resolve( process.cwd(), filePath ), 1 );
        }
      }
    }

    /*
     * 例えば候補が1ファイルでも、所属している同じグループのファイルは、全部通す。
     * 複数ファイルを一つのdist にするようなタスク用。
     */
    if ( group ) {

      for ( let [ filePath ] of shared.allFiles ) {
        for ( let [ targetFilePath ] of shared.targets ) {
          const myGroup = targetFilePath.slice( 0, targetFilePath.indexOf( group ) + group.length );
          if (
            (
              shared.allFiles.get( targetFilePath )
              && shared.allFiles.get( targetFilePath ).group
              && filePath.indexOf( shared.allFiles.get( targetFilePath ).group ) === 0
            )
            || myGroup === shared.allFiles.get( filePath ).group
          ) {
            destFiles.set( filePath, 1 );
          }
        } // for
      } // for

    /*
     * 全部道連れにする場合。
     */
    } else if ( settings.allForOne === true ) {
      for ( let [ filePath ] of shared.allFiles ) {
        destFiles.set( filePath, 1 );
      }

    /*
     * 候補として収集したものを通す。
     */
    } else {
      for ( let [ filePath ] of shared.targets ) {
        if ( shared.collection.get( filePath ) ) {
          shared.collection.get( filePath ).forEach( dependentFilePath => {
            destFiles.set( dependentFilePath, 1 );
          } );
        }
        if ( shared.allFiles.get( filePath ) ) {
          destFiles.set( filePath,1 );
        } else {
          continue;
        }

        /*
         * 収集した依存関係から候補ファイルと関係のあるファイルの最終的な選択。
         */
        if ( typeof select === 'function' ) {
          select.call( null, filePath, shared.collection, destFiles );
        }
      } //for
    }

    /*
     * allFilesから destFiles （最終候補）のpath がkey になっている値を取得して、
     * その値からFile を生成してstream にプッシュする。
     */

    for ( let [ filePath ] of destFiles ) {
      promiseReadFileAll.push(
        _promisePushReadFileToStream( filePath, shared.allFiles, stream )
      );
    }

    Promise
      .all( promiseReadFileAll )
      .then( () => {
        _log( name, shared.targets.size, destFiles.size );
        lastDiff.set( shared.currentDiffData );
        _writeDiffData();
        callBack();
      } )
      .catch( error => callBack( error ) )
    ;

  };

}

async function _promisePushReadFileToStream( filePath, allFiles, stream ) {
  try {
    const content = await readFile( filePath );
    const file = allFiles.get( filePath );
    file.contents = content;
    stream.push( file );
  } catch ( error ) {
    stream.emit( 'error', error );
  }
}

/*
 * one source → one destination 用。
 * Gulp.src のオプション、 { read: false } の速さに期待して。
 * Gulp.src() を{ read false } で Git のdiff の結果から対象ファイルのパスを取捨選択して、
 * 対象ファイルであれば、contents をfile.readFile で改めて読み込み、代入する。
 */
function diff_1to1( options ) {
  const
    shared = {
      promiseGetGitDiffData : null,
      lastDiffData          : lastDiff.get(),
      currentDiffData       : null,
      totalFilesPassed      : 0,
    }
    ,settings = mergeWith( {}, defaultSettings, options )
  ;

  if ( settings.detection === false ) {
    return through.obj();
  }

  shared.promiseGetGitDiffData = _getGitDiffData(
    settings.name,
    settings.command,
    shared.lastDiffData,
  );


  return through.obj(
    _transformFor1to1( settings.name, shared ),
    _flushFor1to1( settings.name, shared ),
  );

}

function _transformFor1to1( name, shared ) {
  return function _transFormFor1to1( file, enc, callBack ) {
    if ( file.isStream && file.isStream() ) {
      this.emit( 'error' , new Error( 'Streaming not supported' ) );
      return callBack();
    }
    shared.promiseGetGitDiffData.then( ( diffData ) => {
      shared.currentDiffData = diffData;
      if (
        _includes( name, shared.currentDiffData, file.path ) ||
        _includes( name, shared.lastDiffData, file.path )
      ) {
        ( async function() {
          try {
            file.contents = await readFile( file.path );
            callBack( null, file );
            shared.totalFilesPassed += 1;
          } catch ( error ) {
            callBack( error );
          }
        } )();
      } else {
        callBack();
      }
    } );
  };

}

function _flushFor1to1( name, shared ) {
  return function _flush( callBack ) {
    lastDiff.set( shared.currentDiffData );
    _writeDiffData();
    _log( name, shared.totalFilesPassed, shared.totalFilesPassed );
    callBack();
  };
}

/*
 * through2.obj()の flush function 中で、実行。
 * 候補ファイルに依存するものを最終選択する。
 */
function selectTargetFiles( filePath, collection, destFiles ) {
  ( function _run_recursive( filePath ) {
    if ( Array.isArray( collection.get( filePath ) ) && collection.get( filePath ).length > 0 ) {
      collection.get( filePath ).forEach( ( item ) => {
        destFiles.set( item, 1 );
        if ( collection.has( item ) ) {
          _run_recursive( item );
        }
      } );
    }
  } )( filePath );
}

/*
 * 差分一覧のファイルへの書き込み。
 * ある程度時間を置いての処理で良いため、連続の呼び出しは、間引く。
 */
function _writeDiffData() {
  clearTimeout( writing_timeoutId );
  writing_timeoutId = setTimeout( () => {
    lastDiff.write();
    clearTimeout( writing_timeoutId );
    writing_timeoutId  = null;
  }, WRITING_DELAY_TIME );
}

/*
 * 検知数と通過させた数のログ
 */
function _log( name, detected, total ) {
  if ( name ) {
    fancyLog( chalk.gray( `[${ name }]: detected ${ detected } files diff` ) );
    fancyLog( chalk.gray( `[${ name }]: passed ${ total } files` ) );
  }
}

function _includes( name, data, filePath ) {
  filePath = relative( process.cwd(), filePath ).replace( /[\\]/g, '/' );
  return data[ name ] && Object.keys( data[ name ] ).includes( filePath );
}

/*
 * 'git status -suall <dir>'
 * 得られるファイルパスをkey に、属性（「M」 や「?」 など）を値にした、
 * oject（差分ファイルリスト） の作成。
 */
function _getGitDiffData( name, command, lastDiffData ) {
  return new Promise( ( prmResolve ) => {
    exec( command, ( error, stdout, stderror ) => {
      const diffData = {};
      Object.assign( diffData, lastDiffData );
      if ( error || stderror ) {
        fancyLog.error( chalk.hex( '#FF0000' )( 'diff_build.js \n' + error || stderror ) );
        prmResolve( diffData );
      }
      if ( stdout ) {
        const matchedAll = stdout.matchAll( /^(.{2})\s([^\n]+?)\n/mg );
        diffData[ name ] = {};
        for ( let item of matchedAll ) {
          // リネームの際の文字列をリネーム後のパスの形に変換する。
          if ( item[ 2 ].indexOf( ' -> ' ) > -1 ) {
            item[ 2 ] = item[ 2 ].split( ' -> ' )[ 1 ];
          }
          diffData[ name ][ item[ 2 ] ] = { status: item[ 1 ] };
        }
      }
      prmResolve( diffData );
    } );
  } );
}
