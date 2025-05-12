import { config, options } from './common.js';
import switchConfig        from './switch.js';

const
  devConfig = {
    src : [
      ''  + config.SRC + '/**/*.{png,jpg,svg}',
      '!' + config.SRC + '/**/_sprite*/*.{png,svg}',
      '!' + config.SRC + '/**/fonts/icons/*.svg',
    ],
    dist : config.DIST,
    enabledWatch : config.WATCH_ENABLED,
    options : {
      plumber : options.plumber,
      imageminMozjpeg : {
        quality : 90,
      },
      imageminPngquant : {
        quality : [ 0.8, 0.9 ],
      },
      svgo : {
        plugins : [
          {
            name   : 'removeViewBox',
            active : true,
          },
          {
            name   : 'cleanupIDs',
            active : false,
          },
        ],
      },
      diff : { ...options.diff,
        name     : 'img_min',
        oneToOne : true,
      },
      src : {
        base     : config.SRC,
        encoding : false,
        read     : !config.DIFF_ENABLED,
      },
    },
  }
  ,prodConfig = {}
;

export default switchConfig( config.NODE_ENV, devConfig, prodConfig );
