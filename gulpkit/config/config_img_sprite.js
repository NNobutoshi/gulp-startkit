import { commonConfig, commonOptions } from './common.js';
import mergeConfForEnv from './merge_conf.js';

export { mergedConf as config, mergedOptions as options };

// 開発環境用。
const devConfig = {
  src          : [ commonConfig.SRC + '/**/img/_sprite/**/*.png' ],
  dist         : commonConfig.DIST,
  base         : commonConfig.SRC,
  placeholder  : commonConfig.PLACEHOLDER,
  group        : '/img/_sprite',// この命名ルールのディレクトリ毎に。
  imgDist      : commonConfig.DIST + `${ commonConfig.PLACEHOLDER }/img`,
  scssDist     : commonConfig.SRC  + `${ commonConfig.PLACEHOLDER }/css`,
  enabledWatch : commonConfig.WATCH_ENABLED,
};
// 本番環境用。
// 開発環境と異なる設定を行う場合に、
// その異なるプロパティ部分だけの同一構造のオブジェクトを代入。
// 同一設定の場合はnull を明示的に代入。
const prodConfig = null;

// devConf に同じ。
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

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeConfForEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeConfForEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
