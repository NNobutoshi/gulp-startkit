import { src, dest } from 'gulp';

import plumber from 'gulp-plumber';

import { diff_1to1 } from '../lib/diff_build.js';

import { copy_to as config } from '../config.js';

const
  options = config.options
;

export default function copy_to( cb ) {
  diff_1to1( src, config.src, mainTask, options.diff, cb );
}

function mainTask( preparedSrc ) {
  return src( preparedSrc, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( dest( config.dist ) )
  ;
}
