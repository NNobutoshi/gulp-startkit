import { config, options } from './common.js';
import switchConfig        from './switch.js';

const
  devConfig = {
    src : [
      './gulpkit/**/*.js',
      ''  + config.SRC + '/**/*.js',
      '!' + config.SRC + '/**/_vendor/*.js',
    ],
    dist : config.DIST,
    enabledWatch : config.WATCH_ENABLED,
    options : {
      plumber : options.plumber,
      eslint : {
      },
      diff : { ...options.diff,
        name     : 'js_eslint',
        oneToOne : true,
      },
      src : {
        read : !config.DIFF_ENABLED,
      },
      logStreamData : {
        title       : 'js_eslint',
        subtitle    : 'linted',
        forEachFile : false,
      },
    },
  }
  ,prodConfig = {}
;

export default switchConfig( config.NODE_ENV,  devConfig, prodConfig );
