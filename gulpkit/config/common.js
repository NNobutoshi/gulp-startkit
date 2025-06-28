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
  EVENT_NAME_WATCH_INIT,
  EVENT_NAME_WATCH_WAITING,
} from './constants.js';

const
  NODE_ENV       = env.NODE_ENV
  ,DIFF_ENV      = env.DIFF_ENV
  ,DIFF_REFS_ENV = env.DIFF_REFS_ENV
;
const
  IS_PRODUCTION   = ( NODE_ENV === PROD_ENV_NAME )
  ,IS_DEVELOPMENT = ( NODE_ENV === DEV_ENV_NAME )
;
const
  src_dir  = {
    [ PROD_ENV_NAME ] : 'src',
    [ DEV_ENV_NAME ]  : 'src',
  },
  dist_dir = {
    [ PROD_ENV_NAME ] : 'dist/production/html',
    [ DEV_ENV_NAME ]  : 'dist/development/html',
  }
;
const
  DIFF_REFS_ENABLED = !!Number( DIFF_REFS_ENV )
;

/**
 * 各タスクで共通の設定は環境変数に応じてタスク個別の設定に先んじて切り替えを行う。<br>
 * ソースマップ、差分ビルド、watch などの有効の有無等。
 * @memberof module:config
 * @name commonConfig
 */
export const commonConfig = {
  SRC  : src_dir[ NODE_ENV ],
  DIST : dist_dir[ NODE_ENV ],
};

/**
 * ブランチ間やコミット間の差分をビルド対象とするか否かでコマンドを別ける。<br>
 * <ref1> と<ref2> はプレースホルダーで、コマンドラインの引数でされたブランチ名やコミットハッシュで置換される。<br>
 * コミット前の作業差分は未追跡のファイルを検知さる為に、Git status を使用。
 * @memberof module:config
 * @name GIT_COMMAND
 */
const GIT_COMMAND = ( DIFF_REFS_ENABLED )
  ? `git diff --name-status <ref1> <ref2> gulpkit/ ${ commonConfig.SRC }/`
  : `git status -suall gulpkit/ ${ commonConfig.SRC }/`
;

/**
 * 各タスクで共通して使用するプラグイン等のオプション用。
 * @memberof module:config
 * @name commonOptions
 */
export const commonOptions = {
  diff : {
    command     : GIT_COMMAND,
    // 差分ビルド専用の環境変数を優先し、次にNODE_ENV に応じて有効の有無を決める。
    enabled     : ( DIFF_ENV ) ? !!Number( DIFF_ENV ) : IS_DEVELOPMENT || !IS_PRODUCTION,
    enabledRefs : DIFF_REFS_ENABLED,
    firstTasksEndedEventName : EVENT_NAME_WATCH_INIT,
    tasksEndedEventName      : EVENT_NAME_WATCH_WAITING,
  },
  plumber : {
    errorHandler : function( err ) {
      fancyLog.error( chalk.hex( '#FF0000' )( err.stack ) );
      this.emit( 'end' );
    },
  }
};
