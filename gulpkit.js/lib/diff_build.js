const
  path      = require( 'path' )
  ,{ exec } = require( 'child_process' )
;
const
  through     = require( 'through2' )
  ,mergeWith  = require( 'lodash/mergeWith' )
  ,log        = require( 'fancy-log' )
  ,chalk      = require( 'chalk' )
;
const
  lastDiff  = require( './last_diff.js' )
;
const
  GIT_DIFF_COMMAND  = 'git status -s gulpkit.js/ src/'
  ,WRITING_DELAY_TIME = 2000
;
let
  writing_timeoutId = null
  ,promiseGetGitDiffList
;

console.info( process.cwd() );

module.exports = diff_build;

function diff_build( options, collect, select ) {

  const
    allFiles         = {}
    ,collection      = {}
    ,targets         = []
    ,defaultSettings = {
      hash      : '',
      allForOne : false,
    }
    ,settings = mergeWith( {}, defaultSettings, options )
  ;
  let
    group = ''
    ,allForOne
    ,currentDiffMap
    ,lastDiffMap = lastDiff.get()
  ;

  promiseGetGitDiffList = promiseGetGitDiffList || _getGitDiffList( GIT_DIFF_COMMAND );

  if ( typeof settings.allForOne === 'string' ) {
    group = settings.allForOne.replace( /[/\\]/g, path.sep );
  } else {
    allForOne = settings.allForOne;
  }

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {

    if ( file.isNull() ) {
      console.info( file.isNull, 'null' );
      return callBack( null, file );
    }

    if ( file.isStream() ) {
      this.emit( 'error' );
      return callBack();
    }

    if ( currentDiffMap ) {
      if (
        _has( currentDiffMap, file.path ) ||
       !_has( currentDiffMap, file.path ) && _has( lastDiffMap, file.path )
      ) {
        targets.push( file.path );
      }
      _main();
    } else {
      promiseGetGitDiffList.then( ( map ) => {
        if (
          _has( map, file.path ) ||
         !_has( map, file.path ) && _has( lastDiffMap, file.path )
        ) {
          targets.push( file.path );
        }
        currentDiffMap = map;
        _main();
      } );
    }

    function _main() {

      allFiles[ file.path ]  = {
        file : file,
      };

      if ( group ) {
        allFiles[ file.path ].group =
          file.path.slice( 0, file.path.indexOf( group ) + group.length );
      }

      if ( typeof collect === 'function' ) {
        collect.call( null, file, collection );
      }

      callBack();
    }

  }

  function _flush( callBack ) {
    const
      self       = this
      ,destFiles = {}
      ,hash      = settings.hash
    ;
    let
      total = 0
    ;

    if ( targets.length === 0 ) {
      _log( hash, total );
      _runLater();
      return callBack();
    }

    if ( group ) {
      for ( let filePath in allFiles ) {
        targets.forEach( ( targetFilePath ) => {
          if ( filePath.indexOf( allFiles[ targetFilePath ].group ) === 0 ) {
            destFiles[ filePath ] = 1;
          }
        } );
      }
    } else if ( allForOne ) {
      for ( let filePath in allFiles ) {
        destFiles[ filePath ] = 1;
      }
    } else {
      targets.forEach( ( filePath ) => {
        destFiles[ filePath ] = 1;
        if ( typeof select === 'function' ) {
          select.call( null, filePath, collection, destFiles );
        }
      } );
    }

    Object.keys( destFiles ).forEach( ( filePath ) => {
      self.push( allFiles[ filePath ].file );
    } );
    total = Object.keys( destFiles ).length;

    _log( hash, total );

    self.on( 'finish', () => {
      lastDiffMap =  currentDiffMap;
      lastDiff.set( currentDiffMap );
    } );

    _runLater();

    return callBack();

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

  function _log( hash, total ) {
    if ( hash ) {
      log( chalk.gray( `[${hash}]: detected ${targets.length} files diff` ) );
      log( chalk.gray( `[${hash}]: thrown ${total} files` ) );
    }
  }

}

function _has( map, filePath ) {
  filePath =  path.relative( process.cwd(), filePath ).replace( /[\\]/g, '/' );
  return Object.keys( map ).includes( filePath );
}

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
