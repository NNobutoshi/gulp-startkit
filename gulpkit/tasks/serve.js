import server from 'browser-sync';

import { serve as config } from '../config.js';

const
  options = config.options
;

const serve_init = ( () => {
  if ( !config.enable ) {
    return function no_serve( cb ) {
      _done( cb );
    };
  }
  return function serve_init( cb ) {
    server.init( options );
    _done( cb );
  };
} )();

const serve_reload = ( () => {
  if ( !config.enable ) {
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


export { serve_init, serve_reload };

function _done( cb ) {
  if ( typeof cb === 'function' ) {
    return cb();
  }
}
