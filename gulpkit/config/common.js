import path from 'node:path';

import log   from 'fancy-log';
import chalk from 'chalk';

const
  NODE_ENV        = process.env.NODE_ENV
  ,WATCH_ENV      = process.env.WATCH_ENV
  ,DIFF_ENV       = process.env.DIFF_ENV
  ,IS_PRODUCTION  = ( NODE_ENV === 'production' )
  ,IS_DEVELOPMENT = ( NODE_ENV === 'development' )
;
const
  DIR_SRC =  {
    'production'  : 'src',
    'development' : 'src',
  },
  DIR_DIST = {
    'production'  : 'dist/production/html',
    'development' : 'dist/development/html',
  }
;
export const commonConfig = {
  NODE_ENV           : NODE_ENV,
  SRC                : DIR_SRC[ NODE_ENV ],
  DIST               : DIR_DIST[ NODE_ENV ],
  SOURCEMAPS_ENABLED : IS_DEVELOPMENT || !IS_PRODUCTION,
  WATCH_ENABLED      : ( WATCH_ENV ) ? !!Number( WATCH_ENV ) : IS_DEVELOPMENT || !IS_PRODUCTION,
  DIFF_ENABLED       : ( DIFF_ENV )  ? !!Number( DIFF_ENV )  : IS_DEVELOPMENT || !IS_PRODUCTION,
  SOURCEMAPS_DIR     : 'sourcemaps',
  WEBPACK_CACHE_PATH : path.resolve( process.cwd(), '.webpack_cache' ),
  ERROR_COLOR_HEX    : '#FF0000',
  PLACEHOLDER        : '[subdir]',
  EVENT_NAME_WATCH_INIT  : 'watchInit',
  EVENT_NAME_WATCH_START : 'watchStart',
}
;

export const commonOptions = {
  diff : {
    command  : `git status -suall gulpkit/ ${ commonConfig.SRC }/`,
    enabled  : commonConfig.DIFF_ENABLED,
    firstTasksEndedEventName : commonConfig.EVENT_NAME_WATCH_INIT,
    tasksEndedEventName      : commonConfig.EVENT_NAME_WATCH_START,
  },
  plumber : {
    errorHandler : function( err ) {
      log.error( chalk.hex( '#FF0000' )( err.stack ) );
      this.emit( 'end' );
    },
  }
};
