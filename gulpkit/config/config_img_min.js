import { commonConfig, commonOptions } from './common.js';
import switchConfig        from './switch.js';

export { switchedConf as config, switchedOptions as options };

const
  devConfig = {
    src : [
      ''  + commonConfig.SRC + '/**/*.{png,jpg,svg}',
      '!' + commonConfig.SRC + '/**/_sprite*/*.{png,svg}',
      '!' + commonConfig.SRC + '/**/fonts/icons/*.svg',
    ],
    dist : commonConfig.DIST,
    enabledWatch : commonConfig.WATCH_ENABLED,
    options : {
    },
  };
const prodConfig = null;

const devOptions = {
  plumber : commonOptions.plumber,
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
  diff : { ...commonOptions.diff,
    name     : 'img_min',
    oneToOne : true,
  },
  src : {
    base     : commonConfig.SRC,
    encoding : false,
    read     : !commonConfig.DIFF_ENABLED,
  },
};
const prodOptions = null;

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;
