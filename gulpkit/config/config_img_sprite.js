import { config, options } from './common.js';
import switchConfig        from './switch.js';

const
  devConfig = {
    src   : [ config.SRC + '/**/img/_sprite/**/*.png' ],
    dist  : config.DIST,
    base  : config.SRC,
    placeholder : config.PLACEHOLDER,
    group : '/img/_sprite',// この命名ルールのディレクトリ毎に。
    imgDist  : config.DIST + `${ config.PLACEHOLDER }/img`,
    scssDist : config.SRC  + `${ config.PLACEHOLDER }/css`,
    enabledWatch : config.WATCH_ENABLED,
    options : {
      plumber : options.plumber,
      sprite : {
        cssName     : '_mixins_sprite.scss',
        imgName     : 'common_pack.png',
        imgPath     : '../img/common_pack.png',
        cssFormat   : 'scss',
        padding     : 10,
        cssTemplate : config.SRC + '/css/_templates/_sprite.scss.handlebars',
        cssVarMap   : function( sprite ) {
          sprite.name = 'sheet-' + sprite.name;
        },
      },
      diff : { ...options.diff,
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
    },
  }
  ,prodConfig = {}
;

export default switchConfig( config.NODE_ENV,  devConfig, prodConfig );
