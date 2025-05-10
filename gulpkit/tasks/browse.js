import { access }        from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path              from 'node:path';

import browserSync from 'browser-sync';
import fancyLog    from 'fancy-log';
import chalk       from 'chalk';

export { init_browse, reload_browse };

const
  RELATIVE_CONFIG_FILE_PATH = '../config_browse.js'
  ,CONFIG_FILE_DIRNAME      = path.dirname( fileURLToPath( import.meta.url ) )
  ,CONFIG_FILE_PATH         = path.resolve( CONFIG_FILE_DIRNAME, RELATIVE_CONFIG_FILE_PATH )
;

/**
 * @param {Function} done gulp タスクのコールバック
 * @returns {Promise<void>}
 */
async function init_browse( done ) {
  try {
    if ( !await _exists( CONFIG_FILE_PATH ) ) {
      fancyLog( chalk.gray( 'no serve' ) );
      return done();
    }
    const { enabled, options } = await import( RELATIVE_CONFIG_FILE_PATH );
    if ( enabled === false ) {
      fancyLog( chalk.gray( 'no serve' ) );
      return done();
    }
    browserSync.init( options );
    return done();
  } catch {
    return done();
  }
}

/**
 * @param {Function} done Gulp タスク完了のコールバック
 * @returns {Function<void>}
 */
function reload_browse( done ) {
  if ( browserSync.active ) {
    browserSync.reload();
  }
  return done();
}

/**
 * ファイルの存在を確認する。
 * @param {String} filePath - 直近の差分情報が書き込まれたファイルのパス
 * @returns {Promise<void>}
 */
async function _exists( filePath ) {
  try {
    await access( filePath );
    return true;
  } catch {
    return false;
  }
}
