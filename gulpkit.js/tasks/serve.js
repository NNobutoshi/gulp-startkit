const
  config   = require( '../config.js' ).serve
  ,options = config.options
;
let
  server = ( config.enable === true ) ? require( 'browser-sync' ) : null
;

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
    return function no_serve( cb ) {
      _done( cb );
    };
  }
  return function serve_reload( cb ) {
    if ( server.active ) {
      server.reload();
    }
    _done( cb );
  };
} )();

function _done( cb ) {
  if ( typeof cb === 'function' ) {
    return cb();
  }
}
