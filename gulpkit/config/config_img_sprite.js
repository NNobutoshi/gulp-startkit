/**
 * @module config
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

import { commonConfig, commonOptions } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

const
  TASK_NAME = 'img_sprite'
  ,GROUP_DIR = '/img/_sprite'
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:img_sprite
 */
const devConfig = {
  src          : [ commonConfig.SRC + '/**/img/_sprite/**/*.png' ],
  dist         : commonConfig.DIST,
  base         : commonConfig.SRC,
  placeholder  : commonConfig.PLACEHOLDER,
  group        : GROUP_DIR, // この命名ルールのディレクトリごとに。
  imgDist      : commonConfig.DIST + `${ commonConfig.PLACEHOLDER }/img`,
  scssDist     : commonConfig.SRC  + `${ commonConfig.PLACEHOLDER }/css`,
  enabledWatch : commonConfig.WATCH_ENABLED,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
  * @memberof module:config
  * @name prodConfig:img_sprite
  */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:img_sprite
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name  : TASK_NAME,
    group : GROUP_DIR,
  },
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
  logStreamData : {
    png :  {
      title       : `${ TASK_NAME }:png`,
      subtitle    : 'created',
      forEachFile : false,
    },
    scss : {
      title       : `${ TASK_NAME }:scss`,
      subtitle    : 'generated',
      forEachFile : false,
    },
  },
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:img_sprite
 */
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
