/**
 * @memberof module:config
 * @requires node:process
 * @requires ./common.js
 * @requires ./constants.js
 * @requires ./merge_by_env.js
 */

import { env } from 'node:process';

import { commonConfig, commonOptions } from './common.js';
import { SOURCEMAPS_DIR }              from './constants.js';
import mergeByEnv                      from './merge_by_env.js';

import autoprefixer from 'autoprefixer';
import mqpacker     from '@hail2u/css-mqpacker';

export { mergedConf as config, mergedOptions as options };

const
  TASK_NAME = 'css_sass'
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:css_sass
 */
const devConfig = {
  src  : [ commonConfig.SRC + '/**/*.scss' ],
  dist : commonConfig.DIST,
  base : commonConfig.SRC,
  enabledSourcemaps : true,
  sourcemaps_dir    : '/' + SOURCEMAPS_DIR,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:css_sass
 */
const prodConfig = {
  enabledSourcemaps : false,
};

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
  sass : {
    outputStyle : 'expanded', // nested, compact, compressed, expanded
    linefeed    : 'lf', // 'crlf', 'lf'
    indentType  : 'space', // 'space', 'tab'
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
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:css_sass
 */
const prodOptions = {
  sass : {
    outputStyle : 'compressed', // nested, compact, compressed, expanded
  },
};

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( env.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( env.NODE_ENV, devOptions, prodOptions )
;
