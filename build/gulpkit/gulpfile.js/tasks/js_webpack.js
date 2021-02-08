const
  { src }       = require( 'gulp' )
  ,webpack      = require( 'webpack' )
  ,path         = require( 'path' )
  ,log          = require( 'fancy-log' )
  ,through      = require( 'through2' )
  ,serve_reload = require( './serve.js' ).serve_reload
;
const
  config         = require( '../config.js' ).js_webpack
  ,options       = config.options
  ,webpackConfig = config.webpackConfig
;

module.exports = js_webpack;

function js_webpack() {
  return src( config.src )
    .pipe( _init_webpak() )
  ;
}

function _init_webpak() {
  const entries = {};

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    const
      key = path.relative( config.base, file.path ).replace( /\.entry\.js$/, '' ).replace( /\\/g, '/' )
      ,val = `./${config.base}/${path.relative( config.base, file.path ).replace( /\\/g, '/' )}`
    ;
    entries[ key ] = val;
    callBack();
  }

  function _flush( callBack ) {
    if ( Object.keys( entries ).length > 0 ) {
      return _pack( entries, callBack );
    }
    callBack();
  }

}

function _pack( entries, done ) {
  webpackConfig.entry = entries;
  webpackConfig.output.filename = '[name].js';
  webpackConfig.output.path = path.resolve( process.cwd(), config.dist );
  webpackConfig.mode = process.env.NODE_ENV;
  webpack( webpackConfig, ( error, stats ) => {
    let chunks;
    if ( stats.hasErrors && stats.hasErrors() ) {
      log( 'webpack: has error' );
    }
    if ( error ) {
      options.errorHandler( error );
    }
    chunks = stats.compilation.chunks;
    for ( let item of chunks ) {
      if ( item.rendered === true ) {
        log( `webpack:${item.id}` );
      }
    }
    if ( typeof serve_reload === 'function' ) {
      serve_reload();
    }
    if ( typeof done === 'function' ) {
      done();
      done = null;
    }
  } );
}
