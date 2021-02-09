const
  { src, dest } = require( 'gulp' )
  ,plumber      = require( 'gulp-plumber' )
  ,spriteSmith  = require( 'gulp.spritesmith' )
  ,mergeStream  = require( 'merge-stream' )
  ,diff         = require( '../lib/diff_build.js' )
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
    .pipe( diff( options.diff ) )
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
