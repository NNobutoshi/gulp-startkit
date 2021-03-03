const
  config   = require( '../config.js' ).serve
  ,options = config.options
;
let
  server
;

if ( config.enable === true ) {
  server = require( 'browser-sync' );
}

module.exports.serve_init = ( () => {
  if ( !server ) {
    return function no_serve( cb ) {
      _done( cb );
    };
  }
  return function serve_init( cb ) {
    server.init( options );
    _done( cb );
  };
} )();

module.exports.serve_reload = ( () => {
  if ( !server ) {
    return false;
  }
  return function serve_reload( cb ) {
    if ( server.active ) {
      server.reload();
    }
    _done( cb );
  };
} )();

function _done( done ) {
  if ( typeof done === 'function' ) {
    return done();
  }
}
