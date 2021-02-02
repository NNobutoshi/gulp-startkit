const
  { src, dest } = require( 'gulp' )
  ,plumber      = require( 'gulp-plumber' )
  ,spriteSmith  = require( 'gulp.spritesmith' )
  ,diff         = require( 'gulp-diff-build' )
  ,gulpIf       = require( 'gulp-if' )
  ,mergeStream  = require( 'merge-stream' )
;
const
  config = require( '../config.js' ).sprite
;
const
  options = config.options
;

module.exports = sprite;

function sprite() {
  let
    spriteData
    ,imgStream
    ,cSSStream
  ;
  spriteData = src( config.src )
    .pipe( plumber() )
    .pipe( gulpIf(
      options.diff,
      diff( options.diff )
    ) )
    .pipe( spriteSmith( options.sprite ) )
  ;
  imgStream = spriteData
    .img
    .pipe( dest( config.imgDist ) )
  ;
  cSSStream = spriteData
    .css
    .pipe( dest( config.scssDist ) )
  ;
  return mergeStream( imgStream, cSSStream );
}