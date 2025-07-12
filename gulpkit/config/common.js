/**
 * @module config
 * @requires node:process
 * @requires fancy-log
 * @requires chalk
 * @requires ./constants.js
 */

import { env } from 'node:process';

import fancyLog from 'fancy-log';
import chalk    from 'chalk';

import {
  PROD_ENV_NAME,
  DEV_ENV_NAME,
  WATCH_INIT_EVENT_NAME,
  WATCH_START_EVENT_NAME,
} from './constants.js';

const
  NODE_ENV      = env.NODE_ENV
  ,DIFF_ENABLED = env.DIFF_ENABLED
;
const
  DIFF_REFS_ENABLED = !!Number( env.DIFF_REFS_ENABLED )
;

/**
 * ソースディレクトリを環境変数に応じて切り替える。
 * @memberof module:config
 * @name srcDir
 */
export const srcDir  = {
  [ PROD_ENV_NAME ] : 'src',
  [ DEV_ENV_NAME ]  : 'src',
};

/**
 * 書き出し先ディレクトリを環境変数に応じて切り替える。
 * @memberof module:config
 * @name distDir
 */
export const distDir = {
  [ PROD_ENV_NAME ] : 'dist/production/html',
  [ DEV_ENV_NAME ]  : 'dist/development/html',
};

/**
 * ブランチ間やコミット間の差分をビルド対象とするか否かでコマンドを別ける。<br>
 * &lt;ref1&gt; と&lt;ref2&gt; はプレイスホルダーで、コマンドラインの引数でされたブランチ名やコミットハッシュで置換される。<br>
 * コミット前の作業差分は未追跡のファイルを検知さる為に、Git status を使用。
 * @memberof module:config
 * @name GIT_COMMAND
 */
const GIT_COMMAND = ( DIFF_REFS_ENABLED )
  ? `git diff --name-status <ref1> <ref2> gulpkit/ ${ srcDir[ NODE_ENV ] }/`
  : `git status -suall gulpkit/ ${ srcDir[ NODE_ENV ] }/`
;

/**
 * 各タスクで共通して使用するプラグイン等のオプション用。
 * @memberof module:config
 * @name commonOptions
 */
export const commonOptions = {
  isDiffEnabled : {
    // 差分ビルド専用の環境変数を優先し、次にNODE_ENV に応じて有効の有無を決める。
    dev  : ( DIFF_ENABLED ) ? !!Number( DIFF_ENABLED ) : true,
    prod : ( DIFF_ENABLED ) ? !!Number( DIFF_ENABLED ) : false,
  },
  diff : {
    command     : GIT_COMMAND,
    isRefsEnabled : DIFF_REFS_ENABLED,
    firstTasksEndedEventName : WATCH_INIT_EVENT_NAME,
    tasksEndedEventName      : WATCH_START_EVENT_NAME,
  },
  plumber : {
    errorHandler : function( err ) {
      fancyLog.error( chalk.hex( '#FF0000' )( err.stack ) );
      this.emit( 'end' );
    },
  }
};
