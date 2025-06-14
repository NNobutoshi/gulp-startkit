/**
 * @module tasks/clean
 * @requires node:child_process
 * @requires fancy-log
 * @requires chalk
 * @requires ../config/config_clean.js
 */

import { exec } from 'node:child_process';

import fancyLog from 'fancy-log';
import chalk    from 'chalk';

import { config } from '../config/config_clean.js';

export { clean as default };

/**
 * dist 先のクリーンアップを行う。<br>
 * 削除するファイルは、Untracked file のみ。<br>
 * Gulp はcallback の実行やStream の代わりにPromise を返してもOK。<br>
 * default としてエクスポート。
 * @memberof module:tasks/clean
 * @returns {Promise<void>}
 */
async function clean() {
  await _gitClean( config.command );
}

/**
 * Git のコマンドを使って未追跡ファイルを削除。
 * @private
 * @param {string} command - git clean コマンド
 * @returns {Promise<void>}
 */
function _gitClean( comand ) {
  return new Promise( ( resolve, reject ) => {
    exec( comand, ( err, stdout, stderr ) => {
      if ( err ) {
        fancyLog.error( chalk.red( 'clean.js \n' + err.stack ) );
        return reject();
      }
      if ( stderr ) {
        fancyLog.warn( chalk.yellow( `clean.js \n${ stderr.trim() }` ) );
      }
      if ( stdout ) {
        const stdArray = stdout.trim().split( '\n' );
        fancyLog( chalk.green( `git clean:Removed ${ stdArray.length } untracked files` ) );
        stdArray.forEach( ( line ) => {
          fancyLog( chalk.green( line ) );
        } );
      }
      resolve();
    } );
  } );
}
