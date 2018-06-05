var
  fs = require('fs')

  ,gulp        = require('gulp')
  ,htmlinc     = require('gulp-htmlinc') /* local module */
  ,iconfont    = require('gulp-iconfont')
  ,iconfontCss = require('gulp-iconfont-css')
  ,gulpIf      = require('gulp-if')
  ,notify      = require('gulp-notify')
  ,plumber     = require('gulp-plumber')
  ,postcss     = require('gulp-postcss')
  ,sass        = require('gulp-sass')
  ,sourcemap   = require('gulp-sourcemaps')
  ,sprite      = require('gulp.spritesmith')
  ,tap         = require('gulp-tap')
  ,uglify      = require('gulp-uglify')

  ,autoprefixer = require('autoprefixer')
  ,babelify     = require('babelify')
  ,browserify   = require('browserify')
  ,cssMqpacker  = require('css-mqpacker')
  ,del          = require('del')
  ,buffer       = require('gulp-buffer')
  ,beautifyHtml = require('js-beautify').html
  ,mergeStream  = require('merge-stream')
  ,tempEngine   = require('node-template-engine') /* local module */
  ,pug          = require('pug')

  ,liveReload      = fs.existsSync('./gulp_livereload.js')? require('./gulp_livereload.js'): null
  ,dist            = 'html'
  ,src             = 'src'
  ,needsSourcemap  = true
  ,needsCssMqpack  = true
  ,needsUglify     = false
  ,options         = {
    autoprefixer : {
      browsers : [ 'last 2 version', 'ie 9', 'ios 7', 'android 4' ]
    }
    ,assistPretty : {
      assistAElement    : true
      ,commentPosition  : 'inside'
      ,commentOnOneLine : true
      ,emptyLine        : true
      ,indent           : true
    }
    ,beautifyHtml : {
      indent_size  : 2
      ,indent_char : ' '
    }
    ,browserify : {
      debug: true
      ,
    }
    ,del : {
      dist : [ dist + '/**/*.map']
    }
    ,htmlinc : {
      dist: dist
    }
    ,iconfont : {
      fontName        : 'icons'
      ,prependUnicode : true
      ,formats        : [ 'ttf', 'eot', 'woff' ]
      ,timestamp      : Math.round( Date.now() / 1000 )
      ,normalize      : true
    }
    ,iconfontCss : {
      fontName    : 'icons'
      ,path       : src + '/_templates/_icons.scss'
      ,targetPath : '../css/_icons.scss'
      ,fontPath   : '../fonts/icons/'
    }
    ,plumber : {
      errorHandler: notify.onError('Error: <%= error.message %>')
    }
    ,pug : {
      pretty : true
    }
    ,sass : {
      outputStyle  : 'compact' // nested, compact, compressed, expanded
      ,linefeed    : 'lf' // 'crlf', 'lf'
      ,indentType  : 'space' // 'space', 'tab'
      ,indentWidth : 2
    }
    ,sprite : {
      cssName      : '_mixins_sprite.scss'
      ,imgName     : 'common_sprite.png'
      ,imgPath     : '../img/common_sprite.png'
      ,cssFormat   : 'scss'
      ,padding     : 10
      ,cssTemplate : src + '/_templates/scss.template.handlebars'
      ,cssVarMap   : function ( sprite ) {
        sprite.name = 'sheet-' + sprite.name;
      }
    }
    ,tempEngine : {
      src       : './src/_templates'
      ,template : './src/_templates/template_default.html'
      ,dest     : dist
      ,x2j      : {
        input   : './sitemap.xlsx'
        ,output : './sitemap_output.json'
        ,sheet  : 'Sheet1'
      }
    }
    ,uglify : {
      output : {
        comments : /^!|(@preserve|@cc_on|\( *c *\)|license|copyright)/i
      }
    }
  }
  ,tasks = {
    'css:sass' : {
      src      : [ src + '/**/*.scss' ]
      ,watch   : true
      ,default : true
      // ,needsCssMqpack: false
      // ,needsSourcemap: false
    }
    ,'iconfont' : {
      src      : [ src + '/fonts/*.svg' ]
      ,watch   : true
      ,default : false
    }
    ,'js:bundle' : {
      src      : [ src + '/**/*bundle.js' ]
      ,watch   : [ src + '/**/*.js' ]
      ,default : true
      // ,needsUglify: false
      // ,needsSourcemap: false
    }
    ,'html:pug' : {
      src : [
        ''   + src + '/**/*.pug'
        ,'!' + src + '/**/_*/*.pug'
        ,'!' + src + '/**/_*.pug'
      ]
      ,watch   : [ src + '/**/*.pug' ]
      ,default : true
    }
    ,'html:inc' : {
      src      : [ src + '/_includes/**/*.html' ]
      ,watch   : true
      ,default : true
    }
    ,'html:te' : {
      src      : [ src + '/_templates/**/*.html' ]
      ,watch   : true
      ,default : true
    }
    ,'sprite'  : {
      src      : [ src + '/img/_sprite/*.png' ]
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
    plugins        = [ autoprefixer( options.autoprefixer ) ]
    ,self          = tasks[ 'css:sass' ]
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
    .pipe( gulp.dest( src + '/fonts' ) )
    .on( 'finish', function() {
      gulp.src( src + '/fonts/*' )
        .pipe( gulp.dest( dist + '/fonts/icons') )
      ;
    } )
  ;
})
;

gulp.task( 'html:pug', function() {
  var
    self = tasks[ 'html:pug' ]
    ,stream
    ,errorHandler = options.plumber.errorHandler
  ;
  stream = gulp
    .src( self.src )
    .pipe( tap( function( file, t ) {
      var
        contents = ''
        ,ugliyAElementRegEx = /([\t ]*)[^\r\n]*?<a .*?>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*/g
        ,endCommentRegEx = /(<\/.+?>)(\r?\n|\r)(\s*)(<!-- \/?[.#].+?-->)/mg
        ,emptyCommentRegEx = /^\s+<!---->$/mg
      ;
      options.pug.filename = file.path;
      try {
        contents = pug.render( String( file.contents ), options.pug );
      } catch( e ) {
        errorHandler( e );
      }
      if ( options.assistPretty.assistAElement ) {
        contents = contents.replace( ugliyAElementRegEx, function( m0, m1 ) {
          return beautifyHtml( m0, options.beautifyHtml ).replace( /^/mg, m1 );
        } );
      }
      if ( options.assistPretty.indent === false ) {
        contents = contents.replace( /^([\t ]+)/mg, '' );
      }
      if ( options.assistPretty.commentPosition ) {
        contents = contents.replace( endCommentRegEx, function( all, endTag, lineFeed, indent, comment ) {
          if ( options.assistPretty.commentPosition === 'inside' ) {
            if ( options.assistPretty.commentOnOneLine === true ) {
              if ( options.assistPretty.emptyLine === true ) {
                return comment + endTag + lineFeed;
              } else {
                return comment + endTag;
              }
            } else {
              if ( options.assistPretty.emptyLine === true ) {
                return comment + lineFeed + indent + endTag + lineFeed;
              } else {
                return comment + lineFeed + indent + endTag;
              }
            }
          } else {
            if ( options.assistPretty.commentOnOneLine === true ) {
              if ( options.assistPretty.emptyLine === true ) {
                return endTag + comment + lineFeed;
              } else {
                return endTag + comment;
              }
            } else {
              if ( options.assistPretty.emptyLine === true ) {
                return endTag + lineFeed + indent + comment + lineFeed;
              } else {
                return endTag + lineFeed + indent + comment;
              }
            }
          }
        } );
      }
      if( options.assistPretty.emptyLine === true ) {
        contents = contents.replace( emptyCommentRegEx, '' );
      }
      file.contents = new global.Buffer( contents );
      file.path = file.path.replace( /\.pug$/, '.html');
      return t.through( gulp.dest, [ dist ] );
    } ) )
  ;
  return stream;
} );

gulp.task( 'html:inc', function() {
  return gulp
    .src( tasks[ 'html:inc' ].src )
    .pipe( plumber() )
    .pipe( htmlinc( options.htmlinc ) )
  ;
} )
;

gulp.task( 'html:te', function() {
  return  gulp
    .src( tasks[ 'html:te' ].src )
    .pipe( plumber() )
    .unpipe( tempEngine( options.tempEngine ) )
  ;
} )
;

gulp.task( 'js:bundle', [ 'clean' ], function() {
  var
    self           = tasks[ 'js:bundle' ]
    ,flagUglify    = ( typeof self.needsUglify ==='boolean' )? self.needsUglify: needsUglify
    ,flagSourcemap = ( typeof self.needsSourcemap ==='boolean' )? self.needsSourcemap: needsSourcemap
    ,stream
  ;
  stream = gulp
    .src( self.src )
    .pipe( tap( function( file ) {
      file.contents = browserify( file.path, options.browserify )
        .transform( babelify )
        .bundle()
        .on( 'error', function( error ) {
          options.plumber.errorHandler( error );
          stream.emit('end');
        } )
      ;
      file.path = file.path.replace( /\.bundle\.js$/, '.js' );
    } ) )
    .pipe( buffer() )
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
  return stream;
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

gulp.task( 'clean', function() {
  return del( options.del.dist );
} )
;

gulp.task( 'watch', _callWatchTasks );

gulp.task( 'default', _filterDefaultTasks() );

// function _match( regex, flag ) {
//   return function( obj ) {
//     if( flag ) {
//       return regex.test( obj.path );
//     } else {
//       return !regex.test( obj.path );
//     }
//   };
// }

function _callWatchTasks() {
  Object
    .keys( tasks )
    .forEach( function( key ) {
      var watch = tasks[ key ].watch;
      if( watch ) {
        if ( watch === true ) {
          gulp.watch( tasks[ key ].src, [ key ] );
        } else if ( Array.isArray( watch ) ) {
          gulp.watch( watch, [ key ] );
        }
      }
    } )
  ;
}

function _filterDefaultTasks() {
  return Object
    .keys( tasks )
    .filter( function( key ) {
      if ( tasks[ key ].default && tasks[ key ].default === true ) {
        return key;
      }
    } )
  ;
}
