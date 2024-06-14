import { src, dest } from 'gulp';

import plumber from 'gulp-plumber';

import { diff_1on1 } from '../lib/diff_build.js';
import configFile    from '../config.js';

const
  config = configFile.copy_to
;
const
  options = config.options
;

export default function copy_to() {
  return diff_1on1( src, config.src, mainTask, options.diff );
}

function mainTask( fixedSrc, resolve ) {
  return src( fixedSrc, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( dest( config.dist ) )
    .on( 'finish', () => resolve() )
  ;
}
