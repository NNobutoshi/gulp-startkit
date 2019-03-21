const
  gulp = require('gulp')
;

const
  gulpIf     = require('gulp-if')
  ,plumber   = require('gulp-plumber')
  ,postcss   = require('gulp-postcss')
  ,sass      = require('gulp-sass')
  ,sourcemap = require('gulp-sourcemaps')
;

const
  cssMqpacker = require('css-mqpacker')
;

const
  config    = require('../config.js').config.css_sass
  ,settings = require('../config.js').settings
;

const
  options = config.options
;

gulp.task( 'css_sass', () => {
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return gulp
    .src(
      config.src
    )
    .pipe( plumber( options.plumber ) )
    .pipe( gulpIf(
      config.sourcemap
      ,sourcemap.init( { loadMaps: true } )
    ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf(
      config.sourcemap
      ,sourcemap.write( './' )
    ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
} )
;
