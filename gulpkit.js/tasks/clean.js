const
  { exec } = require( 'child_process' )
;
const
  log    = require( 'fancy-log' )
  ,chalk = require( 'chalk' )
;
const
  config = require( '../config.js' ).clean
;

module.exports = clean;

/*
 * Git Command をつかってUntracked fileを、削除。
 * 戻り値はPromise。
 */
async function clean() {
  await _gitClean( config.command );
}

function _gitClean( comand ) {
  return new Promise( ( resolve ) => {
    exec( comand, ( error, stdout, stderror ) => {
      if ( error || stderror ) {
        log.error( chalk.hex( '#FF0000' )( 'clean.js \n' + error || stderror ) );
      }
      if ( stdout ) {
        log( chalk.green( 'git clean:Removing untracked file' ) );
      }
      resolve();
    } );
  } );
}
