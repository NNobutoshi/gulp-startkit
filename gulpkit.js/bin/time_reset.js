const
  del = require( 'del' )
  ,lastStampFresh     = require( '../lib/last_run_time.js' ).fresh
  ,lastStampReset     = require( '../lib/last_run_time.js' ).reset
  ,lastStampResetAll  = require( '../lib/last_run_time.js' ).resetAll
;
const
  CONFIG = require( '../config.js' )
  ,WEBPACK_CACHE_PATH = CONFIG .js_webpack.webpackConfig.cache.cacheDirectory
;
const
  func = process.argv[ 2 ]
  ,args = process.argv.slice( 3 )
;

( () => {
  switch ( func ) {
  case 'fresh':
    _fresh( args );
    break;
  case 'reset':
    _reset( args );
  default:
    return;
  }
} )();

function _fresh( args ) {
  if ( args && args.length ) {
    switch ( args[ 0 ] ) {
    case 'all':
      _lastStampFreshAll();
      break;
    default:
      for ( let i = 0, len = args.length; i < len; i++ ) {
        lastStampFresh( args[ i ] );
      }
    }
  }
}

function _lastStampFreshAll() {
  Object.values( CONFIG ).forEach( ( val ) => {
    if (
      val &&
      val.options &&
      val.options.diff &&
      val.options.diff.hash ) {
      lastStampFresh( val.options.diff.hash );
    }
  } );
}

function _reset( args )  {
  if ( args && args.length ) {
    switch ( args[ 0 ] ) {
    case 'js_webpack':
      _delWebpackCache();
      break;
    case 'all':
      _delWebpackCache();
      lastStampResetAll();
      break;
    default:
      for ( let i = 0, len = args.length; i < len; i++ ) {
        lastStampReset( args[ i ] );
      }
    }
  }
}

function _delWebpackCache() {
  del( WEBPACK_CACHE_PATH );
}
