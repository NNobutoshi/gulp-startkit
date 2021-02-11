const
  { src }       = require( 'gulp' )
  ,webpack      = require( 'webpack' )
  ,path         = require( 'path' )
  ,log          = require( 'fancy-log' )
  ,through      = require( 'through2' )
  ,isRegExp     = require( 'lodash/isRegExp' )
;
const
  config         = require( '../config.js' ).js_webpack
  ,options       = config.options
  ,webpackConfig = config.webpackConfig
;
let
  isFirst = true
  ,done
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
    let key, val, targetSuffix;

    if ( config.target && typeof config.target === 'string' ) {
      targetSuffix = new RegExp( config.target.replace( /\./g, '\\.' ) + '$' );
    } else if ( isRegExp( config.target ) ) {
      targetSuffix = config.target;
    }
    if ( !targetSuffix || !targetSuffix.test( file.basename ) ) {
      return callBack();
    }
    key = path.relative( config.base, file.path ).replace( targetSuffix, '' ).replace( /\\/g, '/' );
    val = path.relative( process.cwd(), file.path ).replace( /\\/g , '/' );
    entries[ key ] = val;
    callBack();
  }

  function _flush( callBack ) {
    if ( isFirst === true ) {
      if ( Object.keys( entries ).length > 0 ) {
        _pack( entries );
        done = callBack;
      }
      isFirst = false;
    } else {
      if ( typeof done === 'function' ) {
        // webpack が動作中は、callBack は自分で処理する。
        callBack();
      } else {
        done = callBack;
      }
    }
  }
}

function _pack( entries ) {
  webpackConfig.entry = entries;
  webpackConfig.output.filename = '[name].js';
  webpackConfig.output.path = path.resolve( process.cwd(), config.dist );
  webpackConfig.watch = config.watch;
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
    if ( typeof done === 'function' ) {
      done();
    } else {
      done = null;
    }
  } );
}
