/**
 * @memberof module:config
 * @requires node:process
 * @requires ./common.js
 * @requires ./constants.js
 * @requires ./merge_by_env.js
 * @requires ./get_env_status.js
 */

import { env } from 'node:process';

import { srcDir, distDir, commonOptions } from './common.js';
import { PLACEHOLDER_SUBDIR }             from './constants.js';
import mergeByEnv                         from './merge_by_env.js';

export { mergedConfig as config, mergedOptions as options };

const
  TASK_NAME = 'img_sprite',
  GROUP_DIR = 'img/_sprite',
  NODE_ENV  = env.NODE_ENV
;
const
  SRC_DIR  = srcDir[ NODE_ENV ],
  DIST_DIR = distDir[ NODE_ENV ]
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
  placeholder  : PLACEHOLDER_SUBDIR,
  group        : GROUP_DIR, // この命名ルールのディレクトリごとに。
  imgDist      : `${ DIST_DIR }${ PLACEHOLDER_SUBDIR }/img`,
  scssDist     : `${ SRC_DIR  }${ PLACEHOLDER_SUBDIR }/css`,
};

/**
 * 本番環境用のコンフィグオブジェクト（差分）。<br>
 * 開発環境（devConfig）と異なるプロパティのみを定義。<br>
 * 差分がない場合は null を設定。
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
    group   : GROUP_DIR,
  },
  watch : commonOptions.watch,
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
 * 本番環境用のオプションオブジェクト（差分）。<br>
 * 開発環境（devOptions）と異なるプロパティのみを定義。<br>
 * 差分がない場合は null を設定。
 * @memberof module:config
 * @name prodOptions:img_sprite
 */
const prodOptions = null;

// 開発環境用の設定をベースにマージする。
const
  mergedConfig  = mergeByEnv( NODE_ENV, devConfig, prodConfig ),
  mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
