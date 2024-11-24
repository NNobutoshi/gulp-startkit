import path         from 'node:path';
import { exec }     from 'node:child_process';
import { readFile } from 'node:fs';

import through   from 'through2';
import File      from 'vinyl';
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

  if ( !settings.detection ) {
    return through.obj();
  }

  shared.promiseGetGitDiffData = _getGitDiffData( settings.command );

  if ( typeof settings.allForOne === 'string' ) {
    settings.group = settings.allForOne.replace( /[/\\]/g, path.sep );
  }

  shared.promiseOnGitDiffData = shared.promiseGetGitDiffData.then( ( data ) => {
    return new Promise( ( resolve ) => {
      shared.currentDiffData = data;
      resolve( data );
    } );
  } );

  return through.obj(
    _retTransform( shared, settings, collect ),
    _retFlush( shared, settings, select ),
  );
}

function _retTransform( shared, settings, collect ) {
  return function _transform( file, enc, callBack ) {
    if ( file.isNull && file.isNull() ) {
      return callBack( null, file );
    }
    if ( file.isStream && file.isStream() ) {
      this.emit( 'error' );
      return callBack();
    }

    /*
     * すべてのchunk の必要最低限の情報を収集しておく
     */
    shared.allFiles.set( file.path, {
      // file : file, メモリ消費が抑えられるかもしれないので全部は代入しない
      base : file.base,
      path : file.path,
      stat : file.stat,
    } );

    /*
     * git コマンドで得た差分ファイルリストにchunk のpath があればstream で通す候補にし、
     * リストになくても、直近最後の差分としてリストにあればそれも候補にする。
     * そうしないと、git のrevert などが未検知になってしまうため。
     */
    shared.promiseOnGitDiffData.then( () => {

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
    for ( let [ filePath, value ] of Object.entries( shared.currentDiffData ) ) {
      if ( value.status.indexOf( 'D' )  > -1 ) {
        shared.targets.set( path.resolve( process.cwd(), filePath ), 1 );
      }
    }

    for ( let [ filePath, value ] of Object.entries( shared.lastDiffData ) ) {
      if ( !shared.currentDiffData[ filePath ] && value.status.indexOf( '?' ) > -1 ) {
        shared.targets.set( path.resolve( process.cwd(), filePath ), 1 );
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
      promiseReadFileAll.push( _promisePushReadFileToStream( filePath, shared.allFiles, stream ) );
    }

    Promise
      .all( promiseReadFileAll )
      .then( () => {
        _log( name, shared.targets.size, destFiles.size );
        lastDiff.set( shared.currentDiffData );
        shared = null;
        _writeDiffData();
        callBack();
      } )
      .catch( error => callBack( error ) )
    ;
  };
}

function _promisePushReadFileToStream( filePath, allFiles, stream ) {
  return new Promise( ( resolve, reject ) => {
    readFile( filePath, ( error, content ) =>{
      const file = new File( {
        base: allFiles.get( filePath ).base,
        path: allFiles.get( filePath ).path,
        stat: allFiles.get( filePath ).stat,
        contents: content,
      } );
      if ( error ) {
        reject( error );
      } else {
        stream.push( file );
        resolve();
      }
    } );
  } );
}

/*
 * one source → one destination 用。
 * Gulp.srcのオプション { read: false } の速さに期待して、
 * Gulp.src()を
 * 1段階目で { read false } で Git のdiff の結果からファイルのパスを取捨選択して
 * 2段階目で { read: true } で 選択したファイルで再実行。
 */
function diff_1to1( gulpSrc, firstSrc, mainTask, options, cb ) {
  const
    settings      = mergeWith( {}, defaultSettings, options )
    ,lastDiffData = lastDiff.get()
    ,preparedSrc = []
  ;
  if ( settings.detection === false ) {
    mainTask( firstSrc ).on( 'finish', () => cb() );
    return;
  }
  _getGitDiffData( settings.command ).then( ( currentDiffData ) => {
    gulpSrc( firstSrc, { read: false } )
      .pipe( through.obj( function( file, enc, callBack ) {
        if ( file.isStream && file.isStream() ) {
          this.emit( 'error' );
          return callBack();
        }
        if (
          _includes( currentDiffData, file.path ) ||
          _includes( lastDiffData, file.path )
        ) {
          preparedSrc.push( path.relative( process.cwd(), file.path ).replace( /[\\]/g, '/' ) );
        }
        callBack();
      } ) )
      .on( 'finish', () => {
        _log( settings.name, preparedSrc.length, preparedSrc.length );
        if ( preparedSrc.length === 0 ) {
          return cb();
        }
        mainTask( preparedSrc )
          .on( 'finish', () => {
            lastDiff.set( currentDiffData );
            _writeDiffData();
            cb();
          } )
        ;
      } )
    ;
  } );
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

function _includes( data, filePath ) {
  filePath = path.relative( process.cwd(), filePath ).replace( /[\\]/g, '/' );
  return Object.keys( data ).includes( filePath );
}

/*
 * 'git status -suall <dir>'
 * 得られるファイルパスをkey に、属性（「M」 や「?」 など）を値にした、
 * oject（差分ファイルリスト） の作成。
 */
function _getGitDiffData( comand ) {
  return new Promise( ( resolve ) => {
    exec( comand, ( error, stdout, stderror ) => {
      let diffData = {};
      if ( error || stderror ) {
        fancyLog.error( chalk.hex( '#FF0000' )( 'diff_build.js \n' + error || stderror ) );
        resolve( diffData );
      }
      if ( stdout ) {
        const matchedAll = stdout.matchAll( /^(.{2})\s([^\n]+?)\n/mg );
        for ( let item of matchedAll ) {
          // リネームの際の文字列をリネーム後のパスの形に変換する。
          if ( item[ 2 ].indexOf( ' -> ' ) > -1 ) {
            item[ 2 ] = item[ 2 ].split( ' -> ' )[ 1 ];
          }
          diffData[ item[ 2 ] ] = { status: item[ 1 ] };
        }
      }
      resolve( diffData );
    } );
  } );
}
