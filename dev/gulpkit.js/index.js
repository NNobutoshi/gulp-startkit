const gulp = require('gulp');

const requireDir = require('require-dir');

const config = require('./config.js').config;

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
