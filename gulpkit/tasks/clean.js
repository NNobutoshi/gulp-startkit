import { exec } from 'node:child_process';

import log   from 'fancy-log';
import chalk from 'chalk';

import { clean as config } from '../config.js';

export default async function clean() {
  await _gitClean( config.command );
}

/*
 * Git Command をつかってUntracked fileを、削除。
 * 戻り値はPromise。
 */
function _gitClean( comand ) {
  return new Promise( ( resolve, reject ) => {
    exec( comand, ( err, stdout, stderr ) => {
      if ( err || stderr ) {
        log.error( chalk.red( 'clean.js \n' + err || stderr ) );
        return reject();
      }
      if ( stdout ) {
        log( chalk.green( 'git clean:Removing untracked file' ) );
      }
      resolve();
    } );
  } );
}
