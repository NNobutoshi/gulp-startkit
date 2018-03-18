var
   fs           = require('fs')
  ,gulp         = require('gulp')
  ,concat       = require('gulp-concat')
  ,uglify       = require('gulp-uglify')
  ,plumber      = require('gulp-plumber')
  ,sourcemap    = require('gulp-sourcemaps')
  ,gulpIf       = require('gulp-if')
  ,sass         = require('gulp-sass')
  ,postcss      = require('gulp-postcss')
  ,mergeStream  = require('merge-stream')
  ,autoprefixer = require('autoprefixer')
  ,iconfont     = require('gulp-iconfont')
  ,iconfontCss  = require('gulp-iconfont-css')
  ,cssMqpacker  = require('css-mqpacker')
  ,sprite       = require('gulp.spritesmith')
  ,jsbundler    = require('gulp-jsbundler') /* local module */
  ,htmlinc      = require('gulp-htmlinc') /* local module */
  ,te           = require('node-template-engine') /* local module */
  ,liveReload   = fs.existsSync('./gulp_livereload.js')? require('./gulp_livereload.js'): null
  ,dist            = 'htdocs'
  ,src             = 'src'
  ,fontName        = 'icons'
  ,runTimestamp    = Math.round( Date.now()/1000 )
  ,needsSourcemap  = true
  ,needsCssMqpack  = true
  ,needsUglify     = true
  ,options         = {
    uglify : {
      output : {
        comments    : /^!?[\s\S]*?(@preserve|@cc_on|\(c\)|license|copyright)[\s\S]*?/i
      }
    }
    ,sass : {
       outputStyle : 'compact' // nested, compact, compressed, expanded
      ,linefeed    : 'lf' // 'crlf', 'lf'
      ,indentType  : 'space' // 'space', 'tab'
      ,indentWidth : 2
    }
    ,autoprefixer : {
      browsers: [ 'last 2 version', 'ie 9', 'ios 7', 'android 4' ]
    }
    ,sprite : {
       cssName   : '_mixins_sprite.scss'
      ,imgName   : 'common_sprite.png'
      ,imgPath   : '../img/common_sprite.png'
      ,cssFormat : 'scss'
      ,padding   : 10
      ,cssTemplate : src + '/_templates/scss.template.handlebars'
      ,cssVarMap   : function ( sprite ) {
        sprite.name = 'sheet-' + sprite.name;
      }
    }
    ,iconfont : {
       fontName       : fontName
      ,prependUnicode : true
      ,formats        : [ 'ttf', 'eot', 'woff' ]
      ,timestamp      : runTimestamp
      ,normalize      : true
    }
    ,iconfontCss : {
       fontName   : fontName
      ,path       : src + '/_templates/_icons.scss'
      ,targetPath : '../css/_icons.scss'
      ,fontPath   : '../fonts/icons/'
    }
    ,jsbundler : {
       suffix : '.bundle'
      ,base   : 'src'
    }
    ,htmlinc : {
      dist: dist
    }
    ,te: {
       src       : './src/_templates'
      ,template  : './src/_templates/template_default.html'
      ,x2j : {
         input   : './sitemap.xlsx'
        ,output  : './sitemap_output.json'
        ,sheet   : 'Sheet1'
      }
    }
  }
  ,tasks = {
    'css:sass' : {
       src     : [ src + '/**/*.scss' ]
      ,watch   : true
      ,default : true
      // ,needsCssMqpack: false
      // ,needsSourcemap: false
     }
    ,'iconfont' : {
       src : [ src + '/fonts/*.svg' ]
      ,watch   : true
      ,default : true
    }
    ,'js:bundle' : {
      src : [
         src + '/**/_*/*.js'
        ,src + '/**/+(_*|*.bundle).js'
      ]
      ,watch   : true
      ,default : true
      // ,needsUglify: false
      // ,needsSourcemap: false
    }
    ,'js:ordinary' : {
      src : [
        src + '/**/!(_)*/!(_*|*.bundle).js'
      ]
      ,watch   : true
      ,default : true
      // ,needsUglify: false
      // ,needsSourcemap: false
    }
    ,'html:inc' : {
       src     : [ src + '/_includes/**/*.html' ]
      ,watch   : true
      ,default : true
    }
    ,'html:te' : {
       src     : [ src + '/_templates/**/*.html' ]
      ,watch   : true
      ,default : true
    }
    ,'sprite'  : {
       src     : [ src + '/img/_sprite/*.png' ]
      ,watch   : true
      ,default : true
    }
    ,'watch' : {
      default : true
    }
  }
;

if ( typeof liveReload === 'function' && liveReload.needs === true ) {
  gulp.task( 'livereload', liveReload );
  tasks.livereload = {
    default : true
  };
}

gulp.task( 'css:sass', function() {
  var
     plugins = [ autoprefixer( options.autoprefixer ) ]
    ,self    = tasks[ 'css:sass' ]
    ,flagCssMqpack = ( typeof self.needsCssMqpack === 'boolean' )? self.needsCssMqpack: needsCssMqpack
    ,flagSourcemap = ( typeof self.needsSourcemap === 'boolean' )? self.needsSourcemap: needsSourcemap
  ;
  if ( flagCssMqpack ) {
    plugins.push( cssMqpacker() );
  }
  return gulp
    .src(
      self.src
    )
    .pipe( plumber() )
    .pipe( gulpIf(
       flagSourcemap
      ,sourcemap.init( { loadMaps: true } )
     ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( plugins ) )
    .pipe( gulpIf(
       flagSourcemap
      ,sourcemap.write( './' )
     ) )
    .pipe( gulp.dest( dist ) )
  ;
} )
;

gulp.task( 'iconfont', function() {
  var
     self = tasks.iconfont
  ;
  return gulp.src( self.src )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( gulp.dest( src + '/fonts' ))
    .on( 'finish', function() {
      gulp.src( src + '/fonts/*' )
        .pipe( gulp.dest( dist + '/fonts/icons') )
      ;
    } )
  ;
})
;

gulp.task( 'html:inc', function() {
  return gulp
    .src( tasks[ 'html:inc' ].src )
    .pipe( plumber() )
    .pipe( htmlinc( opcions.htmlinc ) )
  ;
} )
;

gulp.task( 'html:te', function() {
  return  gulp
    .src( tasks[ 'html:te' ].src )
    .pipe( plumber() )
    .unpipe( te( options.te ) )
  ;
} )
;

gulp.task( 'js', [ 'js:ordinary', 'js:bundle' ] );

gulp.task( 'js:ordinary', function() {
  var
     self = tasks[ 'js:ordinary' ]
    ,flagUglify    = ( typeof self.needsUglify ==='boolean' )? self.needsUglify: needsUglify
    ,flagSourcemap = ( typeof self.needsSourcemap ==='boolean' )? self.needsSourcemap: needsSourcemap
  ;
  return gulp
    .src( self.src )
    .pipe( plumber() )
    .pipe( gulpIf(
       flagSourcemap
      ,sourcemap.init( { loadMaps: true } )
     ) )
    .pipe( gulpIf(
        flagUglify
       ,uglify( options.uglify )
     ) )
    .pipe( gulpIf(
       flagSourcemap
      ,sourcemap.write( './' )
     ) )
    .pipe( gulp.dest( dist ) )
  ;
} )
;

gulp.task( 'js:bundle', [ 'js:bundle:setup' ], function() {
  var
     sources = jsbundler.sources
    ,self    = tasks[ 'js:bundle' ]
    ,flagUglify    = ( typeof self.needsUglify ==='boolean' )? self.needsUglify: needsUglify
    ,flagSourcemap = ( typeof self.needsSourcemap ==='boolean' )? self.needsSourcemap: needsSourcemap
    ,streams
  ;
  streams = sources.map( function( item ) {
    return gulp
      .src( item.urls, { base: options.jsbundler.base } )
      .pipe( plumber() )
      .pipe( gulpIf(
         flagSourcemap
        ,sourcemap.init( { loadMaps: true } )
       ) )
      .pipe( gulpIf(
          flagUglify
         ,gulpIf(
             _ignore( /\.min\.js$/ )
            ,uglify( options.uglify )
          )
       ) )
      .pipe( concat( item.name ) )
      .pipe( gulpIf(
         flagSourcemap
        ,sourcemap.write( './' )
       ) )
      .pipe( gulp.dest( dist + item.dist ) )
    ;
  } )
  ;
  return mergeStream( streams );
} )
;

gulp.task( 'js:bundle:setup', function() {
  return gulp
    .src( tasks[ 'js:bundle' ].src )
    .pipe( plumber() )
    .pipe( jsbundler( options.jsbundler ) )
  ;
} )
;

gulp.task( 'sprite', function() {
  var
     self = tasks.sprite
    ,spriteData
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
    .pipe( gulp.dest( dist + '/img' ) )
  ;
  cSSStream = spriteData
    .css
    .pipe( gulp.dest( src + '/css') )
  ;
  return mergeStream( imgStream, cSSStream );
} )
;

gulp.task( 'watch', _callWatchTasks );

gulp.task( 'default', _filterDefaultTasks() );

function _ignore( regex ) {
  return function( obj ) {
    return !regex.test( obj.path );
  };
}

function _callWatchTasks() {
  Object
    .keys( tasks )
    .forEach( function( key ) {
      if ( tasks[ key ].watch && tasks[ key ].watch === true ) {
        gulp.watch( tasks[ key ].src, [ key ] );
      }
  } );
}

function _filterDefaultTasks() {
  return Object
    .keys( tasks )
    .filter( function( key ) {
      if ( tasks[ key ].default && tasks[ key ].default === true ) {
        return key;
      }
  } );
}