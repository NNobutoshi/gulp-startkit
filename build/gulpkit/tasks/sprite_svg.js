const
  { src, dest } = require( 'gulp' )
  ,svgSprite    = require( 'gulp-svg-sprite' )
  ,plumber      = require( 'gulp-plumber' )
  ,gulpIf       = require( 'gulp-if' )
  ,taskForEach  = require( '../lib/task_for_each.js' )
  ,groupSrc     = require( '../lib/group_src.js' )
  ,diff         = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).sprite_svg
;
const
  options = config.options
;

module.exports = sprite_svg;

function sprite_svg( cb ) {
  taskForEach( _mainTask, _branchTask, cb );
}

function _mainTask() {
  const
    srcCollection = {}
  ;
  return new Promise( ( resolve ) => {
    src( config.src )
      .pipe( diff( options.diff ) )
      .pipe( groupSrc( srcCollection, config.point, config.base ) )
      .on( 'finish', () => {
        resolve( srcCollection );
      } )
    ;
  } );
}

function _branchTask( subSrc, baseDir ) {
  return new Promise( ( resolve ) => {
    src( subSrc )
      .pipe( plumber( options.plumber ) )
      .pipe( svgSprite( options.svgSprite ) )
      .pipe( gulpIf( /\.svg$/, dest( config.dist + baseDir ) ) )
      .pipe( gulpIf( /\.css$/, dest( config.dist + baseDir ) ) )
      .pipe( gulpIf( /\.scss$/, dest( config.base + baseDir ) ) )
      .pipe( gulpIf( /\.html$/, dest( config.dist + baseDir ) ) )
      .on( 'finish', resolve )
    ;
  } );
}
