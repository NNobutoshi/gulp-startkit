const
  { src }  = require( 'gulp' )
  ,webpack = require( 'webpack' )
  ,path    = require( 'path' )
  ,log     = require( 'fancy-log' )
  ,tap     = require( 'gulp-tap' )
  ,serve_reload = require( './serve.js' ).serve_reload
;
const
  config      = require( '../config.js' ).js_webpack
  ,options    = config.options
  ,wbpkConfig = config.wbpkConfig
;

module.exports = js_webpack;

function js_webpack( done ) {
  const
    entries = {}
    ,srcOptions = {
      // since : lastRun( js_webpack ) || process.lastRunTime,
    }
  ;
  src( config.src, srcOptions )
    .pipe( tap( ( file ) => {
      const
        key = path.relative( config.base, file.path ).replace( /\.entry\.js$/, '' ).replace( /\\/g, '/' )
        ,val = `./${config.base}/${path.relative( config.base, file.path ).replace( /\\/g, '/' )}`
      ;
      entries[ key ] = val;
    } ) )
    .on( 'finish', () => {
      if ( Object.keys( entries ).length > 0 ) {
        _pack();
      } else {
        done();
      }
    } )
  ;

  function _pack() {
    wbpkConfig.entry = entries;
    wbpkConfig.output.filename = '[name].js';
    wbpkConfig.output.path = path.resolve( process.cwd(), config.dist );
    wbpkConfig.mode = process.env.NODE_ENV;
    webpack( wbpkConfig, ( error, stats ) => {
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
      done();
    } );
  }
}
