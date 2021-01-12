const
  { src, dest, lastRun } = require( 'gulp' )
  ,iconfont    = require( 'gulp-iconfont' )
  ,iconfontCss = require( 'gulp-iconfont-css' )
  ,plumber     = require( 'gulp-plumber' )
;
const
  config = require( '../config.js' ).icon_font
;
const
  options = config.options
;

module.exports = icon_font;

function icon_font() {
  const
    srcOptions = {
      since : lastRun( icon_font ) || process.lastRunTime,
    }
  ;
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( dest( config.fontsDist ) )
    .on( 'finish', function() {
      src( config.fontsCopyFrom, srcOptions )
        .pipe( dest( config.fontsCopyTo ) )
      ;
    } )
  ;
}
