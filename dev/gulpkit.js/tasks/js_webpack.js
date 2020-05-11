const
  { src, lastRun }     = require( 'gulp' )
  ,webpack = require( 'webpack' )
  ,tap     = require( 'gulp-tap' )
  ,path    = require( 'path' )
  ,plumber = require( 'gulp-plumber' )
;
const
  config = require( '../config.js' ).js_webpack
  ,options = config.options
  ,wbpkConfig = config.wbpkConfig
;

module.exports.js_webpack = js_webpack;
module.exports.js_webpack_partial = js_webpack_partial;

function js_webpack( done ) {
  src( config.src, { since: lastRun( js_webpack ) } )
    .pipe( plumber() )
    .pipe( tap( _bundle( done ) ) )
  ;
}

function js_webpack_partial( done ) {
  return src( config.src )
    .pipe( plumber() )
    .pipe( tap( _bundle( done ) ) )
  ;
}

function _bundle( done ) {
  let
    counter = 0
  ;
  return function( file ) {
    const
      relPath =  path.relative( file._base, file.path )
    ;
    counter = counter + 1;
    wbpkConfig.entry = file.path;
    wbpkConfig.output.filename = relPath.replace( /\.entry\.js$/, '.js' );
    wbpkConfig.output.path = path.resolve( process.cwd(), config.dist );
    wbpkConfig.mode = process.env.NODE_ENV;
    try {
      webpack( wbpkConfig, () => {
        counter = counter - 1;
        console.info( 'webpack : ' + file.path );
        if ( counter === 0 ) {
          done();
        }
      } );
    } catch ( e ) {
      counter = counter - 1;
      options.errorHandler( e );
      if ( counter === 0 ) {
        done();
      }
    }
  };
}
