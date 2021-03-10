const
  path      = require( 'path' )
  ,{ exec } = require( 'child_process' )
;
const
  through    = require( 'through2' )
  ,mergeWith = require( 'lodash/mergeWith' )
  ,log       = require( 'fancy-log' )
  ,chalk     = require( 'chalk' )
;
const
  lastDiff  = require( './last_diff.js' )
;
const
  WRITING_DELAY_TIME = 2000
;
let
  writing_timeoutId = null
  ,promiseGetGitDiffList // 各読み込み元で共有のため、この位置で
;

/*
 * Git で管理する前提での差分ビルド。
 * いったんGulp.src を通った後なので
 * Gulp.src( { since: Gulp.lastRun() } ) よりは遅い。
 */
module.exports = diff_build;

function diff_build( options, collect, select ) {
  const
    allFiles         = {}
    ,collection      = {}
    ,targets         = []
    ,defaultSettings = {
      name      : '',
      allForOne : false,
      detection : true,
      command   : 'git status -s',
    }
    ,settings = mergeWith( {}, defaultSettings, options )
  ;
  let
    group = ''
    ,allForOne
    ,currentDiffMap
    ,lastDiffMap = lastDiff.get() // キャッシュされている差分ファイルリストを取得。
  ;

  if ( !settings.detection ) {
    return through.obj();
  }

  promiseGetGitDiffList = promiseGetGitDiffList || _getGitDiffList( settings.command );

  if ( typeof settings.allForOne === 'string' ) {
    group = settings.allForOne.replace( /[/\\]/g, path.sep );
  } else {
    allForOne = settings.allForOne;
  }

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {

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
    if ( currentDiffMap ) { //git コマンドで得た差分ファイルリストが既にあれば
      if (
        _includes( currentDiffMap, file.path ) ||
       !_includes( currentDiffMap, file.path ) && _includes( lastDiffMap, file.path )
      ) {
        targets.push( file.path );
      }
      _continue();
    } else { // なければpromise のresolve を待ち、続きの処理を待機させる
      promiseGetGitDiffList.then( ( map ) => {
        if (
          _includes( map, file.path ) ||
         !_includes( map, file.path ) && _includes( lastDiffMap, file.path )
        ) {
          targets.push( file.path );
        }
        currentDiffMap = map;
        _continue();
      } );
    }

    function _continue() {

      /*
       * すべてのchunk は収集しておく
       */
      allFiles[ file.path ]  = {
        file : file,
      };

      /*
       * 複数のsrc ファイルを一つのdist にするようなタスク用。
       * 自身のパスをkey に、所属するグループ（設定で指定されたポイントとなるディレクトリ）を値に。
       */
      if ( group ) {
        allFiles[ file.path ].group =
          file.path.slice( 0, file.path.indexOf( group ) + group.length );
      }

      /*
       * ファイルの依存関係をcall back で収集してもらう。
       */
      if ( typeof collect === 'function' ) {
        collect.call( null, file, collection );
      }

      callBack();
    }

  }

  function _flush( callBack ) {
    const
      stream     = this
      ,destFiles = {}
      ,name      = settings.name
    ;
    let
      total = 0
    ;

    /*
     * 候補がなければ終了。
     */
    if ( targets.length === 0 ) {
      _log( name, total );
      _runLater();
      return callBack();
    }

    /*
     * 例えば候補が1ファイルでも、所属している同じグループのファイルは、全部通す。
     * 複数ファイルを一つのdist にするようなタスク用。
     */
    if ( group ) {
      for ( let filePath in allFiles ) {
        targets.forEach( ( targetFilePath ) => {
          if ( filePath.indexOf( allFiles[ targetFilePath ].group ) === 0 ) {
            destFiles[ filePath ] = 1;
          }
        } );
      }

    /*
     * 全部道連れにする場合。
     */
    } else if ( allForOne ) {
      for ( let filePath in allFiles ) {
        destFiles[ filePath ] = 1;
      }

    /*
     * 候補として収集したものを通す。
     */
    } else {
      targets.forEach( ( filePath ) => {
        destFiles[ filePath ] = 1;

        /*
         * 収集した依存関係から候補ファイルと関係のあるファイルの最終的な選択。
         */
        if ( typeof select === 'function' ) {
          select.call( null, filePath, collection, destFiles );
        }
      } );
    }

    /*
     * destFiles （最終候補）のkey をpath に持つchunk をallFiles から取得して、
     * stream にプッシュする。
     */
    Object.keys( destFiles ).forEach( ( filePath ) => {
      stream.push( allFiles[ filePath ].file );
    } );
    total = Object.keys( destFiles ).length;

    _log( name, total );

    stream.on( 'finish', () => {
      lastDiffMap = currentDiffMap;
      lastDiff.set( currentDiffMap );
    } );

    _runLater();

    return callBack();

    /*
     * 差分一覧のファイルへの書き込みと、 promise の破棄。
     * ある程度時間を置いての処理で良いため、連続の呼び出しは、間引く。
     */
    function _runLater() {
      clearTimeout( writing_timeoutId );
      writing_timeoutId = setTimeout( () => {
        lastDiff.write();
        clearTimeout( writing_timeoutId );
        promiseGetGitDiffList = null;
        writing_timeoutId  = null;
      }, WRITING_DELAY_TIME );
    }

  }

  /*
   * 検知数と通過させた数のログ
   */
  function _log( name, total ) {
    if ( name ) {
      log( chalk.gray( `[${name}]: detected ${targets.length} files diff` ) );
      log( chalk.gray( `[${name}]: thrown ${total} files` ) );
    }
  }

}

function _includes( map, filePath ) {
  filePath = path.relative( process.cwd(), filePath ).replace( /[\\]/g, '/' );
  return Object.keys( map ).includes( filePath );
}

/*
 * 'git status -s <dir>'
 * 得られるファイルパスをkey に、属性（「M」 や「?」 など）を値にした、
 * oject（差分ファイルリスト） の作成。
 */
function _getGitDiffList( comand ) {
  return new Promise( ( resolve ) => {
    exec( comand, ( error, stdout, stderror ) => {
      let diffMap = {};
      if ( error || stderror ) {
        log.error( chalk.hex( '#FF0000' )( 'diff_build.js \n' + error || stderror ) );
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
