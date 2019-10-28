const
  gulp       = require( 'gulp' )
  ,plumber   = require( 'gulp-plumber' )
  ,stylelint = require( 'gulp-stylelint' )

  ,taskName = 'css_lint'

  ,config   = require( '../config.js' ).config[ taskName ]

  ,options = config.options
;

gulp.task( taskName, () => {
  return gulp
    .src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( stylelint( options.stylelint ) )
  ;
} )
;

