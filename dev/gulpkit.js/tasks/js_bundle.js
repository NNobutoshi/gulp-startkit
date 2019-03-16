const
  gulp        = require('gulp')
;

const
  duration   = require('gulp-duration')
  ,gulpIf    = require('gulp-if')
  ,notify    = require('gulp-notify')
  ,sourcemap = require('gulp-sourcemaps')
  ,tap       = require('gulp-tap')
  ,uglify    = require('gulp-uglify')
;

const  
  babelify    = require('babelify')
  ,browserify = require('browserify')
  ,buffer     = require('vinyl-buffer')
  ,source     = require('vinyl-source-stream')
  ,watchify   = require('watchify')
;

const
  config    = require('../config.js').config
  ,settings = require('../config.js').settings
;

const
  options = {
    errorHandler : notify.onError('Error: <%= error.message %>'),
    browserify : {
      cache        : {},
      packageCache : {},
      plugin       : [ watchify ],
      transform    : [ babelify ],
    },
    uglify : {
      output : {
        comments : /^!|(@preserve|@cc_on|\( *c *\)|license|copyright)/i,
      },
    },
  }
;

gulp.task( 'js_bundle', gulp.series( 'clean', () => {
  const
    self           = config[ 'js_bundle' ]
    ,flagUglify    = ( typeof self.uglify    ==='boolean' )? self.uglify:    true
    ,flagSourcemap = ( typeof self.sourcemap ==='boolean' )? self.sourcemap: settings.sourcemap
  ;
  let
    stream
  ;
  options.browserify.debug = flagSourcemap;
  stream = gulp
    .src( self.src )
    .pipe( tap( function( file ) {
      const
        br = browserify( file.path, options.browserify )
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
            flagSourcemap
            ,sourcemap.init( { loadMaps: true } )
          ) )
          .pipe( gulpIf(
            flagUglify
            ,uglify( options.uglify )
          ) )
          .pipe( gulpIf(
            flagSourcemap
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