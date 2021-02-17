const
  through    = require( 'through2' )
  ,merge     = require( 'lodash/mergeWith' )
  ,lastStamp = require( './last_run_time.js' )
  ,log       = require( 'fancy-log' )
  ,path      = require( 'path' )
;
const
  WRITING_DELAY_TIME = 2000
;
let
  writing_timeoutId = null
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
      base      : '',
    }
    ,settings = merge( {}, defaultSettings, options )
    ,since = ( settings.hash ) ? lastStamp.get( settings.hash ) : false
  ;
  settings.base = settings.base.replace( /[/\\]/g, path.sep );

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    if ( !since || ( since && file.stat && file.stat.mtime >= since ) ) {
      targets.push( file.path );
    }
    if ( file.isnNull ) {
      return callBack( null, file );
    }
    if ( file.isStream() ) {
      this.emit( 'error' );
      callBack();
    }
    allFiles[ file.path ]  = {
      file : file,
    };
    if ( settings.base ) {
      allFiles[ file.path ].base = file.path.slice( 0, file.path.indexOf( settings.base ) );
      allFiles[ file.path ].base += settings.base;
    }
    if ( typeof map === 'function' ) {
      map.call( null, file, collection );
    }
    callBack();
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

    if ( targets.length ) {
      if ( settings.allForOne === true && settings.base ) {
        for ( let filePath in allFiles ) {
          targets.forEach( ( targetFilePath ) => {
            const base = allFiles[ targetFilePath ].base;
            if ( filePath.indexOf( base ) === 0 ) {
              destFiles[ filePath ] = 1;
            }
          } );
        }
      } else if ( settings.allForOne === true ) {
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
    }

    log( `[${hash}]: detected ${targets.length} files time diff` );
    log( `[${hash}]: thrown ${total} files` );

    self.on( 'finish', () => {
      lastStamp.set( hash );
    } );

    clearTimeout( writing_timeoutId );
    writing_timeoutId = setTimeout( () => {
      lastStamp.write();
      clearTimeout( writing_timeoutId );
    }, WRITING_DELAY_TIME );

    callBack();
  }
}
