import { src }   from 'gulp';
import plumber   from 'gulp-plumber';
import through   from 'through2';
import stylelint from 'stylelint';
import log       from 'fancy-log';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import config from '../config/config_css_scss_lint.js';

const
  options = config.options
;

/**
 * SCSS のLint を実行するタスク。
 * @returns {Stream} - Gulp stream
 */
export default function css_scss_lint() {
  return src( config.src, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( through.obj(
      async function( file, enc, callback ) {
        try {
          const { report } = await stylelint.lint( {
            code : String( file.contents ),
            formatter : 'string',
          } );
          if ( report ) {
            log( report.replace( /<.+?>/, file.path ) );
          }
          callback( null, file );
        } catch ( err ) {
          callback( err );
        }
      },
    ) )
    .pipe( logStreamData( options.logStreamData ) )
  ;
}


