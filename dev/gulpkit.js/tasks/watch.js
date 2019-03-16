const
  gulp     = require('gulp')

  ,config  = require('../config.js').config
;

gulp.task( 'watch', _callWatchTasks );

function _callWatchTasks() {
  Object
    .keys( config )
    .forEach( function( key ) {
      var watch = config[ key ].watch;
      if ( Array.isArray( watch ) ) {
        gulp.watch( watch, gulp.series( key ) );
      } else if( watch === true ) {
        gulp.watch( config[ key ].src, gulp.series( key ) );
      }
    } )
  ;
}