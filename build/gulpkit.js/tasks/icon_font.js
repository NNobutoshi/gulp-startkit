const
  { src, dest } = require( 'gulp' )
  ,iconfont    = require( 'gulp-iconfont' )
  ,iconfontCss = require( 'gulp-iconfont-css' )
  ,plumber     = require( 'gulp-plumber' )
  ,diff        = require( 'gulp-diff-build' )
  ,gulpIf      = require( 'gulp-if' )
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
    .pipe( gulpIf(
      options.diff,
      diff( options.diff )
    ) )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( dest( config.fontsDist ) )
    .on( 'finish', function() {
      src( config.fontsCopyFrom )
        .pipe( gulpIf(
          options.diff,
          diff( options.diff )
        ) )
        .pipe( dest( config.fontsCopyTo ) )
      ;
    } )
  ;
}