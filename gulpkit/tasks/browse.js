/**
 * @module tasks/browse
 * @requires node:url
 * @requires browser-sync
 * @requires fancy-log
 * @requires chalk
 * @requires ../utilities/exists.js
 */

import { fileURLToPath } from 'node:url';

import browserSync from 'browser-sync';
import fancyLog    from 'fancy-log';
import chalk       from 'chalk';

import existsFile from '../utilities/exists.js';

export { init_browsing, reload_browsing };

const
  RELATIVE_CONFIG_FILE_PATH = '../config/config_browse.js'
;
const
  CONFIG_FILE_PATH = fileURLToPath( import.meta.resolve( RELATIVE_CONFIG_FILE_PATH ) )
;

/**
 * BrowserSync を初期化する。<br>
 * コンフィグファイルが無い場合（live reload機能が必要のない場合）はCallback のdone を実行してタスクを終了する。
 * @memberof module:tasks/browse
 * @param {Function} done - Gulp タスク完了のコールバック
 * @returns {Promise<void>}
 */
async function init_browsing( done ) {
  try {
    if ( !await existsFile( CONFIG_FILE_PATH ) ) {
      fancyLog( chalk.gray( 'no serve' ) );
      return done();
    }
    const { config, options } = await import( RELATIVE_CONFIG_FILE_PATH );
    if ( config.enabled === false ) {
      fancyLog( chalk.gray( 'no serve' ) );
      return done();
    }
    browserSync.init( options );
    return done();
  } catch ( err ) {
    throw err.stack || err;
  }
}

/**
 * BrowserSync をリロードする。
 * @memberof module:tasks/browse
 * @param {Function} done - Gulp タスク完了のコールバック
 * @returns {undefined}
 */
function reload_browsing( done ) {
  if ( browserSync.active ) {
    browserSync.reload();
  }
  return done?.();
}
