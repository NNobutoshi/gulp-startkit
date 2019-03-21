const
  gulp     = require('gulp')
;

const  
  plumber = require('gulp-plumber')
  ,sprite  = require('gulp.spritesmith')
;

const
  mergeStream = require('merge-stream')
;

const
  config    = require('../config.js').config.sprite
  ,settings = require('../config.js').settings
;

const
  options = config.options
;

gulp.task( 'sprite', () => {
  let
    spriteData
    ,imgStream
    ,cSSStream
  ;
  spriteData = gulp
    .src( config.src )
    .pipe( plumber() )
    .pipe( sprite( options.sprite ) )
  ;
  imgStream = spriteData
    .img
    .pipe( gulp.dest( settings.dist + '/img' ) )
  ;
  cSSStream = spriteData
    .css
    .pipe( gulp.dest( settings.src + '/css') )
  ;
  return mergeStream( imgStream, cSSStream );
} )
;