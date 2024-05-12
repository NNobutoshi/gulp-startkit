import { src, dest } from 'gulp';

import plumber from 'gulp-plumber';

import diff       from '../lib/diff_build.js';
import configFile from '../config.js';

const
  config = configFile.copy_to
;
const
  options = config.options
;

export default function copy_to() {
  return src( config.src, { encoding : false } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( dest( config.dist ) )
  ;
}
