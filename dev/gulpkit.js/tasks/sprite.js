const
  { src, dest } = require( 'gulp' )
  ,plumber      = require( 'gulp-plumber' )
  ,spriteSmith  = require( 'gulp.spritesmith' )
  ,mergeStream  = require( 'merge-stream' )
;
const
  config = require( '../config.js' ).sprite
  ,watch  = require( './watch.js' )
;
const
  options = config.options
;

function sprite() {
  let
    spriteData
    ,imgStream
    ,cSSStream
  ;
  spriteData = src( config.src )
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

watch( config, sprite );
module.exports = sprite;
