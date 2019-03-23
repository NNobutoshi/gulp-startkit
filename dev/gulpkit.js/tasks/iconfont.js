const
  gulp         = require('gulp')
  ,iconfont    = require('gulp-iconfont')
  ,iconfontCss = require('gulp-iconfont-css')

  ,config   = require('../config.js').config.iconfont
  ,settings = require('../config.js').settings

  ,options = config.options
;

gulp.task( 'iconfont', () => {
  return gulp.src( config.src )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( gulp.dest( settings.src + '/fonts' ) )
    .on( 'finish', function() {
      gulp.src( settings.src + '/fonts/*' )
        .pipe( gulp.dest( settings.dist + '/fonts/icons' ) )
      ;
    } )
  ;
} )
;
