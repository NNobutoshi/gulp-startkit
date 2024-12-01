import { src }   from 'gulp';
import through   from 'through2';
import plumber   from 'gulp-plumber';
import stylelint from 'stylelint';

import { diff_1to1 } from '../lib/diff_build.js';

import { css_scss_lint as config } from '../config.js';

const
  options = config.options
;

export default function css_scss_lint( cb ) {
  diff_1to1( src, config.src, mainTask, options.diff, cb );
}

function mainTask( preparedSrc ) {
  const targetFiles = [];
  return src( preparedSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( through.obj(
      function( file, enc, callBack ) {
        targetFiles.push( file.path );
        stylelint.lint( {
          code: String( file.contents ),
          formatter: 'string',
        } )
          .then( ( { report, errored } ) =>  {
            if ( report ) {
              console.log( report.replace( /<.+?>/, file.path ) );
            }
            callBack( null, file );
          } )
          .catch( ( error ) =>  {
            callBack( ( targetFiles.length > -1 ) ? error : null );
          } );
      },
    ) )
    .on( 'data', () => {} ) //flowing mode をtrue にして finish event を発行されるようにする。
  ;
}

