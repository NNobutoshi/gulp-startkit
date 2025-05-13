import { commonConfig, commonOptions } from './common.js';
import switchConfig     from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src : [
    './gulpkit/**/*.js',
    ''  + commonConfig.SRC + '/**/*.js',
    '!' + commonConfig.SRC + '/**/_vendor/*.js',
  ],
  dist : commonConfig.DIST,
  enabledWatch : commonConfig.WATCH_ENABLED,
};
const prodConfig = null;

const devOptions = {
  plumber : commonOptions.plumber,
  eslint : {
  },
  diff : { ...commonOptions.diff,
    name     : 'js_eslint',
    oneToOne : true,
  },
  src : {
    read : !commonConfig.DIFF_ENABLED,
  },
  logStreamData : {
    title       : 'js_eslint',
    subtitle    : 'linted',
    forEachFile : false,
  },
};
const prodOptions = null;

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;

