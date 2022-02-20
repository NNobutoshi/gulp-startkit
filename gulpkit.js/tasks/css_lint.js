import gulp      from 'gulp';
import plumber   from 'gulp-plumber';
import stylelint from 'gulp-stylelint';

import diff       from '../lib/diff_build.js';
import configFile from '../config.js';

const
  { src, lastRun } = gulp
;
const
  config = configFile.css_lint
  ,options = config.options
;

/*
 * 1 src → dist なし、なので diff build はGulp.lastRun と併用する。
 */
export default function css_lint() {
  return src( config.src, { since : lastRun( css_lint ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( stylelint( options.stylelint ) )
  ;
}
