const
  gulp       = require( 'gulp' )
  ,imagemin  = require( 'gulp-imagemin' )
  ,plumber   = require( 'gulp-plumber' )

  ,imageminMozjpeg  = require( 'imagemin-mozjpeg' )
  ,imageminPngquant = require( 'imagemin-pngquant' )

  ,taskName = 'img_min'

  ,config   = require( '../config.js' ).config[ taskName ]
  ,settings = require( '../config.js' ).settings

  ,options = config.options
;

gulp.task( taskName, () => {
  return gulp
    .src( config.src, { since: gulp.lastRun( taskName ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( imagemin( [
      imageminMozjpeg( options.imageminMozjpeg ),
      imageminPngquant( options.imageminPngquant ),
      imagemin.svgo( options.svgo ),
      imagemin.optipng(),
      imagemin.gifsicle(),
    ] ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
} )
;

