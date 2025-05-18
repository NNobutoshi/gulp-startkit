import { src as gulpSrc } from 'gulp';
import plumber   from 'gulp-plumber';
import through   from 'through2';
import stylelint from 'stylelint';
import fancyLog  from 'fancy-log';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import { config, options } from '../config/config_css_lint_scss.js';

/**
 * SCSS のLint を実行するタスク。
 * @returns {Stream} - Gulp stream
 */
export default function css_lint_scss() {
  return gulpSrc( config.src, options.gulpSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( through.obj(
      async function( file, enc, callback ) {
        try {
          const { report } = await stylelint.lint( { ...options.stylelint,
            code : String( file.contents ),
          } );
          if ( report ) {
            fancyLog( report.replace( /<.+?>/, file.path ) );
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


