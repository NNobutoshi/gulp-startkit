const
  through    = require( 'through2' )
  ,merge     = require( 'lodash/mergeWith' )
  ,lastStamp = require( './last_run_time.js' )
  ,log       = require( 'fancy-log' )
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
    }
    ,settings = merge( {}, defaultSettings, options )
    ,since = ( settings.hash ) ? lastStamp.get( settings.hash ) : false
  ;
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
    allFiles[ file.path ] = file;
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
      if ( settings.allForOne === true ) {
        for ( let o in allFiles ) {
          self.push( allFiles[ o ] );
        }
        total = targets.length;
      } else {
        targets.forEach( ( filePath ) => {
          destFiles[ filePath ] = 1;
          if ( typeof filter === 'function' ) {
            filter.call( null, filePath, collection, destFiles );
          }
        } );
        Object.keys( destFiles ).forEach( ( filePath ) => {
          self.push( allFiles[ filePath ] );
        } );
        total = Object.keys( destFiles ).length;
      }
    }
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
// process.on( 'exit', () => {
//   lastStamp.write();
// } );
