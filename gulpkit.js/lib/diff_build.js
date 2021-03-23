const
  path      = require( 'path' )
  ,{ exec } = require( 'child_process' )
;
const
  through    = require( 'through2' )
  ,mergeWith = require( 'lodash/mergeWith' )
  ,fancyLog  = require( 'fancy-log' )
  ,chalk     = require( 'chalk' )
;
const
  lastDiff  = require( './last_diff.js' )
;
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

/*
 * Git で管理する前提での差分ビルド。
 * いったんGulp.src を通った後なので
 * Gulp.src( { since: Gulp.lastRun() } ) よりは遅い。
 */
module.exports = diff_build;

function diff_build( options, collect, select ) {
  const
    stores = {
      allFiles        : {}, // 全chumk用
      collection      : {}, // 依存関係収集用
      targets         : {}, // 通過候補
      removes         : [], // 削除ファイル
      currentDiffMap  : null,
      lastDiffMap     : lastDiff.get(),
      promiseGetGitDiffList : null,
    },
    settings = mergeWith( {}, defaultSettings, options )
  ;
  stores.promiseGetGitDiffList = _getGitDiffList( settings.command );

  if ( !settings.detection ) {
    return through.obj();
  }
  if ( typeof settings.allForOne === 'string' ) {
    settings.group = settings.allForOne.replace( /[/\\]/g, path.sep );
  } else {
    settings.allForOne = settings.allForOne;
  }

  return through.obj( _transform( stores, settings, collect ), _flush( stores, settings, select ) );

}

function _transform( stores, settings, collect ) {

  return function( file, enc, callBack ) {
    if ( file.isNull() ) {
      return callBack( null, file );
    }
    if ( file.isStream() ) {
      this.emit( 'error' );
      return callBack();
    }

    /*
     * git コマンドで得た差分ファイルリストにchunk のpath があればstream で通す候補にし、
     * リストになくても、直近最後の差分としてリストにあればそれも候補にする。
     * そうしないと、git のrevert などが未検知になってしまうため。
     */
    if ( stores.currentDiffMap ) { //git コマンドで得た差分ファイルリストが既にあれば
      if (
        _includes( stores.currentDiffMap, file.path ) ||
       !_includes( stores.currentDiffMap, file.path ) && _includes( stores.lastDiffMap, file.path )
      ) {
        stores.targets[ file.path ] = 1;
      }
      _next();
    } else { // なければpromise のresolve を待ち、続きの処理を待機させる
      stores.promiseGetGitDiffList.then( ( map ) => {
        if (
          _includes( map, file.path ) ||
         !_includes( map, file.path ) && _includes( stores.lastDiffMap, file.path )
        ) {
          stores.targets[ file.path ] = 1;
        }
        stores.currentDiffMap = map;
        _next();
      } );
    }

    function _next() {

      /*
       * すべてのchunk は収集しておく
       */
      stores.allFiles[ file.path ]  = {
        file : file,
      };

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
    }
  };
}

function _flush( stores, settings, select ) {
  return function( callBack ) {
    const
      stream     = this
      ,destFiles = {}
      ,name      = settings.name
      ,group = settings.group
    ;
    let
      total = 0
    ;

    /*
     * 消去されたファイルを収集
     */
    for ( let [ filePath, value ] of Object.entries( stores.currentDiffMap ) ) {
      if ( value.status.indexOf( 'D' )  > -1 ) {
        stores.removes.push( path.resolve( process.cwd(), filePath ) );
      }
    }

    for ( let filePath in stores.lastDiffMap ) {
      if ( !stores.currentDiffMap[ filePath ] ) {
        stores.removes.push( path.resolve( process.cwd(), filePath ) );
      }
    }

    /*
     * 例えば候補が1ファイルでも、所属している同じグループのファイルは、全部通す。
     * 複数ファイルを一つのdist にするようなタスク用。
     */
    if ( group ) {
      for ( let filePath in stores.allFiles ) {
        stores.removes.forEach( ( removeFilePath ) => {
          const myGroup = removeFilePath.slice( 0, removeFilePath.indexOf( group ) + group.length );
          if ( myGroup === stores.allFiles[ filePath ].group ) {
            destFiles[ filePath ] = 1;
            stores.targets[ removeFilePath ] = 1;
          }
        } );
        for ( let targetFilePath in stores.targets ) {
          if (
            stores.allFiles[ targetFilePath ] &&
            stores.allFiles[ targetFilePath ].group &&
            filePath.indexOf( stores.allFiles[ targetFilePath ].group ) === 0
          ) {
            destFiles[ filePath ] = 1;
          }
        }
      }

    /*
     * 全部道連れにする場合。
     */
    } else if ( stores.allForOne ) {
      for ( let filePath in stores.allFiles ) {
        destFiles[ filePath ] = 1;
      }

    /*
     * 候補として収集したものを通す。
     */
    } else {
      for ( let filePath in stores.targets ) {
        destFiles[ filePath ] = 1;

        /*
         * 収集した依存関係から候補ファイルと関係のあるファイルの最終的な選択。
         */
        if ( typeof select === 'function' ) {
          select.call( null, filePath, stores.collection, destFiles );
        }
      }
    }

    /*
     * destFiles （最終候補）のkey をpath に持つchunk をallFiles から取得して、
     * stream にプッシュする。
     */
    for ( let filePath in destFiles ) {
      stream.push( stores.allFiles[ filePath ].file );
      total = total + 1;
    }

    _log( name, total, Object.keys( stores.targets ).length );
    stores.lastDiffMap = stores.currentDiffMap;
    lastDiff.set( stores.currentDiffMap );
    stores.promiseGetGitDiffList = null;

    _runLater();
    return callBack();

  };
}

/*
 * 差分一覧のファイルへの書き込み。
 * ある程度時間を置いての処理で良いため、連続の呼び出しは、間引く。
 */
function _runLater() {
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
    fancyLog( chalk.gray( `[${name}]: detected ${detected} files diff` ) );
    fancyLog( chalk.gray( `[${name}]: thrown ${total} files` ) );
  }
}
function _includes( map, filePath ) {
  filePath = path.relative( process.cwd(), filePath ).replace( /[\\]/g, '/' );
  return Object.keys( map ).includes( filePath );
}

/*
 * 'git status -suall <dir>'
 * 得られるファイルパスをkey に、属性（「M」 や「?」 など）を値にした、
 * oject（差分ファイルリスト） の作成。
 */
function _getGitDiffList( comand ) {
  return new Promise( ( resolve ) => {
    exec( comand, ( error, stdout, stderror ) => {
      let diffMap = {};
      if ( error || stderror ) {
        fancyLog.error( chalk.hex( '#FF0000' )( 'diff_build.js \n' + error || stderror ) );
        resolve( diffMap );
      }
      if ( stdout ) {
        const matchedAll = stdout.matchAll( /^(.{2})\s([^\n]+?)\n/mg );
        for ( let item of matchedAll ) {
          diffMap[ item[ 2 ] ] = { status: item[ 1 ] };
        }
      }
      resolve( diffMap );
    } );
  } );
}
