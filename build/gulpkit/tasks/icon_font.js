const
  { src, dest } = require( 'gulp' )
  ,iconfont     = require( 'gulp-iconfont' )
  ,iconfontCss  = require( 'gulp-iconfont-css' )
  ,plumber      = require( 'gulp-plumber' )
  ,taskForEach  = require( '../lib/task_for_each.js' )
  ,diff         = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).icon_font
;
const
  options = config.options
;

module.exports = icon_font;

function icon_font( cb ) {
  taskForEach( {
    mainSrc : config.src,
    point   : config.point,
    base    : config.base,
    diff    : () => diff( options.diff ),
  }, _branchTask, cb );
}

function _branchTask( subSrc, baseDir ) {
  return new Promise( ( resolve ) => {
    src( subSrc )
      .pipe( plumber( options.plumber ) )
      .pipe( iconfontCss( options.iconfontCss ) )
      .pipe( iconfont( options.iconfont ) )
      .pipe( dest( config.fontsDist.replace( '[point]', baseDir ) ) )
      .on( 'finish', () => {
        src( config.fontsCopyFrom.replace( '[point]', baseDir ) )
          .pipe( dest( config.fontsCopyTo.replace( '[point]', baseDir )  ) )
          .on( 'finish', () => resolve() )
        ;
      } )
    ;
  } );
}
