import gulp from 'gulp';
import eslint from 'gulp-eslint';
import plumber from 'gulp-plumber';

import diff from '../lib/diff_build.js';
import configFile from '../config.js';

const
  { src, lastRun } = gulp
;
const
  config = configFile.js_eslint
  ,options = config.options
;

/*
 * 1 src → dist なし、なので diff build はGulp.lastRun と併用する。
 */
export default function js_eslint() {
  return src( config.src, { since : lastRun( js_eslint ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .pipe( eslint.failAfterError() )
  ;
}
