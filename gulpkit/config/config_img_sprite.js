import { commonConfig, commonOptions } from './common.js';
import switchConfig from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src   : [ commonConfig.SRC + '/**/img/_sprite/**/*.png' ],
  dist  : commonConfig.DIST,
  base  : commonConfig.SRC,
  placeholder : commonConfig.PLACEHOLDER,
  group : '/img/_sprite',// この命名ルールのディレクトリ毎に。
  imgDist  : commonConfig.DIST + `${ commonConfig.PLACEHOLDER }/img`,
  scssDist : commonConfig.SRC  + `${ commonConfig.PLACEHOLDER }/css`,
  enabledWatch : commonConfig.WATCH_ENABLED,
  options : {
  },
}
;
const prodConfig = null;

const devOptions = {
  plumber : commonOptions.plumber,
  sprite : {
    cssName     : '_mixins_sprite.scss',
    imgName     : 'common_pack.png',
    imgPath     : '../img/common_pack.png',
    cssFormat   : 'scss',
    padding     : 10,
    cssTemplate : commonConfig.SRC + '/css/_templates/_sprite.scss.handlebars',
    cssVarMap   : function( sprite ) {
      sprite.name = 'sheet-' + sprite.name;
    },
  },
  diff : { ...commonOptions.diff,
    name  : 'img_sprite',
    group : '/img/_sprite',
  },
  logStreamData : {
    png :  {
      title       : 'img_sprite:png',
      subtitle    : 'created',
      forEachFile : false,
    },
    scss : {
      title       : 'img_sprite:scss',
      subtitle    : 'generated',
      forEachFile : false,
    },
  },
};
const prodOptions = null;

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;
