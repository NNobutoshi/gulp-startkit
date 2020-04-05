const
  { src, dest, lastRun } = require( 'gulp' )
  ,imagemin  = require( 'gulp-imagemin' )
  ,plumber   = require( 'gulp-plumber' )

  ,imageminMozjpeg  = require( 'imagemin-mozjpeg' )
  ,imageminPngquant = require( 'imagemin-pngquant' )

  ,taskName = 'img_min'

  ,config   = require( '../config.js' ).config[ taskName ]
  ,settings = require( '../config.js' ).settings
  ,watch = require( './watch.js' )

  ,options = config.options
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
    .pipe( dest( settings.dist ) )
  ;
}

watch( config, img_min );
module.exports = img_min;
