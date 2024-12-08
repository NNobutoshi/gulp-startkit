import { src } from 'gulp';
import eslint  from 'gulp-eslint';
import plumber from 'gulp-plumber';

import { diff_1to1 } from '../lib/diff_build.js';

import { js_eslint as config } from '../config.js';

const
  options = config.options
;

export default function js_eslint() {
  return src( config.src, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff_1to1( options.diff ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
  ;
}
