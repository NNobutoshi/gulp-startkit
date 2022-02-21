import gulp    from 'gulp';
import plumber from 'gulp-plumber';

import diff       from '../lib/diff_build.js';
import configFile from '../config.js';

const
  { src, dest, lastRun } = gulp
;
const
  config = configFile.copy_to
;
const
  options = config.options
;

/*
 * diff build はGulp.lastRun と併用する。
 */
export default function copy_to() {
  return src( config.src, { since : lastRun( copy_to ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( dest( config.dist ) )
  ;
}
