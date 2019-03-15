const
  gulp         = require('gulp')
  ,changed     = require('gulp-changed')
  ,duration    = require('gulp-duration')
  ,eSLint      = require('gulp-eslint')
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
;

const
  autoprefixer  = require('autoprefixer')
  ,babelify     = require('babelify')
  ,beautifyHtml = require('js-beautify').html
  ,browserify   = require('browserify')
  ,buffer       = require('vinyl-buffer')
  ,cssMqpacker  = require('css-mqpacker')
  ,del          = require('del')
  ,mergeStream  = require('merge-stream')
  ,pug          = require('pug')
  ,source       = require('vinyl-source-stream')
  ,watchify     = require('watchify')
;

const
  dist            = '../html'
  ,src             = 'src'
  ,needsSourcemap  = true
  ,needsCssMqpack  = true
  ,needsUglify     = false
;

const
  options         = {
    autoprefixer : {
      browsers : [ 'last 2 version', 'ie 9', 'ios 7', 'android 4' ],
    },
    assistPretty : {
      assistAElement   : true,
      commentPosition  : 'inside',
      commentOnOneLine : true,
      emptyLine        : true,
      indent           : true,
    },
    beautifyHtml : {
      indent_size : 2,
      indent_char : ' ',
    },
    browserify : {
      cache        : {},
      packageCache : {},
      plugin       : [ watchify ],
      transform    : [ babelify ],
    },
    del : {
      dist  : [ dist + '/**/*.map' ],
      force : true,
    },
    eSLint : {
      useEslintrc: true,
    },
    iconfont : {
      fontName       : 'icons',
      prependUnicode : true,
      formats        : [ 'ttf', 'eot', 'woff' ],
      timestamp      : Math.round( Date.now() / 1000 ),
      normalize      : true,
    },
    iconfontCss : {
      fontName   : 'icons',
      path       : src + '/_templates/_icons.scss',
      targetPath : '../css/_icons.scss',
      fontPath   : '../fonts/icons/',
    },
    plumber : {
      errorHandler : notify.onError('Error: <%= error.message %>'),
    },
    pug : {
      pretty  : true,
      basedir : src,
    },
    sass : {
      outputStyle : 'compact', // nested, compact, compressed, expanded
      linefeed    : 'lf', // 'crlf', 'lf'
      indentType  : 'space', // 'space', 'tab'
      indentWidth : 2,
    },
    sprite : {
      cssName      : '_mixins_sprite.scss',
      imgName     : 'common_sprite.png',
      imgPath     : '../img/common_sprite.png',
      cssFormat   : 'scss',
      padding     : 10,
      cssTemplate : src + '/_templates/scss.template.handlebars',
      cssVarMap   : function ( sprite ) {
        sprite.name = 'sheet-' + sprite.name;
      },
    },
    uglify : {
      output : {
        comments : /^!|(@preserve|@cc_on|\( *c *\)|license|copyright)/i,
      },
    },
  }
;

const
  tasks = {
    'css:sass' : {
      src     : [ src + '/**/*.scss' ],
      watch   : true,
      default : true,
      // needsCssMqpack: false,
      // needsSourcemap: false,
    },
    'iconfont' : {
      src     : [ src + '/fonts/*.svg' ],
      watch   : true,
      default : false,
    },
    'js:bundle' : {
      src     : [ src + '/**/*bundle.js' ],
      watch   : false,
      default : true,
      // needsUglify: false,
      // needsSourcemap: false,
    },
    'js:eslint' : {
      src : [
        ''   + '*.js'
        ,''  + src + '/**/*.js'
        ,'!' + src + '/**/_vendor/*.js'
      ],
      watch   : true,
      default : true,
      // needsUglify: false,
      // needsSourcemap: false,
    },
    'html:pug' : {
      src : [
        ''   + src + '/**/*.pug',
        '!' + src + '/**/_*.pug',
        '!' + src + '/**/_*/**/*.pug',
      ],
      watch   : true,
      default : true,
    },
    'html:_pug' : {
      src : [
        ''   + src + '/**/*.pug',
        '!' + src + '/**/_*.pug',
      ],
      watch   : [ src + '/**/_*.pug' ],
      default : true,
    },
    'sprite'  : {
      src     : [ src + '/img/_sprite/*.png' ],
      watch   : true,
      default : true,
    },
    'watch' : {
      default : true,
    },
  }
;

gulp.task( 'css:sass', () => {
  const
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
    .pipe( plumber( options.plumber ) )
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

gulp.task( 'iconfont', () => {
  const
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
} )
;

gulp.task( 'html:pug', () => {
  const
    self = tasks[ 'html:pug' ]
  ;
  let
    stream
  ;
  stream = gulp
    .src( self.src )
    .pipe( changed( dist, {
      extension: '.html'
    } ) )
    .pipe( tap( _pugRender ) )
    .pipe( gulp.dest( dist ) )
  ;
  return stream;
} )
;

gulp.task( 'html:_pug', () => {
  const
    self = tasks[ 'html:_pug' ]
  ;
  let
    stream
  ;
  stream = gulp
    .src( self.src )
    .pipe( tap( _pugRender ) )
    .pipe( gulp.dest( dist ) )
  ;
  return stream;
} )
;

gulp.task( 'clean', () => {
  return del( options.del.dist, options.del );
} )
;

gulp.task( 'js:bundle', gulp.series( 'clean', () => {
  const
    self           = tasks[ 'js:bundle' ]
    ,flagUglify    = ( typeof self.needsUglify ==='boolean' )? self.needsUglify: needsUglify
    ,flagSourcemap = ( typeof self.needsSourcemap ==='boolean' )? self.needsSourcemap: needsSourcemap
  ;
  let
    stream
  ;
  options.browserify.debug = flagSourcemap;
  stream = gulp
    .src( self.src )
    .pipe( tap( function( file ) {
      const
        br = browserify( file.path, options.browserify )
      ;
      function _bundle() {
        return br
          .bundle()
          .on( 'error', function( error ) {
            options.plumber.errorHandler( error );
            stream.emit('end');
          } )
          .pipe( source( file.relative.replace( /\.bundle\.js$/, '.js') ) )
          .pipe( duration( 'bundled "' + file.path + '"' ) )
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
      }
      br.on( 'update', _bundle );
      return _bundle();
    } ) )
  ;
  return stream;
} ) )
;

gulp.task( 'sprite', () => {
  const
    self = tasks.sprite
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
    .pipe( gulp.dest( dist + '/img' ) )
  ;
  cSSStream = spriteData
    .css
    .pipe( gulp.dest( src + '/css') )
  ;
  return mergeStream( imgStream, cSSStream );
} )
;

gulp.task( 'js:eslint', () => {
  const
    self = tasks[ 'js:eslint' ]
  ;
  return gulp
    .src( self.src )
    .pipe( plumber( options.plumber ) )
    .pipe( eSLint( options.eSLint ) )
    .pipe( eSLint.format() )
    .pipe( eSLint.failAfterError() )
  ;
} )
;

gulp.task( 'watch', _callWatchTasks );

gulp.task( 'default', _filterDefaultTasks() );

function _pugRender( file, t ) {
  const
    ugliyAElementRegEx = /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg
    ,endCommentRegEx = /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/?[.#].+?)-->/mg
    ,errorHandler = options.plumber.errorHandler
  ;
  let
    contents = ''
  ;
  options.pug.filename = file.path;
  try {
    contents = pug.render( String( file.contents ), options.pug );
  } catch( e ) {
    errorHandler( e );
  }
  if ( options.assistPretty.assistAElement ) {
    contents = contents.replace( ugliyAElementRegEx, function( all, indent, element, linefeed ) {
      element = element
        .replace( '><a ', '>' + linefeed + '<a ' )
        .replace( '</a>', '</a>' + linefeed )        
      ;
      return beautifyHtml( element, options.beautifyHtml ).replace( /^/mg, indent );
    } );
  }
  if ( options.assistPretty.indent === false ) {
    contents = contents.replace( /^([\t ]+)/mg, '' );
  }
  if ( options.assistPretty.commentPosition ) {
    contents = contents.replace( endCommentRegEx, function( all, endTag, lineFeed, indent, comment ) {
      comment = '<!--' + comment + '-->';
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
  file.contents = new global.Buffer.from( contents );
  file.path = file.path.replace( /\.pug$/, '.html');
  return t.through;
}

function _callWatchTasks() {
  Object
    .keys( tasks )
    .forEach( function( key ) {
      var watch = tasks[ key ].watch;
      if ( Array.isArray( watch ) ) {
        gulp.watch( watch, gulp.series( key ) );
      } else if( watch === true ) {
        gulp.watch( tasks[ key ].src, gulp.series( key ) );
      }
    } )
  ;
}

function _filterDefaultTasks() {
  return gulp.parallel( Object
    .keys( tasks )
    .filter( function( key ) {
      return tasks[ key ].default === true;
    } ) )
  ;
}
