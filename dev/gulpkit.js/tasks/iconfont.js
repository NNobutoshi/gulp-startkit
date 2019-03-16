const
  gulp = require('gulp')
;

const
  iconfont     = require('gulp-iconfont')
  ,iconfontCss = require('gulp-iconfont-css')
;

const
  config    = require('../config.js').config
  ,settings = require('../config.js').settings
;

const
  options = {
    iconfont : {
      fontName       : 'icons',
      prependUnicode : true,
      formats        : [ 'ttf', 'eot', 'woff' ],
      timestamp      : Math.round( Date.now() / 1000 ),
      normalize      : true,
    },
    iconfontCss : {
      fontName   : 'icons',
      path       : settings.src + '/_templates/_icons.scss',
      targetPath : '../css/_icons.scss',
      fontPath   : '../fonts/icons/',
    },
  }
;
gulp.task( 'iconfont', () => {
  const
    self = config.iconfont
  ;
  return gulp.src( self.src )
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