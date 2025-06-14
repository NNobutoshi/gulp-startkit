/**
 * @memberof module:config
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

import { commonConfig, commonOptions } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

const
  TASK_NAME = 'css_lint_scss'
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:css_lint_scss
 */
const devConfig = {
  src : [
    ''  + commonConfig.SRC + '/**/*.scss',
    '!' + commonConfig.SRC + '/**/css/_sprite_svg.scss',
    '!' + commonConfig.SRC + '/**/_vendor/*.scss',
    '!' + commonConfig.SRC + '/**/_templates/*.scss',
  ],
  dist : commonConfig.DIST,
  enabledWatch : commonConfig.WATCH_ENABLED,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
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
  gulpSrc : {
    read : !commonConfig.DIFF_ENABLED,
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
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:css_lint_scss
 */
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
