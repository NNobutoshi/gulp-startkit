const
  gulp     = require('gulp')
  
  ,plumber     = require('gulp-plumber')
  ,mergeStream = require('merge-stream')
  ,notify      = require('gulp-notify')
  ,sprite      = require('gulp.spritesmith')
  
  ,config   = require('../config.js').config
  ,settings = require('../config.js').settings

  ,options = {
    plumber : {
      errorHandler : notify.onError('Error: <%= error.message %>'),
    },
    sprite : {
      cssName      : '_mixins_sprite.scss',
      imgName     : 'common_sprite.png',
      imgPath     : '../img/common_sprite.png',
      cssFormat   : 'scss',
      padding     : 10,
      cssTemplate : settings.src + '/_templates/scss.template.handlebars',
      cssVarMap   : function ( sprite ) {
        sprite.name = 'sheet-' + sprite.name;
      },
    },
  }
;

gulp.task( 'sprite', () => {
  const
    self = config.sprite
  ;
  let
    spriteData
    ,imgStream
    ,cSSStream
  ;
  spriteData = gulp
    .src( self.src )
    .pipe( plumber() )
    .pipe( sprite( options.sprite ) )
  ;
  imgStream = spriteData
    .img
    .pipe( gulp.dest( settings.dist + '/img' ) )
  ;
  cSSStream = spriteData
    .css
    .pipe( gulp.dest( settings.src + '/css') )
  ;
  return mergeStream( imgStream, cSSStream );
} )
;