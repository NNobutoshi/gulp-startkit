const
  { src, dest, lastRun } = require( 'gulp' )
  ,iconfont    = require( 'gulp-iconfont' )
  ,iconfontCss = require( 'gulp-iconfont-css' )
  ,plumber     = require( 'gulp-plumber' )
  ,through     = require( 'through2' )
;
const
  config = require( '../config.js' ).icon_font
;
const
  options = config.options
;

module.exports = icon_font;

function icon_font() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( _diff_build() )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( dest( config.fontsDist ) )
    .on( 'finish', function() {
      src( config.fontsCopyFrom )
        .pipe( dest( config.fontsCopyTo ) )
      ;
    } )
  ;
}

function _diff_build() {
  const
    allFiles = {}
    ,since = lastRun( icon_font ) || process.lastRunTime
  ;
  let isDiff = false;
  return through.obj( _transform, _flush );
  function _transform( file, enc, callBack ) {
    if ( !since || ( since && file.stat && file.stat.mtime >= since ) ) {
      isDiff = true;
    }
    allFiles[ file.path ] = file;
    callBack();
  }
  function _flush( callBack ) {
    const self = this;
    if ( isDiff === true ) {
      for ( let o in allFiles ) {
        self.push( allFiles[ o ] );
      }
    }
    callBack();
  }
}
