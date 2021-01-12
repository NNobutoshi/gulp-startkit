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

module.exports = img_min;

function img_min() {
  const
    srcOptions = {
      since : lastRun( img_min ) || process.lastRunTime,
    }
  ;
  return src( config.src, srcOptions )
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
