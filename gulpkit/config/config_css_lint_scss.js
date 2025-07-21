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
import getEnvStatus                       from './get_env_status.js';

export { mergedConfig as config, mergedOptions as options };

const
  TASK_NAME = 'css_lint_scss'
;
const
  NODE_ENV = env.NODE_ENV
;
const
  DIFF_STATUS = getEnvStatus( env.DIFF_ENABLED )
;
const
  SRC_DIR   = srcDir[ NODE_ENV ]
  ,DIST_DIR = distDir[ NODE_ENV ]
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:css_lint_scss
 */
const devConfig = {
  src : [
    ''  + SRC_DIR + '/**/*.scss',
    '!' + SRC_DIR + '/**/css/_sprite_svg.scss',
    '!' + SRC_DIR + '/**/_vendor/*.scss',
    '!' + SRC_DIR + '/**/_templates/*.scss',
  ],
  dist : DIST_DIR,
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
    enabled  : DIFF_STATUS ?? true,
    oneToOne : true,
  },
  gulpSrc : {
    read : !( DIFF_STATUS ?? true ),
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
const prodOptions = {
  diff : {
    enabled : DIFF_STATUS ?? false,
  },
  gulpSrc : {
    read : !( DIFF_STATUS ?? false ),
  }
};

// すべては開発環境用の設定をベースにマージする。
const
  mergedConfig   = mergeByEnv( NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
