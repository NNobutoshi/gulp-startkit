import { src, dest } from 'gulp';
import spriteSmith   from 'gulp.spritesmith';
import plumber       from 'gulp-plumber';
import gulpIf        from 'gulp-if';

import taskForEach from '../lib/task_for_each.js';
import diff        from '../lib/diff_build.js';

import { img_sprite as config } from '../config.js';

const
  options = config.options
;

export default function img_sprite() {
  return src( config.src, { encoding: false } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( taskForEach( config.group, config.base, _branchTask ) )
  ;
}

function _branchTask( subSrc, baseDir ) {
  return src( subSrc, { encoding : false } )
    .pipe( spriteSmith( options.sprite ) )
    .pipe( gulpIf( /\.png$/ ,  dest( config.imgDist.replace( '[subdir]', baseDir ), { encoding :false } ) ) )
    .pipe( gulpIf( /\.scss$/ , dest( config.scssDist.replace( '[subdir]', baseDir ) ) ) )
  ;
}
