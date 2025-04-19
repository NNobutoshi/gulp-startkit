import { existsSync }       from 'node:fs';
import { fileURLToPath }    from 'node:url';
import { dirname, resolve } from 'node:path';

import browserSync from 'browser-sync';
import fancyLog    from 'fancy-log';
import chalk       from 'chalk';

export { init_browse, reload_browse };

const
  RELATIVEFILEPATH  = '../config_browse.js'
  ,FILEPATH         = resolve( dirname( fileURLToPath( import.meta.url ) ), RELATIVEFILEPATH )
;

async function init_browse( done ) {
  if ( !existsSync( FILEPATH ) ) {
    fancyLog( chalk.gray( 'no serve' ) );
    done();
    return;
  }
  try {
    const { enabled, options } = await import( RELATIVEFILEPATH );
    if ( enabled === false ) {
      fancyLog( chalk.gray( 'no serve' ) );
      done();
      return;
    }
    browserSync.init( options );
    done();
    return;
  } catch ( err ) {
    fancyLog( chalk.red( err ) );
    done();
    return;
  }
}

function reload_browse( done ) {
  if ( browserSync.active ) {
    browserSync.reload();
  }
  done();
}
