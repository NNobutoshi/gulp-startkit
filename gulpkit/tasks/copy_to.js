/**
 * @module tasks/copy_to
 * @requires gulp
 * @requires gulp-plumber
 * @requires ../lib/diff_build.js
 * @requires ../lib/log_stream_data.js
 * @requires ../lib/watch_task.js
 * @requires ../config/config_copy_to.js
 */

import { src as gulpSrc, dest } from 'gulp';
import plumber from 'gulp-plumber';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';
import watchTask     from '../lib/watch_task.js';

import { config, options } from '../config/config_copy_to.js';

export { copy_to as default };

/**
 * 指定されたファイルをコピーするタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/copy_to
 * @returns {Stream} - Gulp ストリーム
 */
function copy_to() {
  return gulpSrc( config.src, options.gulpSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( dest( config.dist ) )
    .pipe( logStreamData( options.logStreamData ) )
  ;
}

if ( options.watch.enabled === true ) {
  watchTask( config.src, options.watch, copy_to );
}
