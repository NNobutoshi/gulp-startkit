const
  fs = require( 'fs' )
  ,WEBPACK_CACHE_PATH = require( '../gulpkit.js/config.js' )
    .js_webpack.webpackConfig.cache.cacheDirectory
  ,lastStampFresh     = require( '../gulpkit.js/lib/last_stamp.js' ).fresh
  ,lastStampReset     = require( '../gulpkit.js/lib/last_stamp.js' ).reset
  ,lastStampResetAll  = require( '../gulpkit.js/lib/last_stamp.js' ).resetAll
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
      _delWebpackConfig();
      break;
    case 'all':
      _delWebpackConfig();
      lastStampResetAll();
      break;
    default:
      for ( let i = 0, len = args.length; i < len; i++ ) {
        lastStampReset( args[ i ] );
      }
    }
  }
}

function _delWebpackConfig() {
  if ( fs.existsSync( WEBPACK_CACHE_PATH ) ) {
    fs.rmdir( WEBPACK_CACHE_PATH, { recursive : true }, ( error ) => {
      if ( error ) {
        throw error;
      }
    } );
  }
}
