const
  { src, dest } = require( 'gulp' )
  ,iconfont     = require( 'gulp-iconfont' )
  ,iconfontCss  = require( 'gulp-iconfont-css' )
  ,plumber      = require( 'gulp-plumber' )
  ,gulpIf       = require( 'gulp-if' )
  ,through      = require( 'through2' )
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

module.exports = icon_font;

function icon_font( cb ) {
  taskForEach( _mainTask, _branchTask, () => cb( ) );
}

function _mainTask() {
  const
    srcCollection = {}
  ;
  options.iconfont.timestamp = 0;
  return new Promise( ( resolve ) => {
    src( config.src )
      .pipe( gulpIf( options.diff, diff( options.diff ) ) )
      .pipe( _setTimestampOption( options.iconfont.timestamp ) )
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
      .pipe( iconfontCss( options.iconfontCss ) )
      .pipe( iconfont( options.iconfont ) )
      .pipe( dest( config.fontsDist.replace( '[subdir]', baseDir ) ) )
      .on( 'finish', () => {
        src( config.fontsCopyFrom.replace( '[subdir]', baseDir ) )
          .pipe( dest( config.fontsCopyTo.replace( '[subdir]', baseDir )  ) )
          .on( 'finish', () => resolve() )
        ;
      } )
    ;
  } );
}

function _setTimestampOption() {
  let
    newer = new Date( 0 )
  ;
  return through.obj( ( file, enc, callBack ) => {
    if ( file.stat && file.stat.mtime > newer ) {
      newer = Date.parse( file.stat.mtime ) / 1000;
    }
    callBack( null, file );
  }, ( callBack ) => {
    options.iconfont.timestamp = newer;
    callBack();
  } );
}
