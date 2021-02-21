const
  { src, dest } = require( 'gulp' )
  ,spriteSmith  = require( 'gulp.spritesmith' )
  ,plumber      = require( 'gulp-plumber' )
  ,gulpIf       = require( 'gulp-if' )
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

function sprite( cb ) {
  taskForEach( _mainTask, _branchTask, cb );
}

function _mainTask() {
  const
    srcCollection = {}
  ;
  return new Promise( ( resolve ) => {
    src( config.src )
      .pipe( gulpIf( options.diff, diff( options.diff ) ) )
      .pipe( groupSrc( srcCollection, config.group, config.base ) )
      .on( 'finish', () => {
        resolve( srcCollection );
      } )
    ;
  } );
}

function _branchTask( subSrc, baseDir ) {
  return new Promise( ( resolve ) => {
    ( async function() {
      let spriteData;
      spriteData = await _sprite( subSrc );
      await _img( spriteData, config.imgDist.replace( '[subdir]' , baseDir ) );
      await _css( spriteData, config.scssDist.replace( '[subdir]', baseDir ) );
      resolve();
    } )( );
  } );
}


function _sprite( newSrc ) {
  return new Promise( ( resolve ) => {
    const spriteData = src( newSrc )
      .pipe( plumber() )
      .pipe( spriteSmith( options.sprite ) )
      .on( 'finish', () => resolve( spriteData ) )
    ;
  } );
}

function _img( stream , dist ) {
  return new Promise( ( resolve ) => {
    stream
      .img
      .pipe( dest( dist ) )
      .on( 'finish', resolve )
    ;
  } );
}

function _css( stream, dist ) {
  return new Promise( ( resolve ) => {
    stream
      .css
      .pipe( dest( dist ) )
      .on( 'finish', resolve )
    ;
  } );
}
