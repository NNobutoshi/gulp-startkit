const
  gulp        = require('gulp')
  
  ,eSLint   = require('gulp-eslint')
  ,notify   = require('gulp-notify')
  ,plumber  = require('gulp-plumber')
  
  ,config   = require('../config.js').config

  ,options  = {
    plumber : {
      errorHandler : notify.onError('Error: <%= error.message %>'),
    },
    eSLint : {
      useEslintrc: true,
    },
  }
;

gulp.task( 'js_eslint', () => {
  const
    self = config[ 'js_eslint' ]
  ;
  return gulp
    .src( self.src )
    .pipe( plumber( options.plumber ) )
    .pipe( eSLint( options.eSLint ) )
    .pipe( eSLint.format() )
    .pipe( eSLint.failAfterError() )
  ;
} )
;