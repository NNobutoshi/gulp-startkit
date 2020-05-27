const
  merge   = require( 'lodash/mergeWith' )
  ,notify = require( 'gulp-notify' )
  ,path = require( 'path' )
;

const NODE_ENV = process.env.NODE_ENV;

const
  DIR_DEV = {
    dist : '../html',
    src  : 'src',
  }
  ,DIR_PROD = {
    dist : '../dist',
    src  : 'src',
  }
  ,ENABLE_SOURCEMAP_DEV = true
  ,ENABLE_SOURCEMAP_PROD = false
;

const
  config_dev = {
    'clean': {
      dist : [ DIR_DEV.dist + '/**/*.map' ],
      options : {
        force : true,
      },
    },
    'css_sass' : {
      src       : [ DIR_DEV.src + '/**/*.scss' ],
      dist      : DIR_DEV.dist,
      watch     : true,
      default   : true,
      cssMqpack : false,
      sourcemap : true && ENABLE_SOURCEMAP_DEV,
      options   : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        postcss : {
          plugins : [ require( 'autoprefixer' )() ]
        },
        sass : {
          outputStyle : 'expanded', // nested, compact, compressed, expanded
          linefeed    : 'lf', // 'crlf', 'lf'
          indentType  : 'space', // 'space', 'tab'
          indentWidth : 2,
        },
      },
    },
    'css_lint' : {
      src       : [
        DIR_DEV.src + '/**/*.scss',
        '!' + DIR_DEV.src + '/**/_vendor/*.scss',
        '!' + DIR_DEV.src + '/**/_templates/*.scss',
      ],
      dist      : DIR_DEV.dist,
      watch     : true,
      default   : true,
      options   : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        stylelint: {
          fix: false,
          failAfterError: true,
          reporters: [ { formatter: 'string', console: true } ],
          debug: true,
        }
      }
    },
    'icon_font' : {
      src           : [ DIR_DEV.src + '/fonts/*.svg' ],
      dist          : DIR_DEV.dist,
      watch         : true,
      default       : true,
      timeStampFile      : './gulpkit.js/tasks/.timestamp',
      fontsDist     : DIR_DEV.src + '/fonts',
      fontsCopyFrom : DIR_DEV.src + '/fonts/*',
      fontsCopyTo   : DIR_DEV.dist + '/fonts/icons',
      options       : {
        iconfont : {
          fontName       : 'icons',
          prependUnicode : true,
          formats        : [ 'ttf', 'eot', 'woff' ],
          timestamp      : Math.round( Date.now() / 1000 ),
          normalize      : true,
          startUnicode   : 0xF001,
        },
        iconfontCss : {
          fontName   : 'icons',
          path       : DIR_DEV.src + '/_templates/_icons.scss',
          targetPath : '../css/_icons.scss',
          fontPath   : '../fonts/icons/',
          firstGlyph : 0xF001,
        },
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
      },
    },
    'img_min' : {
      src     : [ DIR_DEV.src + '/**/*.{png,jpg,svg}' ],
      dist    : DIR_DEV.dist,
      watch   : true,
      default : true,
      options : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        imageminMozjpeg : {
          quality: 90
        },
        imageminPngquant : {
          quality: [ 0.8, 0.9 ],
        },
        svgo : {
          plugins: [
            { removeViewBox: false },
            { cleanupIDs: true },
          ],
        },
      }
    },
    'js_webpack' : {
      src       : [ DIR_DEV.src + '/**/*.entry.js' ],
      dist      : DIR_DEV.dist,
      watch     : true,
      default   : true,
      options   : {
        del : {
          dist : [ DIR_DEV.dist + '/**/*.js.map' ],
          options : {
            force : true,
          },
        },
        errorHandler : notify.onError( 'Error: <%= error.message %>' ),
      },
      wbpkConfig: {
        mode: 'development',
        output: {},
        devtool: ( true && ENABLE_SOURCEMAP_DEV ) ? 'source-map' : false,
        resolve: {
          alias: {
            jquery_hub: path.resolve( __dirname, '../src/js/_modules/jquery_hub.js' )
          }
        },
        module: {
          rules: [ {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [ {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                ]
              }
            } ]
          } ]
        },
      }
    },
    'js_webpack_partial': {
      watch : [
        DIR_DEV.src + '/**/_*.js',
        DIR_DEV.src + '/**/_*/**/*.js',
      ],
      default : false,
    },
    'js_lint' : {
      src : [
        ''  + '*.js',
        ''  + 'gulpkit.js/**/*.js',
        ''  + DIR_DEV.src + '/**/*.js',
        '!' + DIR_DEV.src + '/**/_vendor/*.js',
      ],
      dist    : DIR_DEV.dist,
      watch   : true,
      default : true,
      options : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        eslint : {
          useEslintrc: true,
        },
      },
    },
    'html_pug' : {
      src : [
        ''  + DIR_DEV.src + '/**/*.pug',
        '!' + DIR_DEV.src + '/**/_*.pug',
        '!' + DIR_DEV.src + '/**/_*/**/*.pug',
      ],
      dist    : DIR_DEV.dist,
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
        errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        pug : {
          pretty  : true,
          basedir : DIR_DEV.src,
        },
      },
    },
    'html_pug_partial' : {
      watch   : [
        DIR_DEV.src + '/**/_*.pug',
        DIR_DEV.src + '/**/_*/**/*.pug',
      ],
      default : false,
    },
    'sprite' : {
      src      : [ DIR_DEV.src + '/img/_sprite/*.png' ],
      dist     : DIR_DEV.dist,
      watch    : true,
      default  : true,
      imgDist  : DIR_DEV.dist + '/img',
      scssDist : DIR_DEV.src + '/css',
      options  : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        sprite : {
          cssName     : '_mixins_sprite.scss',
          imgName     : 'common_sprite.png',
          imgPath     : '../img/common_sprite.png',
          cssFormat   : 'scss',
          padding     : 10,
          cssTemplate : DIR_DEV.src + '/_templates/scss.template.handlebars',
          cssVarMap   : function( sprite ) {
            sprite.name = 'sheet-' + sprite.name;
          },
        },
      },
    },
    'watch' : {
      default      : true,
      errorHandler : notify.onError( 'Error: <%= error.message %>' ),
      tmspFile     : './gulpkit.js/tasks/.timestamp',
      options : {
        watch : {
          usePolling : true
        },
      }
    },
  }
;

const
  config_prod = {
    'clean': {
      dist : [ DIR_PROD.dist + '/**/*.map' ],
      options : {
        force : true,
      },
    },
    'css_sass' : {
      dist      : DIR_PROD.dist,
      watch     : false,
      sourcemap : false && ENABLE_SOURCEMAP_PROD,
    },
    'css_lint' : {
      dist  : DIR_PROD.dist,
      watch : false,
    },
    'icon_font' : {
      dist     : DIR_PROD.dist,
      watch    : false,
      tmspFile : '',
    },
    'img_min' : {
      dist  : DIR_PROD.dist,
      watch : false,
    },
    'js_webpack' : {
      dist      : DIR_PROD.dist,
      wbpkConfig: {
        mode: 'production',
        devtool: ( false && ENABLE_SOURCEMAP_PROD ) ? 'source-map' : false,
      }
    },
    'js_webpack_partial' : {
    },
    'js_lint' : {
      dist  : DIR_PROD.dist,
      watch : false,
    },
    'html_pug' : {
      dist  : DIR_PROD.dist,
      watch : false,
    },
    'html_pug_partial' : {
      watch : false,
    },
    'sprite' : {
      dist  : DIR_PROD.dist,
      watch : false,
    },
    'watch' : {
      dist    : DIR_PROD.dist,
      default : false,
    },
  }
;

if ( NODE_ENV === 'production' ) {
  module.exports = merge( {}, config_dev, config_prod );
} else if ( !NODE_ENV || NODE_ENV === 'development' ) {
  module.exports = config_dev;
}
