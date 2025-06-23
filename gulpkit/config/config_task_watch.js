/**
 * @module config
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

import { commonConfig } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config_task_watch
 */
const devConfig = {
  watchInitEventName    : commonConfig.EVENT_NAME_WATCH_INIT,
  watchWaitingEventName : commonConfig.EVENT_NAME_WATCH_WAITING,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:task_watch
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:task_watch
 */
const devOptions = {
  runChainedTasksDelayTime : 100,
  gulpWatch : {
    usePolling : true,
  },
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:task_watch
 */
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
