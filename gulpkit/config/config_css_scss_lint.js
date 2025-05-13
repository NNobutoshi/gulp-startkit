import { commonConfig, commonOptions } from './common.js';
import switchConfig     from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src : [
    ''  + commonConfig.SRC + '/**/*.scss',
    '!' + commonConfig.SRC + '/**/css/_sprite_svg.scss',
    '!' + commonConfig.SRC + '/**/_vendor/*.scss',
    '!' + commonConfig.SRC + '/**/_templates/*.scss',
  ],
  dist : commonConfig.DIST,
  enabledWatch : commonConfig.WATCH_ENABLED,
  options : {
  },
};
const prodConfig = null;

const devOptions = {
  plumber : commonOptions.plumber,
  stylelint : {
    fix            : false,
    failAfterError : true,
    reporters      : [ { formatter : 'string', console : true } ],
    debug          : true,
  },
  diff : { ...commonOptions.diff,
    name     : 'css_scss_lint',
    oneToOne : true,
  },
  src : {
    read : !commonConfig.DIFF_ENABLED,
  },
  logStreamData : {
    title       : 'css_scss_lint',
    subtitle   : 'linted',
    forEachFile : false,
  },
};
const prodOptions = null;

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;
