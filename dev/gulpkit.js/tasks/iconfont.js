const
  gulp         = require('gulp')
  ,iconfont    = require('gulp-iconfont')
  ,iconfontCss = require('gulp-iconfont-css')
  ,plumber     = require('gulp-plumber')

  ,fs = require('fs')

  ,taskName = 'iconfont'

  ,config   = require('../config.js').config[ taskName ]

  ,options = config.options
;

gulp.task( taskName, () => {
  let
    srcOptions = {}
  ;
  if ( config.tmspFile && fs.existsSync( config.tmspFile ) ) {
    srcOptions.since = Number( fs.readFileSync( config.tmspFile, 'utf-8' ) );
  }
  return gulp
    .src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( gulp.dest( config.fontsDist ) )
    .on( 'finish', function() {
      gulp.src( config.fontsCopyFrom )
        .pipe( gulp.dest( config.fontsCopyTo ) )
      ;
      if ( config.tmspFile ) {
        fs.writeFileSync( config.tmspFile, new Date().getTime(), 'utf-8', function( error ) {
          if ( error ) {
            options.plumber.errorHandler( error );
          }
        } );
      }
    } )
  ;
} )
;
