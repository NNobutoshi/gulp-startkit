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
  TASK_NAME = 'css_lint_scss',
  NODE_ENV  = env.NODE_ENV
;
const
  SRC_DIR  = srcDir[ NODE_ENV ],
  DIST_DIR = distDir[ NODE_ENV ]
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:css_lint_scss
 */
const devConfig = {
  src : [
    `${ SRC_DIR }/**/*.scss`,
    `!${ SRC_DIR }/**/css/_sprite_svg.scss`,
    `!${ SRC_DIR }/**/_vendor/*.scss`,
    `!${ SRC_DIR }/**/_templates/*.scss`,
  ],
  dist : DIST_DIR,
};

/**
 * 本番環境用のコンフィグオブジェクト（差分）。
 * 開発環境（devConfig）と異なるプロパティのみを定義。<br>
 * 差分がない場合は null を設定。
 * @memberof module:config
 * @name prodConfig:css_lint_scss
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:css_lint_scss
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name     : TASK_NAME,
    oneToOne : true,
  },
  watch : commonOptions.watch,
  gulpSrc : {
    read : !commonOptions.diff.enabled, // diff build が有効な場合はコンテンツを読み込まない、無効であれば読み込む
  },
  stylelint : {
    formatter : 'string',
  },
  logStreamData : {
    title       : TASK_NAME,
    subtitle    : 'linted',
    forEachFile : false,
  },
};

/**
 * 本番環境用のオプションオブジェクト（差分）。<br>
 * 開発環境（devOptions）と異なるプロパティのみを定義。<br>
 * 差分がない場合は null を設定。
 * @memberof module:config
 * @name prodOptions:css_lint_scss
 */
const prodOptions = null;

// 開発環境用の設定をベースにマージする。
const
  mergedConfig  = mergeByEnv( NODE_ENV, devConfig, prodConfig ),
  mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
