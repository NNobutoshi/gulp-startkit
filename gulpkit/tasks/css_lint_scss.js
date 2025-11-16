/**
 * @module tasks/css_lint_scss
 * @requires gulp
 * @requires gulp-plumber
 * @requires through2
 * @requires stylelint
 * @requires fancy-log
 * @requires ../lib/diff_build.js
 * @requires ../lib/log_stream_data.js
 * @requires ../lib/watch_task.js
 * @requires ../config/config_css_lint_scss.js
 */

import { src as gulpSrc } from 'gulp';
import plumber   from 'gulp-plumber';
import through   from 'through2';
import stylelint from 'stylelint';
import fancyLog  from 'fancy-log';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';
import watchTask     from '../lib/watch_task.js';

import { config, options } from '../config/config_css_lint_scss.js';

export { css_lint_scss as default };

/**
 * SCSS のLint を実行するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/css_lint_scss
 * @returns {Stream} - Gulp ストリーム
 */
function css_lint_scss() {
  if ( options.watch.enabled === true && !css_lint_scss.watchIsEnabled ) {
    css_lint_scss.watchIsEnabled = true;
  }
  return gulpSrc( config.src, options.gulpSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( _lintScss() )
    .pipe( logStreamData( options.logStreamData ) )
  ;
}

if ( options.watch.enabled === true ) {
  watchTask( config.src, options.watch, css_lint_scss );
}

/**
 * SCSS の構文チェック。
 * @returns {Stream} - Gulp ストリーム
 */
function _lintScss() {
  return through.obj( async function _transform( file, enc, callback ) {
    try {
      const
        { report } = await stylelint.lint(
          { ...options.stylelint,
            code : file.contents.toString(),
          }
        )
      ;
      if ( report ) {
        // 不要な1行目の文字列はfile.path で置換する。
        fancyLog( report.replace( /<.+?>/, file.path ) );
      }
      callback( null, file );
    } catch ( err ) {
      callback( err );
    }
  } );
}
