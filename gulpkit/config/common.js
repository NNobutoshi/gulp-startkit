/**
 * @module config
 * @requires node:process
 * @requires fancy-log
 * @requires chalk
 * @requires ./env_type.js
 */

import { env } from 'node:process';

import fancyLog from 'fancy-log';
import chalk    from 'chalk';

import { PRODUCTION_ENV, DEVELOPMENT_ENV } from './env_type.js';


const
  NODE_ENV        = env.NODE_ENV
  ,WATCH_ENV      = env.WATCH_ENV
  ,DIFF_ENV       = env.DIFF_ENV
  ,DIFF_REFS_ENV  = env.DIFF_REFS_ENV
  ,IS_PRODUCTION  = ( NODE_ENV === PRODUCTION_ENV )
  ,IS_DEVELOPMENT = ( NODE_ENV === DEVELOPMENT_ENV )
  ,IS_DIFF_REFS   = !!Number( DIFF_REFS_ENV )
;
const
  src_dir  = {
    [ PRODUCTION_ENV ]  : 'src',
    [ DEVELOPMENT_ENV ] : 'src',
  },
  dist_dir = {
    [ PRODUCTION_ENV ]  : 'dist/production/html',
    [ DEVELOPMENT_ENV ] : 'dist/development/html',
  }
;

/**
 * 各タスクで共通の設定は環境変数に応じてタスク個別の設定に先んじて切り替えを行う。<br>
 * ソースマップ、差分ビルド、watch などの有効の有無等。
 * @memberof module:config
 * @name commonConfig
 */
export const commonConfig = {
  NODE_ENV : NODE_ENV,
  SRC  : src_dir[ NODE_ENV ],
  DIST : dist_dir[ NODE_ENV ],
  IS_PRODUCTION  : IS_PRODUCTION,
  IS_DEVELOPMENT : IS_DEVELOPMENT,
  SOURCEMAPS_ENABLED : IS_DEVELOPMENT || !IS_PRODUCTION,
  // WATCH 専用の環境変数を優先し、次にNODE_ENV に応じて有効の有無を決める。
  WATCH_ENABLED : ( WATCH_ENV ) ? !!Number( WATCH_ENV ) : IS_DEVELOPMENT || !IS_PRODUCTION,
  // 差分ビルド専用の環境変数を優先し、次にNODE_ENV に応じて有効の有無を決める。
  DIFF_ENABLED  : ( DIFF_ENV )  ? !!Number( DIFF_ENV )  : IS_DEVELOPMENT || !IS_PRODUCTION,
  SOURCEMAPS_DIR : 'sourcemaps',
  PLACEHOLDER : '[subdir]',
  EVENT_NAME_WATCH_INIT    : 'watchInit',
  EVENT_NAME_WATCH_WAITING : 'watchWaiting',
};

/**
 * ブランチ間やコミット間の差分をビルド対象とするか否かでコマンドを別ける。<br>
 * コミット前の作業差分は未追跡のファイルを検知さる為に、Git status を使用。
 * @memberof module:config
 * @name GIT_COMMAND
 */
const GIT_COMMAND = ( IS_DIFF_REFS )
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
    enabled     : commonConfig.DIFF_ENABLED,
    enabledRefs : IS_DIFF_REFS,
    firstTasksEndedEventName : commonConfig.EVENT_NAME_WATCH_INIT,
    tasksEndedEventName      : commonConfig.EVENT_NAME_WATCH_WAITING,
  },
  plumber : {
    errorHandler : function( err ) {
      fancyLog.error( chalk.hex( '#FF0000' )( err.stack ) );
      this.emit( 'end' );
    },
  }
};
