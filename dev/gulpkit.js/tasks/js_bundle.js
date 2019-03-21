const
  gulp        = require('gulp')
;

const
  duration   = require('gulp-duration')
  ,gulpIf    = require('gulp-if')
  ,sourcemap = require('gulp-sourcemaps')
  ,tap       = require('gulp-tap')
  ,uglify    = require('gulp-uglify')
;

const
  browserify  = require('browserify')
  ,buffer     = require('vinyl-buffer')
  ,source     = require('vinyl-source-stream')
  ,watchify   = require('watchify')
;

const
  config    = require('../config.js').config.js_bundle
  ,settings = require('../config.js').settings
;

const
  options = config.options
;

gulp.task( 'js_bundle', gulp.series( 'clean', () => {
  let
    stream
  ;
  options.browserify.debug = config.sourcemap;
  stream = gulp
    .src( config.src )
    .pipe( tap( function( file ) {
      const
        br = watchify( browserify( file.path, options.browserify ), options.watchify )
      ;
      function _bundle() {
        return br
          .bundle()
          .on( 'error', function( error ) {
            options.errorHandler( error );
            stream.emit('end');
          } )
          .pipe( source( file.relative.replace( /\.bundle\.js$/, '.js') ) )
          .pipe( duration( 'bundled "' + file.path + '"' ) )
          .pipe( buffer() )
          .pipe( gulpIf(
            config.sourcemap
            ,sourcemap.init( { loadMaps: true } )
          ) )
          .pipe( gulpIf(
            config.uglify
            ,uglify( options.uglify )
          ) )
          .pipe( gulpIf(
            config.sourcemap
            ,sourcemap.write( './' )
          ) )
          .pipe( gulp.dest( settings.dist ) )
        ;
      }
      br.on( 'update', _bundle );
      return _bundle();
    } ) )
  ;
  return stream;
} ) )
;
