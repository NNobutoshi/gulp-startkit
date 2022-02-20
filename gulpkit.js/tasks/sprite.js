import gulp from 'gulp';
import spriteSmith  from 'gulp.spritesmith';
import plumber      from 'gulp-plumber';
import mergeStream  from 'merge-stream';
import taskForEach  from '../lib/task_for_each.js';
import diff         from '../lib/diff_build.js';

import configFile from '../config.js';

const
  { src, dest } = gulp
;
const
  config = configFile.sprite
  ,options = config.options
;

export default function sprite() {
  return src( config.src )
    .pipe( diff( options.diff ) )
    .pipe( taskForEach( config.group, config.base, _branchTask ) )
  ;
}

function _branchTask( subSrc, baseDir ) {
  let
    spriteData
    ,imgStream
    ,cSSStream
  ;
  spriteData = src( subSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( spriteSmith( options.sprite ) )
  ;
  imgStream = spriteData
    .img
    .pipe( dest( config.imgDist.replace( '[subdir]' , baseDir ) ) )
  ;
  cSSStream = spriteData
    .css
    .pipe( dest( config.scssDist.replace( '[subdir]', baseDir ) ) )
  ;
  return mergeStream( spriteData, imgStream, cSSStream );
}
