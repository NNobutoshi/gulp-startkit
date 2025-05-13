import { commonConfig, commonOptions } from './common.js';
import switchConfig from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src         : [ commonConfig.SRC + '/**/fonts/icons/*.svg' ],
  base        : commonConfig.SRC,
  dist        : commonConfig.DIST,
  placeholder : commonConfig.PLACEHOLDER,
  fontsDist   : commonConfig.DIST + `${ commonConfig.PLACEHOLDER }/fonts`,
  scssDist    : commonConfig.SRC  + `${ commonConfig.PLACEHOLDER }/css`,
  group        : '/fonts/icons',// この命名ルールのディレクトリ毎に。
  fontPath     : '../fonts/',
  scssFileName : '_icons.scss',
  cssClass     : 'icon',
  templatePath : commonConfig.SRC + '/css/_templates/_icons.scss.handlebars',
  enabledWatch : commonConfig.WATCH_ENABLED,
  options : {
  },
};
const prodConfig = null;

const devOptions = {
  iconfont : {
    fontName       : `icons${ commonConfig.PLACEHOLDER }`,
    prependUnicode : false,
    formats        : [ 'ttf', 'eot', 'woff', 'woff2' ],
    normalize      : true,
    fontHeight     : 1001,
    startUnicode   : 0xF001,
  },
  svgLint : {
  },
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name  : 'icon_font',
    group : '/fonts/icons',
  },
  logStreamData : {
    iconFont :  {
      title       : 'icon_font',
      subtitle    : 'created',
    },
    scss : {
      title       : 'icon_font:scss',
      subtitle    : 'generated',
      forEachFile : false,
      onStream    : false,
    },
  },

};
const prodOptions = null;

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;
