import { src, dest } from 'gulp';

import plumber from 'gulp-plumber';

import diff from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import { copy_to as config } from '../config.js';

const
  LOG_TITLE     = '[copy_to]:'
  ,LOG_SUBTITLE = 'copied'
;

const
  options = config.options
  ,logOptions = {
    forEachFile : false,
  }
;

export default function copy_to() {
  return src( config.src, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( dest( config.dist ) )
    .pipe( logStreamData( LOG_TITLE, LOG_SUBTITLE, logOptions ) )
  ;
}
