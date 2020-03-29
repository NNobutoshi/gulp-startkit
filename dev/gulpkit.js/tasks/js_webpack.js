const
  gulp     = require( 'gulp' )
  ,webpack = require( 'webpack' )
  ,tap       = require( 'gulp-tap' )
  ,path = require( 'path' )
  ,plumber     = require( 'gulp-plumber' )
;
const
  taskName = 'js_webpack'

  ,config   = require( '../config.js' ).config[ taskName ]
  ,settings = require( '../config.js' ).settings

;
let
  timeoutId = null
;
gulp.task( taskName, ( cb ) => {
  gulp.src( config.src, { since: gulp.lastRun( taskName ) } )
    .pipe( plumber() )
    .pipe( tap( _pack( cb ) ) )
  ;
} )
;

gulp.task( `${taskName}_partial`, ( cb ) => {
  gulp.src( config.src  )
    .pipe( plumber() )
    .pipe( tap( _pack( cb ) ) )
  ;
} )
;

function _pack( cb ) {
  return function( file ) {
    const
      webpackconfig = require( '../webpack_config.js' )
      ,relPath =  path.relative( file._base, file.path )
    ;
    webpackconfig.entry = file.path;
    webpackconfig.output.filename = relPath.replace( /\.bundle\.js$/, '.js' );
    webpackconfig.output.path = path.resolve( process.cwd(), settings.dist );
    webpackconfig.mode = process.env.NODE_ENV;
    clearTimeout( timeoutId );
    webpack( webpackconfig ).run( () => {
      clearTimeout( timeoutId );
      console.info( 'webpack : ' + file.path );
      timeoutId = setTimeout( () => {
        cb();
      }, 600 );
    } );
  };
}
