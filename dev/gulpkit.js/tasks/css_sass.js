const
  gulp       = require('gulp')
  ,notify    = require('gulp-notify')
  ,postcss   = require('gulp-postcss')
  ,plumber   = require('gulp-plumber')
  ,sass      = require('gulp-sass')
  ,gulpIf    = require('gulp-if')
  ,sourcemap = require('gulp-sourcemaps')

  ,autoprefixer = require('autoprefixer')
  ,cssMqpacker  = require('css-mqpacker')

  ,settings     = require('../config.js').settings
  ,config       = require('../config.js').config
  ,options = {
    autoprefixer : {
      browsers : [ 'last 2 version', 'ie 9', 'ios 7', 'android 4' ],
      plumber : {
        errorHandler : notify.onError('Error: <%= error.message %>'),
      },
      sass : {
        outputStyle : 'compact', // nested, compact, compressed, expanded
        linefeed    : 'lf', // 'crlf', 'lf'
        indentType  : 'space', // 'space', 'tab'
        indentWidth : 2,
      },
    },
  }
;


gulp.task( 'css_sass', () => {
  const
    plugins        = [ autoprefixer( options.autoprefixer ) ]
    ,self          = config[ 'css_sass' ]
    ,flagCssMqpack = ( typeof self.needsCssMqpack === 'boolean' )? self.needsCssMqpack: settings.needsCssMqpack
    ,flagSourcemap = ( typeof self.needsSourcemap === 'boolean' )? self.needsSourcemap: settings.needsSourcemap
  ;
  if ( flagCssMqpack ) {
    plugins.push( cssMqpacker() );
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
    .pipe( postcss( plugins ) )
    .pipe( gulpIf(
      flagSourcemap
      ,sourcemap.write( './' )
    ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
} )
;
