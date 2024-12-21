import { src }   from 'gulp';
import plumber   from 'gulp-plumber';
import through   from 'through2';
import stylelint from 'stylelint';
import log       from 'fancy-log';

import { diff_1to1 } from '../lib/diff_build.js';

import { css_scss_lint as config } from '../config.js';

const
  options = config.options
;

export default function css_scss_lint() {
  return src( config.src, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff_1to1( options.diff ) )
    .pipe( through.obj(
      async function( file, enc, callBack ) {
        try {
          const { report } = await stylelint.lint( {
            code: String( file.contents ),
            formatter: 'string',
          } );
          if ( report ) {
            log( report.replace( /<.+?>/, file.path ) );
          }
          callBack( null, file );
        } catch ( error ) {
          callBack( error );
        }
      },
    ) )
  ;
}


