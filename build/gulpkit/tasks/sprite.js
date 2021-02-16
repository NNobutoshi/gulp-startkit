const
  { src, dest } = require( 'gulp' )
  ,plumber      = require( 'gulp-plumber' )
  ,spriteSmith  = require( 'gulp.spritesmith' )
  ,taskForEach  = require( '../lib/task_for_each.js' )
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
  taskForEach( {
    mainSrc : config.src,
    point   : config.point,
    base    : config.base,
    diff    : () => diff( options.diff ),
  }, _branchTask, cb );
}

function _branchTask( subSrc, baseDir ) {
  return new Promise( ( resolve ) => {
    ( async function() {
      let spriteData;
      spriteData = await _sprite( subSrc );
      await _img( spriteData, config.imgDir.replace( '[point]' , baseDir ) );
      await _css( spriteData , config.scssDir.replace( '[point]' , baseDir ) );
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
