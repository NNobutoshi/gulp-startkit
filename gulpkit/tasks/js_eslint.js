import { src } from 'gulp';
import eslint  from 'gulp-eslint';
import plumber from 'gulp-plumber';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import { js_eslint as config } from '../config.js';

const
  options = config.options
  ,logOptions = {
    forEachFile: false
  }
  ,LOG_TITLE    = '[js_eslint]:'
  ,LOG_SUBTITLE = 'linted'
;

export default function js_eslint() {
  return src( config.src, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .pipe( logStreamData( LOG_TITLE, LOG_SUBTITLE, logOptions ) )
  ;
}
