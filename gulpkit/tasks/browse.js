/**
 * @module tasks/browse
 * @requires node:url
 * @requires browser-sync
 * @requires ../utilities/exists.js
 */

import { fileURLToPath } from 'node:url';

import browserSync from 'browser-sync';

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
 * @returns {Promise<void>}
 */
async function init_browsing() {
  try {
    if ( !await existsFile( CONFIG_FILE_PATH ) ) {
      return;
    }
    const
      { config, options } = await import( RELATIVE_CONFIG_FILE_PATH )
    ;
    if ( config.enabled === false ) {
      return;
    }
    browserSync.init( options );
    return;
  } catch ( err ) {
    throw err.stack || err;
  }
}

/**
 * BrowserSync をリロードする。
 * @memberof module:tasks/browse
 * @returns {undefined}
 */
function reload_browsing() {
  if ( browserSync.active ) {
    browserSync.reload();
  }
}
