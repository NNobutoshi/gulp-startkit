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
import { DIR_SOURCEMAPS }                 from './constants.js';
import mergeByEnv                         from './merge_by_env.js';

import autoprefixer from 'autoprefixer';
import mqpacker     from '@hail2u/css-mqpacker';

export { mergedConfig as config, mergedOptions as options };

const
  TASK_NAME = 'css_sass',
  NODE_ENV  = env.NODE_ENV
;
const
  SRC_DIR  = srcDir[ NODE_ENV ],
  DIST_DIR = distDir[ NODE_ENV ]
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:css_sass
 */
const devConfig = {
  src  : [ `${ SRC_DIR }/**/*.scss` ],
  dist : DIST_DIR,
  base : SRC_DIR,
};

/**
 * 本番環境用のコンフィグオブジェクト（差分）。<br>
 * 開発環境（devConfig）と異なるプロパティのみを定義。<br>
 * 差分がない場合は null を設定。
 * @memberof module:config
 * @name prodConfig:css_sass
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:css_sass
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name : TASK_NAME,
  },
  watch : commonOptions.watch,
  sass : {
    outputStyle : 'expanded', // nested, compact, compressed, expanded
    linefeed    : 'lf',       // 'crlf', 'lf'
    indentType  : 'space',    // 'space', 'tab'
    indentWidth : 2,
    silenceDeprecations : [ 'legacy-js-api' ], // Dart Sass 2.0.0 までの間
  },
  postcss : {
    plugins : [
      autoprefixer(),
      mqpacker(),
    ]
  },
  logStreamData : {
    scss : {
      title    : TASK_NAME,
      subtitle : 'compiled',
    },
    sourceMaps : {
      title       : `${ TASK_NAME }:map`,
      subtitle    : 'created',
      forEachFile : false,
    },
  },
  sourcemaps : {
    enabled : true,
    dir     : '/' + DIR_SOURCEMAPS,
  },
};

/**
 * 本番環境用のオプションオブジェクト（差分）。<br>
 * 開発環境（devOptions）と異なるプロパティのみを定義。<br>
 * 差分がない場合は null を設定。
 * @memberof module:config
 * @name prodOptions:css_sass
 */
const prodOptions = {
  sass : {
    outputStyle : 'compressed', // nested, compact, compressed, expanded
  },
  sourcemaps : {
    enabled : false,
  },
};

// 開発環境用の設定をベースにマージする。
const
  mergedConfig  = mergeByEnv( NODE_ENV, devConfig, prodConfig ),
  mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
