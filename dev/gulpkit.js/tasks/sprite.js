const
  { src, dest, lastRun } = require( 'gulp' )
  ,plumber      = require( 'gulp-plumber' )
  ,spriteSmith  = require( 'gulp.spritesmith' )
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
  const
    srcOptions = {
      since : lastRun( sprite ) || process.lastRunTime,
    }
  ;
  let
    spriteData
    ,imgStream
    ,cSSStream
  ;
  spriteData = src( config.src, srcOptions )
    .pipe( plumber() )
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
