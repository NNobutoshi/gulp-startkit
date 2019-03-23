/* globals process */

const
  merge         = require('lodash/mergeWith')
  ,autoprefixer = require('autoprefixer')
  ,babelify     = require('babelify')
  ,notify       = require('gulp-notify')
;

const
  settings = {
    dist      : '../html',
    src       : 'src',
    sourcemap : true,
  }
;

let config;

const
  config_dev = {
    'css_sass' : {
      src       : [ settings.src + '/**/*.scss' ],
      watch     : true,
      default   : true,
      cssMqpack : true,
      sourcemap : true,
      options   : {
        del : {
          dist : [ settings.dist + '/**/*.css.map' ],
          options : {
            force : true,
          },
        },
        plumber : {
          errorHandler : notify.onError('Error: <%= error.message %>'),
        },
        postcss : {
          plugins : [ autoprefixer( [ 'last 2 version', 'ie 9', 'ios 7', 'android 4' ] ) ]
        },
        sass : {
          outputStyle : 'compact', // nested, compact, compressed, expanded
          linefeed    : 'lf', // 'crlf', 'lf'
          indentType  : 'space', // 'space', 'tab'
          indentWidth : 2,
        },
      },
    },
    'iconfont' : {
      src     : [ settings.src + '/fonts/*.svg' ],
      watch   : true,
      default : false,
      options : {
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
      },
    },
    'js_bundle' : {
      src       : [ settings.src + '/**/*bundle.js' ],
      watch     : false,
      default   : true,
      uglify    : false,
      sourcemap : true,
      options   : {
        del : {
          dist : [ settings.dist + '/**/*.js.map' ],
          options : {
            force : true,
          },
        },
        plumber : {
          errorHandler : notify.onError('Error: <%= error.message %>'),
        },
        browserify : {
          cache        : {},
          packageCache : {},
          transform    : [ babelify ],
        },
        watchify : {
          poll: true,
        },
        uglify : {
          output : {
            comments : /^!|(@preserve|@cc_on|\( *c *\)|license|copyright)/i,
          },
        },
      },
    },
    'js_eslint' : {
      src : [
        ''  + '*.js',
        ''  + 'gulpkit.js/**/*.js',
        ''  + settings.src + '/**/*.js',
        '!' + settings.src + '/**/_vendor/*.js',
      ],
      watch   : true,
      default : true,
      options : {
        plumber : {
          errorHandler : notify.onError('Error: <%= error.message %>'),
        },
        eSLint : {
          useEslintrc: true,
        },
      },
    },
    'html_pug' : {
      src : [
        ''  + settings.src + '/**/*.pug',
        '!' + settings.src + '/**/_*.pug',
        '!' + settings.src + '/**/_*/**/*.pug',
      ],
      watch   : true,
      default : true,
      options : {
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
        errorHandler : notify.onError('Error: <%= error.message %>'),
        pug : {
          pretty  : true,
          basedir : settings.src,
        },
      },
    },
    'html_pug_partial' : {
      src : [
        ''  + settings.src + '/**/*.pug',
        '!' + settings.src + '/**/_*.pug',
      ],
      watch   : [ settings.src + '/**/_*.pug' ],
      default : true,
    },
    'sprite' : {
      src     : [ settings.src + '/img/_sprite/*.png' ],
      watch   : true,
      default : true,
      options : {
        plumber : {
          errorHandler : notify.onError('Error: <%= error.message %>'),
        },
        sprite : {
          cssName     : '_mixins_sprite.scss',
          imgName     : 'common_sprite.png',
          imgPath     : '../img/common_sprite.png',
          cssFormat   : 'scss',
          padding     : 10,
          cssTemplate : settings.src + '/_templates/scss.template.handlebars',
          cssVarMap   : function ( sprite ) {
            sprite.name = 'sheet-' + sprite.name;
          },
        },
      },
    },
    'watch' : {
      default : true,
      options : {
        watch : {
          usePolling : true
        }
      }
    },
  }
;

const
  config_prod = {
    'css_sass' : {
      watch     : false,
      sourcemap : false,
      options : {
        sass : {
          outputStyle : 'compressed',
        },
      }
    },
    'iconfont' : {
      watch : false,
    },
    'js_bundle' : {
      uglify    : true,
      sourcemap : false,
    },
    'js_eslint' : {
      watch : false,
    },
    'html_pug' : {
      watch : false,
    },
    'html_pug_children' : {
      watch : false,
    },
    'sprite' : {
      watch : false,
    },
    'watch' : {
      default : false,
    },
  }
;

if ( process.env.NODE_ENV === 'production' ) {
  config = merge( {}, config_dev, config_prod );
} else if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ) {
  config = config_dev;
}

module.exports = {
  settings : settings,
  config  : config,
}
;
