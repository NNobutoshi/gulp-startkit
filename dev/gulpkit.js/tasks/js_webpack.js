const
  webpack = require( 'webpack' )
  ,path    = require( 'path' )
  ,glob    = require( 'glob' )
  ,log     = require( 'fancy-log' )
;
const
  config = require( '../config.js' ).js_webpack
  ,options = config.options
  ,wbpkConfig = config.wbpkConfig
;

module.exports = js_webpack;

function js_webpack( done ) {
  const
    entries = {}
  ;
  glob( config.src.join( '|' ), ( err, files ) => {
    _pack( files, path.resolve( config.base ) );
  } )
  ;
  function _pack( files, base ) {
    files.forEach( ( filePath ) => {
      entries[ path.relative( base, filePath ).replace( /\.entry\.js$/, '' ) ] = './' + filePath;
    } );
    wbpkConfig.entry = entries;
    wbpkConfig.output.filename = '[name].js';
    wbpkConfig.output.path = path.resolve( process.cwd(), config.dist );
    wbpkConfig.mode = process.env.NODE_ENV;
    try {
      webpack( wbpkConfig, () => {
        log( 'webpack: packed' );
        done();
      } );
    } catch ( e ) {
      options.errorHandler( e );
      done();
    }
  }
}
