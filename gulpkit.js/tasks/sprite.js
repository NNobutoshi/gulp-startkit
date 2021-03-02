const
  { src, dest } = require( 'gulp' )
  ,spriteSmith  = require( 'gulp.spritesmith' )
  ,plumber      = require( 'gulp-plumber' )
  ,gulpIf       = require( 'gulp-if' )
  ,mergeStream  = require( 'merge-stream' )
  ,taskForEach  = require( '../lib/task_for_each.js' )
  ,groupSrc     = require( '../lib/group_src.js' )
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
  const srcCollection = {};
  return src( config.src )
    .pipe( gulpIf( options.diff, diff( options.diff ) ) )
    .pipe( groupSrc( srcCollection, config.group, config.base ) )
    .pipe( taskForEach( srcCollection, _branchTask ) )
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
