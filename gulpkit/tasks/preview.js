/**
 * @module tasks/preview
 * @requires node:url
 * @requires browser-sync
 * @requires ../utilities/exists.js
 * @requires ../config/config/config_preview.js
 */

import { fileURLToPath } from 'node:url';

import browserSync from 'browser-sync';

import existsFile from '../utilities/exists.js';

export { init_preview, reload_preview };

const
  RELATIVE_CONFIG_FILE_PATH = '../config/config_preview.js'
;
const
  CONFIG_FILE_PATH = fileURLToPath( import.meta.resolve( RELATIVE_CONFIG_FILE_PATH ) )
;

/**
 * BrowserSync を初期化する。<br>
 * コンフィグファイルが無い場合（live reload 機能が必要のない場合）は何もしない。
 * @memberof module:tasks/preview
 * @returns {Promise<void>}
 */
async function init_preview() {
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
 * @memberof module:tasks/preview
 * @returns {undefined}
 */
function reload_preview() {
  if ( browserSync.active ) {
    browserSync.reload();
  }
}
