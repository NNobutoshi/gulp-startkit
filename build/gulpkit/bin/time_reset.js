const
  fs = require( 'fs' )
  ,WEBPACK_CACHE_PATH = require( '../gulpfile.js/config.js' )
    .js_webpack.webpackConfig.cache.cacheDirectory
  ,lastStampFresh     = require( '../gulpfile.js/lib/last_run_time.js' ).fresh
  ,lastStampReset     = require( '../gulpfile.js/lib/last_run_time.js' ).reset
  ,lastStampResetAll  = require( '../gulpfile.js/lib/last_run_time.js' ).resetAll
;
const
  func = process.argv[ 2 ]
  ,args = process.argv.slice( 3 )
;


if ( func === 'fresh' ) {
  if ( args && args.length ) {
    for ( let i = 0, len = args.length; i < len; i++ ) {
      lastStampFresh( args[ i ] );
    }
  }
}

if ( func === 'reset' ) {
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
  if ( fs.existsSync( WEBPACK_CACHE_PATH ) ) {
    fs.rmdir( WEBPACK_CACHE_PATH, { recursive : true }, ( error ) => {
      if ( error ) {
        throw error;
      }
    } );
  }
}
