import path     from 'node:path';
import { exec } from 'node:child_process';

import through   from  'through2';
import mergeWith from  'lodash/mergeWith.js';
import fancyLog  from  'fancy-log';
import chalk     from  'chalk';

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
  diff_1on1,
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
    stores = {
      allFiles         : {}, // 全chumk用
      collection       : {}, // 依存関係収集用
      targets          : {}, // 通過候補
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

  stores.promiseGetGitDiffData = _getGitDiffData( settings.command );

  if ( typeof settings.allForOne === 'string' ) {
    settings.group = settings.allForOne.replace( /[/\\]/g, path.sep );
  }

  stores.promiseOnGitDiffData = stores.promiseGetGitDiffData.then( ( data ) => {
    return new Promise( ( resolve ) => {
      stores.currentDiffData = data;
      resolve( data );
    } );
  } );

  return through.obj( _transform( stores, settings, collect ), _flush( stores, settings, select ) );
}

function _transform( stores, settings, collect ) {

  return function( file, enc, callBack ) {
    if ( file.isNull && file.isNull() ) {
      return callBack( null, file );
    }
    if ( file.isStream && file.isStream() ) {
      this.emit( 'error' );
      return callBack();
    }

    /*
     * すべてのchunk は収集しておく
     */
    stores.allFiles[ file.path ]  = {
      file : file,
    };

    /*
     * git コマンドで得た差分ファイルリストにchunk のpath があればstream で通す候補にし、
     * リストになくても、直近最後の差分としてリストにあればそれも候補にする。
     * そうしないと、git のrevert などが未検知になってしまうため。
     */
    stores.promiseOnGitDiffData.then( () => {

      if (
        _includes( stores.currentDiffData, file.path ) ||
        _includes( stores.lastDiffData, file.path )
      ) {
        stores.targets[ file.path ] = 1;
      }

      /*
       * 複数のsrc ファイルを一つのdist にするようなタスク用。
       * 自身のパスをkey に、所属するグループ（設定で指定されたポイントとなるディレクトリ）を値に。
       */
      if ( settings.group ) {
        stores.allFiles[ file.path ].group =
          file.path.slice( 0, file.path.indexOf( settings.group ) + settings.group.length );
      }

      /*
       * ファイルの依存関係をcall back で収集してもらう。
       */
      if ( typeof collect === 'function' ) {
        collect.call( null, file, stores.collection );
      }
      callBack();
    } );

  };
}

function _flush( stores, settings, select ) {
  return function( callBack ) {
    const
      stream     = this
      ,destFiles = {}
      ,name      = settings.name
      ,group     = settings.group
    ;

    if ( stores.currentDiffData === null ) {
      return callBack();
    }

    /*
     * 消去されたファイルもtargetに。
     */
    for ( let [ filePath, value ] of Object.entries( stores.currentDiffData ) ) {
      if ( value.status.indexOf( 'D' )  > -1 ) {
        stores.targets[ path.resolve( process.cwd(), filePath ) ] = 1;
      }
    }

    for ( let [ filePath, value ] of Object.entries( stores.lastDiffData ) ) {
      if ( !stores.currentDiffData[ filePath ] && value.status.indexOf( '?' ) > -1 ) {
        stores.targets[ path.resolve( process.cwd(), filePath ) ] = 1;
      }
    }

    /*
     * 例えば候補が1ファイルでも、所属している同じグループのファイルは、全部通す。
     * 複数ファイルを一つのdist にするようなタスク用。
     */
    if ( group ) {

      for ( let filePath in stores.allFiles ) {
        for ( let targetFilePath in stores.targets ) {
          const myGroup = targetFilePath.slice( 0, targetFilePath.indexOf( group ) + group.length );
          if (
            ( stores.allFiles[ targetFilePath ] &&
              stores.allFiles[ targetFilePath ].group &&
              filePath.indexOf( stores.allFiles[ targetFilePath ].group ) === 0
            ) ||
             myGroup === stores.allFiles[ filePath ].group
          ) {
            destFiles[ filePath ] = 1;
          }
        } // for
      } // for

    /*
     * 全部道連れにする場合。
     */
    } else if ( settings.allForOne === true ) {
      for ( let filePath in stores.allFiles ) {
        destFiles[ filePath ] = 1;
      }

    /*
     * 候補として収集したものを通す。
     */
    } else {
      for ( let filePath in stores.targets ) {
        if ( stores.collection[ filePath ] ) {
          stores.collection[ filePath ].forEach( dependentFilePath => {
            destFiles[ dependentFilePath ] = 1;
          } );
        }
        if ( stores.allFiles[ filePath ] ) {
          destFiles[ filePath ] = 1;
        } else {
          continue;
        }

        /*
         * 収集した依存関係から候補ファイルと関係のあるファイルの最終的な選択。
         */
        if ( typeof select === 'function' ) {
          select.call( null, filePath, stores.collection, destFiles );
        }
      } //for
    }

    /*
     * destFiles （最終候補）のkey をpath に持つchunk をallFiles から取得して、
     * stream にプッシュする。
     */
    for ( let filePath in destFiles ) {
      stream.push( stores.allFiles[ filePath ].file );
    }

    _log( name, Object.keys( destFiles ).length, Object.keys( stores.targets ).length );
    stores.lastDiffData = stores.currentDiffData;
    lastDiff.set( stores.currentDiffData );
    stores.promiseGetGitDiffData = null;
    stores.promiseOnGitDiffData = null;
    _writeDiffData();
    return callBack();

  };
}


/*
 * one source → one destination 用。
 * Gulp.srcのオプション { read: false } の速さに期待して、
 * Gulp.src()を
 * 1段階目で { read false } で Git のdiff の結果からファイルのパスを取捨選択して
 * 2段階目で { read: true } で 選択したファイルで再実行。
 */
async function diff_1on1( gulpSrc, firstSrc, mainTask, options ) {
  const
    settings = mergeWith( {}, defaultSettings, options )
    ,lastDiffData    = lastDiff.get()
    ,currentDiffData = await _getGitDiffData( settings.command )
    ,fixedSrc = await _setUpByFirstSrc( gulpSrc, firstSrc, currentDiffData, lastDiffData )
  ;
  await _runByFixedSrc( mainTask, fixedSrc, currentDiffData, settings );
}


function _setUpByFirstSrc( src, firstSrc, currentDiffData, lastDiffData ) {
  const
    fixedSrc = []
  ;
  return new Promise( ( resolve ) => {
    src( firstSrc, { read: false } )
      .pipe( through.obj( function( file, enc, callBack ) {
        if ( file.isStream && file.isStream() ) {
          this.emit( 'error' );
          return callBack();
        }
        if (
          _includes( currentDiffData, file.path ) ||
          _includes( lastDiffData, file.path )
        ) {
          fixedSrc.push( path.relative( process.cwd(), file.path ).replace( /[\\]/g, '/' ) );
        }
        callBack();
      } ) )
      .on( 'finish', () => {
        resolve( fixedSrc );
      } )
    ;
  } );
}


function _runByFixedSrc( mainTask, fixedSrc, currentDiffData, settings ) {
  _log( settings.name, fixedSrc.length, fixedSrc.length );
  return new Promise( ( resolve ) => {
    if ( fixedSrc.length === 0 ) {
      return resolve();
    }
    mainTask
      .call( null, fixedSrc, resolve )
      .on( 'finish', () => {
        lastDiff.set( currentDiffData );
        _writeDiffData();
      } );
  } );

}


/*
 * through2.obj()の flushFunction 中で、実行。
 * 候補ファイルに依存するものを最終選択する。
 */
function selectTargetFiles( filePath, collection, destFiles ) {
  ( function _run_recursive( filePath ) {
    if ( Array.isArray( collection[ filePath ] ) && collection[ filePath ].length > 0 ) {
      collection[ filePath ].forEach( ( item ) => {
        destFiles[ item ] = 1;
        if ( Object.keys( collection ).includes( item ) ) {
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
function _log( name, total, detected ) {
  if ( name ) {
    fancyLog( chalk.gray( `[${ name }]: detected ${ detected } files diff` ) );
    fancyLog( chalk.gray( `[${ name }]: thrown ${ total } files` ) );
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
