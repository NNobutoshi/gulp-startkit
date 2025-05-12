import { config, options } from './common.js';
import switchConfig        from './switch.js';

const
  devConfig = {
    src  : [ config.SRC + '/**/*.{mp4,webm}' ],
    base : config.SRC,
    dist : config.DIST,
    enabledWatch : config.WATCH_ENABLED,
    options : {
      plumber : options.plumber,
      diff : { ...options.diff,
        name     : 'copy_to',
        oneToOne : true,
      },
      src : {
        base     : config.SRC,
        encoding : false,
        read     : !config.DIFF_ENABLED,
      },
      logStreamData : {
        title       : 'copy_to',
        subtitle    : 'copied',
        forEachFile : false,
      },
    },
  }
  ,prodConfig = {}
;

export default switchConfig( config.NODE_ENV, devConfig, prodConfig );
