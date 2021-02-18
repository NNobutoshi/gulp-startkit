const
  { src, dest }     = require( 'gulp' )
  ,imagemin         = require( 'gulp-imagemin' )
  ,plumber          = require( 'gulp-plumber' )
  ,gulpIf           = require( 'gulp-if' )
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

function img_min() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( gulpIf( options.diff, diff( options.diff ) ) )
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
