import browserSync from 'browser-sync';
import fancyLog    from 'fancy-log';
import chalk       from 'chalk';

import { browse as config } from '../config.js';

const
  options = config.options
;

export { init_browse, reload_browse };

function init_browse( cb ) {
  if ( !config.enable ) {
    fancyLog( chalk.gray( 'no serve' ) );
    return cb();
  }
  browserSync.init( options );
  cb();
}

function reload_browse( cb ) {
  if ( browserSync.active ) {
    browserSync.reload();
  }
  cb();
}

