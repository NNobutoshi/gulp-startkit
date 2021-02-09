const
  del = require( 'del' )
  ,lastStampFresh     = require( '../gulpfile.js/lib/last_run_time.js' ).fresh
  ,lastStampReset     = require( '../gulpfile.js/lib/last_run_time.js' ).reset
  ,lastStampResetAll  = require( '../gulpfile.js/lib/last_run_time.js' ).resetAll
;
const
  WEBPACK_CACHE_PATH = require( '../gulpfile.js/config.js' )
    .js_webpack.webpackConfig.cache.cacheDirectory
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

function _fresh() {
  if ( args && args.length ) {
    for ( let i = 0, len = args.length; i < len; i++ ) {
      lastStampFresh( args[ i ] );
    }
  }
}

function _reset()  {
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
