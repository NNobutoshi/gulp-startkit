const
  path      = require( 'path' )
  ,{ exec } = require( 'child_process' )
;
const
  through    = require( 'through2' )
  ,merge     = require( 'lodash/mergeWith' )
  ,log       = require( 'fancy-log' )
  ,chalk     = require( 'chalk' )
  ,lastStamp = require( './last_run_time.js' )
;
const
  WRITING_DELAY_TIME = 2000
  ,GIT_DIFF_COMMAND = 'git diff --name-only'
;
const
  promiseGetGitDiffList = _getGitDiffList( GIT_DIFF_COMMAND )
;
let
  writing_timeoutId = null
  ,gitDiffList = []
;

module.exports = diff_build;

function diff_build( options, map, filter ) {
  const
    allFiles = {}
    ,collection = {}
    ,targets = []
    ,defaultSettings = {
      hash      : '',
      allForOne : false,
    }
    ,settings = merge( {}, defaultSettings, options )
    ,since = ( settings.hash ) ? lastStamp.get( settings.hash ) : false
  ;
  let
    group = ''
    ,allForOne
  ;

  if ( typeof settings.allForOne === 'string' ) {
    group = settings.allForOne.replace( /[/\\]/g, path.sep );
  } else {
    allForOne = settings.allForOne;
  }

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {

    if ( file.isnNull ) {
      return callBack( null, file );
    }

    if ( file.isStream() ) {
      this.emit( 'error' );
      return callBack();
    }

    if ( gitDiffList.length ) {
      if ( file.path in gitDiffList ) {
        targets.push( file.path );
      }
      _main();
    } else {
      promiseGetGitDiffList.then( ( list ) => {
        if ( list.includes( file.path ) ) {
          targets.push( file.path );
        }
        gitDiffList = list;
        _main();
      } );
    }

    function _main() {
      if ( !since ||
        ( since && file.stat && (
          file.stat.mtime     >= since ||
          file.stat.ctime     >= since ||
          file.stat.birthtime >= since
        ) )
      ) {
        targets.push( file.path );
      }

      allFiles[ file.path ]  = {
        file : file,
      };

      if ( group ) {
        allFiles[ file.path ].group =
          file.path.slice( 0, file.path.indexOf( group ) + group.length );
      }

      if ( typeof map === 'function' ) {
        map.call( null, file, collection );
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
        if ( typeof filter === 'function' ) {
          filter.call( null, filePath, collection, destFiles );
        }
      } );
    }

    Object.keys( destFiles ).forEach( ( filePath ) => {
      self.push( allFiles[ filePath ].file );
    } );
    total = Object.keys( destFiles ).length;

    _log( hash, total );

    if ( hash ) {
      self.on( 'finish', () => {
        lastStamp.set( hash );
      } );
    }

    clearTimeout( writing_timeoutId );
    writing_timeoutId = setTimeout( () => {
      lastStamp.write();
      clearTimeout( writing_timeoutId );
    }, WRITING_DELAY_TIME );

    return callBack();

  }

  function _log( hash, total ) {
    if ( hash ) {
      log( `[${hash}]: detected ${targets.length} files diff` );
      log( `[${hash}]: thrown ${total} files` );
    }
  }

}

function _getGitDiffList( comand ) {
  return new Promise( ( resolve ) => {
    exec( comand, ( error, stdout, stderror ) => {
      let retArray = [];
      if ( error || stderror ) {
        log.error( chalk.hex( '#FF0000' )( 'diff_build.js \n' + error || stderror ) );
        retArray.length = 1;
        resolve( retArray );
      }
      if ( stdout ) {
        retArray = stdout.trim().split( '\n' ).map( item => path.join( process.cwd(), item ) );
      } else {
        retArray.length = 1;
      }
      resolve( retArray );
    } );
  } );
}
