import browserSync from 'browser-sync';
import fancyLog    from 'fancy-log';
import chalk       from 'chalk';

import config from '../config_browse.js';

const
  options = config.options
;

export { init_browse, reload_browse };

function init_browse( done ) {
  if ( !config.enable ) {
    fancyLog( chalk.gray( 'no serve' ) );
    return done();
  }
  browserSync.init( options );
  done();
}

function reload_browse( done ) {
  if ( browserSync.active ) {
    browserSync.reload();
  }
  done();
}

