const
  { src, dest } = require( 'gulp' )
  ,iconfont     = require( 'gulp-iconfont' )
  ,iconfontCss  = require( 'gulp-iconfont-css' )
  ,plumber      = require( 'gulp-plumber' )
  ,gulpIf       = require( 'gulp-if' )
  ,through      = require( 'through2' )
;
const
  sVGLint       = require( '../lib/svg_lint.js' )
  ,taskForEach  = require( '../lib/task_for_each.js' )
  ,groupSrc     = require( '../lib/group_src.js' )
  ,diff         = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).icon_font
;
const
  options = config.options
;

options.iconfont.timestamp = 0;

module.exports = icon_font;

function icon_font() {
  const srcCollection = {};
  return src( config.src )
    .pipe( gulpIf( options.diff, diff( options.diff ) ) )
    .pipe( _setTimestampOption( options.iconfont.timestamp ) )
    .pipe( groupSrc( srcCollection, config.group, config.base ) )
    .pipe( taskForEach( srcCollection, _branchTask ) )
  ;
}

function _branchTask( subSrc, baseDir ) {
  return src( subSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( sVGLint() )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( dest( config.fontsDist.replace( '[subdir]', baseDir ) ) )
    .on( 'finish', () => {
      src( config.fontsCopyFrom.replace( '[subdir]', baseDir ) )
        .pipe( dest( config.fontsCopyTo.replace( '[subdir]', baseDir )  ) )
      ;
    } )
  ;
}

function _setTimestampOption() {
  let newer = new Date( 0 );
  return through.obj( ( file, enc, callBack ) => {
    if ( file.stat && file.stat.birthtime > newer ) {
      newer = Date.parse( file.stat.birthtime ) / 1000;
    }
    callBack( null, file );
  }, ( callBack ) => {
    options.iconfont.timestamp = newer;
    callBack();
  } );
}
