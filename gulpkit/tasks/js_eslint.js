import { src } from 'gulp';
import eslint  from 'gulp-eslint';
import plumber from 'gulp-plumber';

import { diff_1to1 }           from '../lib/diff_build.js';
import { js_eslint as config } from '../config.js';

const
  options = config.options
;

export default function js_eslint( cb ) {
  diff_1to1( src, config.src, mainTask, options.diff, cb );
}

function mainTask( preparedSrc ) {
  return src( preparedSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .on( 'data', () => {} ) //flowing mode をtrue にして finish event を発行されるようにする。
  ;
}
