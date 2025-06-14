/**
 * @memberof module:config
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

import { commonConfig, commonOptions } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

const
  TASK_NAME = 'copy_to'
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:config_copy_to
 */
const devConfig = {
  src  : [ commonConfig.SRC + '/**/*.{mp4,webm}' ],
  base : commonConfig.SRC,
  dist : commonConfig.DIST,
  enabledWatch : commonConfig.WATCH_ENABLED,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:config_copy_to
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
  },
  gulpSrc : {
    base     : commonConfig.SRC,
    encoding : false,
    read     : !commonConfig.DIFF_ENABLED,
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
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;

