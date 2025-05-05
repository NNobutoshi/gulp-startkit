import { exec } from 'node:child_process';

import fancyLog from 'fancy-log';
import chalk    from 'chalk';

import { clean as config } from '../config.js';

export default async function clean() {
  await _gitClean( config.command );
}

/**
 * Git Command をつかってUntracked fileを、削除。
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
