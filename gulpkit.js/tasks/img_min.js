const
  { src, dest, lastRun } = require( 'gulp' )
  ,imagemin         = require( 'gulp-imagemin' )
  ,plumber          = require( 'gulp-plumber' )
  ,imageminMozjpeg  = require( 'imagemin-mozjpeg' )
  ,imageminPngquant = require( 'imagemin-pngquant' )
  ,diff             = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).img_min
;
const
  options = config.options
;

module.exports = img_min;

/*
 * 1 src → 1 dist なので diff build はGulp.lastRun と併用する。
 */
function img_min() {
  return src( config.src, { since : lastRun( img_min ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( imagemin( [
      imageminMozjpeg( options.imageminMozjpeg ),
      imageminPngquant( options.imageminPngquant ),
      imagemin.svgo( options.svgo ),
      imagemin.optipng(),
      imagemin.gifsicle(),
    ] ) )
    .pipe( dest( config.dist ) )
  ;
}
