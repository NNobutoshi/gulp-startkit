import { src }   from 'gulp';
import plumber   from 'gulp-plumber';
import through   from 'through2';
import stylelint from 'stylelint';
import log       from 'fancy-log';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import { css_scss_lint as config } from '../config.js';

const
  LOG_TITLE = '[css_scss_lint]:'
  ,LOG_SUBTITLE = 'linted'
;
const
  options = config.options
  ,logOptions = {
    forEachFile : false,
  }
;

/**
 * SCSSのLintを実行するタスク。
 * @returns {Object} - Gulp stream
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
    .pipe( logStreamData( LOG_TITLE, LOG_SUBTITLE, logOptions ) )
  ;
}


