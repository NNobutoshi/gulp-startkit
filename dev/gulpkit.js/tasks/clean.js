const
  gulp = require('gulp')
  ,del = require('del')
;

const
  settings = require('../config.js').settings
  ,options = {
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
