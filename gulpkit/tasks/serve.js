import server   from 'browser-sync';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';

import { serve as config } from '../config.js';

const
  options = config.options
;

export { serve_init, serve_reload };

function serve_init( cb ) {
  if ( !config.enable ) {
    fancyLog( chalk.gray( 'no serve' ) );
    return cb();
  }
  server.init( options );
  cb();
}

function serve_reload( cb ) {
  if ( server.active ) {
    server.reload();
  }
  cb();
}

