const gulp = require('gulp');

const del = require('del');

const config = require('../config.js').config.clean;

const options = config.options;

gulp.task( 'clean', () => {
  return del( options.del.dist, options.del );
} )
;
