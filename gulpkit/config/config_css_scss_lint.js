import { config, options } from './common.js';
import switchConfig     from './switch.js';

const
  devConfig = {
    src : [
      ''  + config.SRC + '/**/*.scss',
      '!' + config.SRC + '/**/css/_sprite_svg.scss',
      '!' + config.SRC + '/**/_vendor/*.scss',
      '!' + config.SRC + '/**/_templates/*.scss',
    ],
    dist : config.DIST,
    enabledWatch : config.WATCH_ENABLED,
    options : {
      plumber : options.plumber,
      stylelint : {
        fix            : false,
        failAfterError : true,
        reporters      : [ { formatter : 'string', console : true } ],
        debug          : true,
      },
      diff : { ...options.diff,
        name     : 'css_scss_lint',
        oneToOne : true,
      },
      src : {
        read : !config.DIFF_ENABLED,
      },
      logStreamData : {
        title       : 'css_scss_lint',
        subtitle   : 'linted',
        forEachFile : false,
      },
    },
  }
  ,prodConfig = {}
;

export default switchConfig( config.NODE_ENV,  devConfig, prodConfig );
