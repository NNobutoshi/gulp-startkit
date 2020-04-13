const
  fs = require( 'fs' )
  ,notify = require( 'gulp-notify' )
  ,STAMP_FILE_PATH = './gulpkit.js/tasks/.timestamp'
;

function time_stamp( done ) {
  fs.writeFileSync( STAMP_FILE_PATH, new Date().getTime(), 'utf-8', function( error ) {
    if ( error ) {
      notify.onError( 'Error: <%= error.message %>' ).errorHandler( error );
    }
    done();
  } );
  done();
}

module.exports = time_stamp;
