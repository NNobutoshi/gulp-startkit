import { relative } from 'node:path';

import through  from 'through2';
import fancyLog from 'fancy-log';

export default function renderingLog( title ) {
  let renderedFileCounter = 0;
  return through.obj( ( file, enc, callback ) => {
    fancyLog( `${ title } rendered ${ relative( process.cwd(), file.path ) }` );
    renderedFileCounter += 1;
    callback( null, file );
  }, ( callback ) => {
    fancyLog( `${ title } rendered ${ renderedFileCounter } files` );
    callback();
  } );
}
