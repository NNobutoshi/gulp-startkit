const
  fs = require( 'fs' )
  ,config = require( '../config.js' ).last_run_time
;
const
  LAST_RUN_TIME_FILE_PATH = config.filePath
  ,NODE_ENV = process.env.NODE_ENV
;
module.exports = {
  get : function() {
    if ( NODE_ENV && NODE_ENV === 'development' ) {
      if ( fs.existsSync( LAST_RUN_TIME_FILE_PATH ) ) {
        return Number( fs.readFileSync( LAST_RUN_TIME_FILE_PATH, 'utf-8' ) );
      }
    } else {
      return false;
    }
  },
  set : function() {
    if ( LAST_RUN_TIME_FILE_PATH ) {
      fs.writeFileSync( LAST_RUN_TIME_FILE_PATH, '' + new Date().getTime(), 'utf-8', ( error ) => {
        if ( error ) {
          console.info( error );
        }
      } );
    }
  },
};
