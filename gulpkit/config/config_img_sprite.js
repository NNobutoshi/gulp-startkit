/**
 * @memberof module:config
 * @requires node:process
 * @requires ./common.js
 * @requires ./constants.js
 * @requires ./merge_by_env.js
 */

import { env } from 'node:process';

import { srcDir, distDir, commonOptions } from './common.js';
import { PLACEHOLDER }                    from './constants.js';
import mergeByEnv                         from './merge_by_env.js';

export { mergedConfig as config, mergedOptions as options };

const
  TASK_NAME = 'img_sprite'
  ,GROUP_DIR = 'img/_sprite'
;
const
  NODE_ENV = env.NODE_ENV
;
const
  SRC_DIR   = srcDir[ NODE_ENV ]
  ,DIST_DIR = distDir[ NODE_ENV ]
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:img_sprite
 */
const devConfig = {
  src          : [ `${ SRC_DIR }/**/${ GROUP_DIR }/*.png` ],
  dist         : DIST_DIR,
  base         : SRC_DIR,
  placeholder  : PLACEHOLDER,
  group        : GROUP_DIR, // この命名ルールのディレクトリごとに。
  imgDist      : DIST_DIR + `${ PLACEHOLDER }/img`,
  scssDist     : SRC_DIR  + `${ PLACEHOLDER }/css`,
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
    name    : TASK_NAME,
    enabled : commonOptions.enabledDiff.dev,
    group   : GROUP_DIR,
  },
  sprite : {
    cssName     : '_mixins_sprite.scss',
    imgName     : 'common_pack.png',
    imgPath     : '../img/common_pack.png',
    cssFormat   : 'scss',
    padding     : 10,
    cssTemplate : SRC_DIR + '/css/_templates/_sprite.scss.handlebars',
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
const prodOptions = {
  diff : {
    enabled : commonOptions.enabledDiff.prod,
  },
};

// すべては開発環境用の設定をベースにマージする。
const
  mergedConfig   = mergeByEnv( NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
