const
  config   = require( '../config.js' ).serve
  ,options = ( config && config.enable && config.options ) || false
;
let
  server
;

if ( options ) {
  server = require( 'browser-sync' );
}

module.exports.serve_init = ( () => {
  if ( !server ) {
    return function no_serve( done ) {
      _done( done );
    };
  }
  return function serve_init( done ) {
    server.init( options );
    _done( done );
  };
} )();

module.exports.serve_reload = ( () => {
  if ( !server ) {
    return false;
  }
  return function serve_reload( done ) {
    if ( server.active ) {
      server.reload();
    }
    _done( done );
  };
} )();

function _done( done ) {
  if ( typeof done === 'function' ) {
    return done();
  }
}
