import fancyLog from 'fancy-log';
import chalk    from 'chalk';

const
  NODE_ENV        = process.env.NODE_ENV
  ,WATCH_ENV      = process.env.WATCH_ENV
  ,DIFF_ENV       = process.env.DIFF_ENV
  ,DIFF_REFS_ENV  = process.env.DIFF_REFS_ENV
  ,IS_PRODUCTION  = ( NODE_ENV === 'production' )
  ,IS_DEVELOPMENT = ( NODE_ENV === 'development' )
  ,IS_DIFF_REFS   = !!Number( DIFF_REFS_ENV )
;
const
  DIR_SRC =  {
    'production'  : 'src',
    'development' : 'src',
  },
  DIR_DIST = {
    'production'  : 'dist/production/html',
    'development' : 'dist/development/html',
  }
;

/**
 * 各タスクで共通の設定は環境変数に応じて各タスクの設定に先んじて、
 * 切り替えを行う。
 * ソースマップ、差分ビルド、watch などの有効の有無等。
 */
export const commonConfig = {
  NODE_ENV : NODE_ENV,
  SRC  : DIR_SRC[ NODE_ENV ],
  DIST : DIR_DIST[ NODE_ENV ],
  SOURCEMAPS_ENABLED : IS_DEVELOPMENT || !IS_PRODUCTION,
  // WATCH 専用の環境変数を優先し、続いてNODE_ENV に応じて有効の有無を決める。
  WATCH_ENABLED : ( WATCH_ENV ) ? !!Number( WATCH_ENV ) : IS_DEVELOPMENT || !IS_PRODUCTION,
  // 差分ビルド専用の環境変数を優先し、続いてNODE_ENV に応じて有効の有無を決める。
  DIFF_ENABLED  : ( DIFF_ENV )  ? !!Number( DIFF_ENV )  : IS_DEVELOPMENT || !IS_PRODUCTION,
  SOURCEMAPS_DIR : 'sourcemaps',
  PLACEHOLDER : '[subdir]',
  EVENT_NAME_WATCH_INIT  : 'watchInit',
  EVENT_NAME_WATCH_START : 'watchStart',
};

const GIT_COMMAND = ( IS_DIFF_REFS )
  ? `git diff --name-status <ref1> <ref2> gulpkit/ ${ commonConfig.SRC }/`
  : `git status -suall gulpkit/ ${ commonConfig.SRC }/`
;

/**
 * 各タスクで共通して使用するプラグイン等の共通オプション用。
 */
export const commonOptions = {
  diff : {
    command     : GIT_COMMAND,
    enabled     : commonConfig.DIFF_ENABLED,
    enabledRefs : IS_DIFF_REFS,
    firstTasksEndedEventName : commonConfig.EVENT_NAME_WATCH_INIT,
    tasksEndedEventName      : commonConfig.EVENT_NAME_WATCH_START,
  },
  plumber : {
    errorHandler : function( err ) {
      fancyLog.error( chalk.hex( '#FF0000' )( err.stack ) );
      this.emit( 'end' );
    },
  }
};
