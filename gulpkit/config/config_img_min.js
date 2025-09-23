/**
 * @memberof module:config
 * @requires node:process
 * @requires ./common.js
 * @requires ./merge_by_env.js
 * @requires ./get_env_status.js
 */

import { env } from 'node:process';

import { srcDir, distDir, commonOptions } from './common.js';
import mergeByEnv                         from './merge_by_env.js';

export { mergedConfig as config, mergedOptions as options };

const
  TASK_NAME = 'img_min'
  ,NODE_ENV = env.NODE_ENV
;
const
  SRC_DIR   = srcDir[ NODE_ENV ]
  ,DIST_DIR = distDir[ NODE_ENV ]
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:img_min
 */
const devConfig = {
  src : [
    `${ SRC_DIR }/**/*.{png,jpg,svg}`,
    `!${ SRC_DIR }/**/_sprite*/*.{png,svg}`,
    `!${ SRC_DIR }/**/fonts/icons/*.svg`,
  ],
  dist : DIST_DIR,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:img_min
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:img_min
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name     : TASK_NAME,
    oneToOne : true,
  },
  watch : commonOptions.watch,
  gulpSrc : {
    base     : SRC_DIR,
    encoding : false,
    read     : !commonOptions.diff.enabled, // diff build が有効な場合はコンテンツを読み込まない、無効であれば読み込む
  },
  imageminMozjpeg : {
    quality : 90,
  },
  imageminPngquant : {
    quality : [ 0.8, 0.9 ],
  },
  svgo : {
    plugins : [
      {
        name   : 'removeViewBox',
        active : true,
      },
      {
        name   : 'cleanupIDs',
        active : false,
      },
    ],
  },
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:img_min
 */
const prodOptions = null;

// 開発環境用の設定をベースにマージする。
const
  mergedConfig   = mergeByEnv( NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
