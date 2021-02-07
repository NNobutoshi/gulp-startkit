const
  lastStampFresh  = require( '../gulpkit.js/lib/last_stamp.js' ).fresh
  ,lastStampReset  = require( '../gulpkit.js/lib/last_stamp.js' ).reset
  ,lastStampResetAll = require( '../gulpkit.js/lib/last_stamp.js' ).resetAll
;

const
  func = process.argv[ 2 ]
  ,arg = process.argv[ 3 ]
;

if ( func === 'fresh' ) {
  lastStampFresh( arg );
}

if ( func === 'reset' ) {
  console.info( arg );
  if ( arg === 'all' ) {
    lastStampResetAll();
  } else {
    lastStampReset( arg );
  }
}
