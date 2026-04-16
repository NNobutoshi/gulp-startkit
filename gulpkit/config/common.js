/**
 * @module config
 * @requires node:process
 * @requires fancy-log
 * @requires chalk
 * @requires ./constants.js
 * @requires ./get_env_status.js
 */

import { env } from 'node:process';

import fancyLog from 'fancy-log';
import chalk    from 'chalk';

import {
  NODE_ENV_PROD, EVENT_START_WATCHING,
  NODE_ENV_DEV,  EVENT_RAN_WATCHED_TASKE,
} from './constants.js';

import getEnvStatus from './get_env_status.js';

const
  NODE_ENV = env.NODE_ENV,
  IS_DIFF_ENABLED      = getEnvStatus( env.ENABLE_DIFF ),
  IS_DIFF_REFS_ENABLED = getEnvStatus( env.ENABLE_DIFF_REFS ),
  IS_WATCH_ENABLED     = getEnvStatus( env.ENABLE_WATCH )
;
const
  ERROR_COLOR = '#FF0000'
;

/**
 * ソースディレクトリを環境変数に応じて切り替える。
 * @memberof module:config
 * @name srcDir
 */
export const srcDir  = {
  [ NODE_ENV_PROD ] : 'src',
  [ NODE_ENV_DEV ]  : 'src',
};

/**
 * 書き出し先ディレクトリを環境変数に応じて切り替える。
 * @memberof module:config
 * @name distDir
 */
export const distDir = {
  [ NODE_ENV_PROD ] : 'dist/production/html',
  [ NODE_ENV_DEV ]  : 'dist/development/html',
};

/**
 * ブランチ間やコミット間の差分をビルド対象とするか否かでコマンドを切り替える。<br>
 * &lt;ref1&gt; と&lt;ref2&gt; はプレイスホルダーで、コマンドラインの引数で渡されたブランチ名やコミットハッシュで置換される。<br>
 * コミット前の作業差分は未追跡のファイルを検知さる為に、Git status を使用。
 * @memberof module:config
 * @name GIT_COMMAND
 */
const GIT_COMMAND = ( IS_DIFF_REFS_ENABLED )
  ? `git diff --name-status <ref1> <ref2> gulpkit/ ${ srcDir[ NODE_ENV ] }/`
  : `git status -suall gulpkit/ ${ srcDir[ NODE_ENV ] }/`
;

/**
 * 各タスクで共通して使用するプラグイン等のオプション用。
 * @memberof module:config
 * @name commonOptions
 */
export const commonOptions = {
  diff : {
    command : GIT_COMMAND,
    enabled       : IS_DIFF_ENABLED,
    isRefsEnabled : IS_DIFF_REFS_ENABLED,
    eventFinishFirstTasks : EVENT_START_WATCHING,
    eventRanWatchedTask   : EVENT_RAN_WATCHED_TASKE,
  },
  watch : {
    enabled : IS_WATCH_ENABLED,
    ranTaskEventName : EVENT_RAN_WATCHED_TASKE,
    runTasksDelayTime : 200,
  },
  plumber : {
    errorHandler : function( err ) {
      fancyLog.error( chalk.hex( ERROR_COLOR )( err.stack ) );
      this.emit( 'end' );
    },
  },
};
