import { src as gulpSrc, dest } from 'gulp';
import plumber from 'gulp-plumber';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import { config, options } from '../config/config_copy_to.js';

/**
 * 指定されたファイルをコピーするタスク。
 * @returns {Stream} - Gulp stream
*/
export default function copy_to() {
  return gulpSrc( config.src, options.gulpSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( dest( config.dist ) )
    .pipe( logStreamData( options.logStreamData ) )
  ;
}
