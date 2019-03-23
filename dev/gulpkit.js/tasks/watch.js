const
  gulp = require('gulp')

  ,config = require('../config.js').config

  ,options = config.watch.options
;

gulp.task( 'watch', _callWatchTasks );

function _callWatchTasks( done ) {
  Object
    .keys( config )
    .forEach( function( key ) {
      var watch = config[ key ].watch;
      if ( Array.isArray( watch ) ) {
        gulp.watch( watch, options.watch, gulp.series( key ) );
      } else if( watch === true ) {
        gulp.watch( config[ key ].src, options.watch, gulp.series( key ) );
      }
    } )
  ;
  done();
}
