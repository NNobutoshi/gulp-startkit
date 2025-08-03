/**
 * @memberof module:config
 * @requires ./common.js
 * @requires ./constants.js
 * @requires ./merge_by_env.js
 * @requires ./get_env_status.js
 */

import { env } from 'node:process';

import { WATCH_INIT_EVENT_NAME, WATCH_START_EVENT_NAME } from './constants.js';
import mergeByEnv                                        from './merge_by_env.js';
import getEnvStatus                                      from './get_env_status.js';

export { mergedConf as config, mergedOptions as options };

const
  WATCH_STATUS = getEnvStatus( env.WATCH_ENABLED )
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config_task_watch
 */
const devConfig = {
  watchInitEventName  : WATCH_INIT_EVENT_NAME,
  watchStartEventName : WATCH_START_EVENT_NAME,
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
  //開発環境では、環境変数でWATCH_ENABLED が設定されていればその値を、なければtrue に。
  enabled : WATCH_STATUS ?? true,
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
const prodOptions = {
  //本番環境では、環境変数でWATCH_ENABLED が設定されていればその値を、なければfalse に。
  enabled : WATCH_STATUS ?? false,
};

// 開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( env.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( env.NODE_ENV, devOptions, prodOptions )
;
