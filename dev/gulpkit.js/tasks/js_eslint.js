const
  gulp = require('gulp')
;

const  
  eSLint   = require('gulp-eslint')
  ,plumber = require('gulp-plumber')
;

const 
  config = require('../config.js').config.js_eslint
;

const
  options = config.options
;

gulp.task( 'js_eslint', () => {
  return gulp
    .src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( eSLint( options.eSLint ) )
    .pipe( eSLint.format() )
    .pipe( eSLint.failAfterError() )
  ;
} )
;