import { relative } from 'node:path';

import through  from 'through2';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';

const defaultSettings = {
  onStream     : true,
  forEachFile  : true,
  textColorHex : '#000088',
};

/*
 * @param {string} title
 * @param {string} subTitle
 * @param {object} options
 */
export default function logSteamData( title, subTitle, options ) {
  const settings = Object.assign( {}, defaultSettings, options );
  let fileCounter = 0;
  if ( settings.onStream === false ) {
    fancyLog( chalk.hex( settings.textColorHex )( `${ title } ${ subTitle }` ) );
    return;
  }
  return through.obj( ( file, enc, callback ) => {
    fileCounter += 1;
    if ( settings.forEachFile === false ) {
      callback( null, file );
      return;
    }
    fancyLog(
      chalk.hex( settings.textColorHex )( `${ title } ${ subTitle }` ) +
      ` ${ relative( process.cwd(), file.path ) }`
    );
    callback( null, file );
  }, ( callback ) => {
    if ( fileCounter === 0 ) {
      callback();
      return;
    }
    fancyLog(
      chalk.hex( settings.textColorHex )( title ) +
      ` ${ fileCounter } files ` +
      chalk.hex( settings.textColorHex )( subTitle )
    );
    callback();
  } );
}
