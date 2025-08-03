/**
 * @memberof module:config
 * @requires node:process
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

import { env } from 'node:process';

import { srcDir, distDir, commonOptions } from './common.js';
import mergeByEnv                         from './merge_by_env.js';
import getEnvStatus                       from './get_env_status.js';

export { mergedConfig as config, mergedOptions as options };

const
  TASK_NAME = 'copy_to'
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
 * @name devConfig:copy_to
 */
const devConfig = {
  src  : [ `${ SRC_DIR }/**/*.{mp4,webm}` ],
  base : SRC_DIR,
  dist : DIST_DIR,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:copy_to
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:copy_to
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name     : TASK_NAME,
    oneToOne : true,
    enabled  : DIFF_STATUS ?? true,
  },
  gulpSrc : {
    base     : SRC_DIR,
    encoding : false,
    read     : !( DIFF_STATUS ?? true ),
  },
  logStreamData : {
    title       : TASK_NAME,
    subtitle    : 'copied',
    forEachFile : false,
  },
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:copy_to
 */
const prodOptions = {
  diff : {
    enabled : DIFF_STATUS ?? false,
  },
  gulpSrc : {
    read : !( DIFF_STATUS ?? false ),
  },
};

// 開発環境用の設定をベースにマージする。
const
  mergedConfig   = mergeByEnv( NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
