const
  path      = require( 'path' )
  ,{ exec } = require( 'child_process' )
;
const
  del    = require( 'del' )
  ,log   = require( 'fancy-log' )
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
  const removes = await _getGitUntrackedList( config.command );
  await del( removes );
}

function _getGitUntrackedList( comand ) {
  return new Promise( ( resolve ) => {
    exec( comand, ( error, stdout, stderror ) => {
      let removes = [];
      if ( error || stderror ) {
        log.error( chalk.hex( '#FF0000' )( 'clean.js \n' + error || stderror ) );
      }
      if ( stdout ) {
        const matchedAll = stdout.matchAll( /^([\s?]{2})\s([^\n]+?)\n/mg );
        for ( let item of matchedAll ) {
          removes.push(
            path.resolve( process.cwd(), item[ 2 ] )
          );
        }
      }
      resolve( removes );
    } );
  } );
}
