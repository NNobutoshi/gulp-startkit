const
  { src, dest, lastRun } = require( 'gulp' )
  ,imagemin = require( 'gulp-imagemin' )
  ,plumber  = require( 'gulp-plumber' )
  ,imageminMozjpeg  = require( 'imagemin-mozjpeg' )
  ,imageminPngquant = require( 'imagemin-pngquant' )
;
const
  config = require( '../config.js' ).img_min
;
const
  options = config.options
;

function img_min() {
  return src( config.src, { since: lastRun( img_min ) } )
    .pipe( plumber( options.plumber ) )
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

module.exports = img_min;
