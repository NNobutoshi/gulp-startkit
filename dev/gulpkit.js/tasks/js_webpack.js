const
  { src, lastRun }     = require( 'gulp' )
  ,webpack = require( 'webpack' )
  ,tap     = require( 'gulp-tap' )
  ,path    = require( 'path' )
  ,plumber = require( 'gulp-plumber' )
;
const
  config = require( '../config.js' ).js_webpack
;

function js_webpack() {
  return src( config.src, { since: lastRun( js_webpack ) } )
    .pipe( plumber() )
    .pipe( tap( _bundle() ) )
  ;
}

function js_webpack_partial() {
  return src( config.src )
    .pipe( plumber() )
    .pipe( tap( _bundle() ) )
  ;
}

function _bundle() {
  return function( file ) {
    const
      webpackconfig = require( '../webpack_config.js' )
      ,relPath =  path.relative( file._base, file.path )
    ;
    webpackconfig.entry = file.path;
    webpackconfig.output.filename = relPath.replace( /\.entry\.js$/, '.js' );
    webpackconfig.output.path = path.resolve( process.cwd(), config.dist );
    webpackconfig.mode = process.env.NODE_ENV;
    webpack( webpackconfig ).run( () => {
      console.info( 'webpack : ' + file.path );
    } );
  };
}

module.exports.js_webpack = js_webpack;
module.exports.js_webpack_partial = js_webpack_partial;
