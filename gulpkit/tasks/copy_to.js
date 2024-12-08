import { src, dest } from 'gulp';

import plumber from 'gulp-plumber';

import { diff_1to1 } from '../lib/diff_build.js';

import { copy_to as config } from '../config.js';

const
  options = config.options
;

export default function copy_to() {
  return src( config.src, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff_1to1( options.diff ) )
    .pipe( dest( config.dist ) )
  ;
}
