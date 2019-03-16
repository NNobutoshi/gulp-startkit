const
  gulp = require('gulp')
;

const
  gulpIf     = require('gulp-if')
  ,notify    = require('gulp-notify')
  ,plumber   = require('gulp-plumber')
  ,postcss   = require('gulp-postcss')
  ,sass      = require('gulp-sass')
  ,sourcemap = require('gulp-sourcemaps')
;

const
  autoprefixer = require('autoprefixer')
  ,cssMqpacker = require('css-mqpacker')
;

const
  config    = require('../config.js').config
  ,settings = require('../config.js').settings
;

const
  browsers = [ 'last 2 version', 'ie 9', 'ios 7', 'android 4' ]
  ,options = {
    plumber : {
      errorHandler : notify.onError('Error: <%= error.message %>'),
    },
    sass : {
      outputStyle : 'compact', // nested, compact, compressed, expanded
      linefeed    : 'lf', // 'crlf', 'lf'
      indentType  : 'space', // 'space', 'tab'
      indentWidth : 2,
    },
    postcss : {
      plugins : [ autoprefixer( browsers ) ]
    },
  }
;


gulp.task( 'css_sass', () => {
  const
    self           = config[ 'css_sass' ]
    ,flagCssMqpack = ( typeof self.cssMqpack === 'boolean' )? self.cssMqpack: true
    ,flagSourcemap = ( typeof self.sourcemap === 'boolean' )? self.sourcemap: settings.sourcemap
  ;
  if ( flagCssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return gulp
    .src(
      self.src
    )
    .pipe( plumber( options.plumber ) )
    .pipe( gulpIf(
      flagSourcemap
      ,sourcemap.init( { loadMaps: true } )
    ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf(
      flagSourcemap
      ,sourcemap.write( './' )
    ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
} )
;
