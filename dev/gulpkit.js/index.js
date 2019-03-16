const
  gulp = require('gulp')

  ,config     = require('./config.js').config
  ,requireDir = require('require-dir')
;

requireDir('./tasks');

gulp.task( 'default', _filterDefaultTasks() );

function _filterDefaultTasks() {
  return gulp.parallel( Object
    .keys( config )
    .filter( function( key ) {
      return config[ key ].default === true;
    } ) )
  ;
}
