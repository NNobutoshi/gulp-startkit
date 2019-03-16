const gulp = require('gulp');

const del = require('del');

const settings = require('../config.js').settings;

const options = {
  del : {
    dist  : [ settings.dist + '/**/*.map' ],
    force : true,
  },
}
;

gulp.task( 'clean', () => {
  return del( options.del.dist, options.del );
} )
;
