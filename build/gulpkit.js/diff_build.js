const
  through    = require( 'through2' )
  ,merge     = require( 'lodash/mergeWith' )
  ,LastStamp = require( './last_stamp.js' )
;
const
  lastStamp = new LastStamp()
;
module.exports = diff_build;

function diff_build( options, map, filter ) {
  const
    allFiles = {}
    ,deps = {}
    ,targets = []
    ,defaultSettings = {
      hash      : '',
      allForOne : false,
    }
    ,settings = merge( {}, defaultSettings, options )
  ;

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    const
      hash = settings.hash
      ,since = ( hash ) ? lastStamp.read( hash ) : false
    ;
    if ( !since || ( since && file.stat && file.stat.mtime >= since ) ) {
      targets.push( file.path );
    }
    allFiles[ file.path ] = file;
    if ( typeof map === 'function' ) {
      map.call( null, file, deps );
    }
    callBack();
  }

  function _flush( callBack ) {
    const
      self       = this
      ,destFiles = {}
      ,hash      = settings.hash
    ;
    if ( targets.length ) {
      if ( settings.allForOne === true ) {
        for ( let o in allFiles ) {
          self.push( allFiles[ o ] );
        }
      } else {
        targets.forEach( ( filePath ) => {
          destFiles[ filePath ] = 1;
          if ( typeof filter === 'function' ) {
            filter.call( null, filePath, deps, destFiles );
          }
        } );
        Object.keys( destFiles ).forEach( ( item ) => {
          self.push( allFiles[ item ] );
        } );
      }
    }
    self.on( 'finish', () => {
      lastStamp.write( hash );
    } );
    callBack();
  }

}
