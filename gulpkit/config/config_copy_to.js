import { commonConfig, commonOptions } from './common.js';
import switchConfig from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src  : [ commonConfig.SRC + '/**/*.{mp4,webm}' ],
  base : commonConfig.SRC,
  dist : commonConfig.DIST,
  enabledWatch : commonConfig.WATCH_ENABLED,
};
const prodConfig = null;
const devOptionts = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name     : 'copy_to',
    oneToOne : true,
  },
  src : {
    base     : commonConfig.SRC,
    encoding : false,
    read     : !commonConfig.DIFF_ENABLED,
  },
  logStreamData : {
    title       : 'copy_to',
    subtitle    : 'copied',
    forEachFile : false,
  },
};
const prodOptions = null;
const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptionts,prodOptions )
;

