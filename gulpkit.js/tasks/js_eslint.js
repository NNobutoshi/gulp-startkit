import { src } from 'gulp';
import eslint  from 'gulp-eslint';
import plumber from 'gulp-plumber';

import { diff_1on1 } from '../lib/diff_build.js';
import configFile    from '../config.js';

const
  config = configFile.js_eslint
  ,options = config.options
;

export default function js_eslint() {
  return diff_1on1( src, config.src, mainTask, options.diff );
}

function mainTask( fixedSrc, resolve ) {
  return src( fixedSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .on( 'finish', () => resolve() )
    // .pipe( eslint.failAfterError() )
  ;
}
