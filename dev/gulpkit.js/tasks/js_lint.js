const
  gulp     = require( 'gulp' )
  ,eslint  = require( 'gulp-eslint' )
  ,plumber = require( 'gulp-plumber' )

  ,taskName = 'js_lint'

  ,config = require( '../config.js' ).config[ taskName ]

  ,options = config.options
;

gulp.task( taskName, () => {
  return gulp
    .src( config.src, { since: gulp.lastRun( taskName ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .pipe( eslint.failAfterError() )
  ;
} )
;
