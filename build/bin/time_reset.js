const
  lastStampFresh  = require( '../gulpkit.js/lib/last_stamp.js' ).fresh
  ,lastStampReset  = require( '../gulpkit.js/lib/last_stamp.js' ).reset
  ,lastStampResetAll = require( '../gulpkit.js/lib/last_stamp.js' ).resetAll
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
    if ( args[ 0 ] === 'all' ) {
      lastStampResetAll();
    } else {
      for ( let i = 0, len = args.length; i < len; i++ ) {
        lastStampReset( args[ i ] );
      }
    }
  }
}
