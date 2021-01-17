const
  config = require( '../config.js' ).serve
  ,options = ( config && config.options ) || false;
;
let
  browserSync
;
if ( options ) {
  browserSync = require( 'browser-sync' );
}

module.exports.serve_init = ( () => {
  if ( !browserSync ) {
    return function no_serve( done ) {
      _done( done );
    };
  }
  return function serve_init( done ) {
    browserSync.init( options );
    _done( done );
  };
} )();

module.exports.serve_reload = ( () => {
  if ( !browserSync ) {
    return false;
  }
  return function serve_reload( done ) {
    if ( browserSync.active ) {
      browserSync.reload();
    }
    _done( done );
  };
} )();

function _done( done ) {
  if ( typeof done === 'function' ) {
    return done();
  }
}
