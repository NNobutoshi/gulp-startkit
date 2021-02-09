const
  merge         = require( 'lodash/mergeWith' )
  ,notify       = require( 'gulp-notify' )
  ,fs           = require( 'fs' )
  ,path         = require( 'path' )
  ,webpack      = require( 'webpack' )
  ,TerserPlugin = require( 'terser-webpack-plugin' )
;
const
  NODE_ENV = process.env.NODE_ENV
;
const
  DIR_DEV = {
    dist : '../dist/development/html',
    src  : '../src',
  }
  ,DIR_PROD = {
    dist : '../dist/production/html',
    src  : 'src',
  }
  ,ENABLE_SOURCEMAP_DEV = true
  ,ENABLE_SOURCEMAP_PROD = false
  ,ENABLE_WATCH = !!JSON.parse( process.env.WATCH_ENV || 'false' )
  ,SOURCEMAPS_DIR = 'sourcemaps'
;

const
  config_dev = {
    'clean' : {
      dist : [
        DIR_DEV.dist
      ],
      options : {
        del : {
          force : true,
        },
      },
    },
    'css_sass' : {
      src           : [ DIR_DEV.src + '/**/*.scss' ],
      dist          : DIR_DEV.dist,
      base          : DIR_DEV.src,
      watch         : true && ENABLE_WATCH,
      cssMqpack     : false,
      sourcemap     : true && ENABLE_SOURCEMAP_DEV,
      sourcemap_dir : '/' + SOURCEMAPS_DIR,
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
        diff : { hash : 'css_sass' },
      },
    },
    'css_lint' : {
      src       : [
        ''  + DIR_DEV.src + '/**/*.scss',
        '!' + DIR_DEV.src + '/css/_sprite_vector.scss',
        '!' + DIR_DEV.src + '/**/_vendor/*.scss',
        '!' + DIR_DEV.src + '/**/_templates/*.scss',
      ],
      dist      : DIR_DEV.dist,
      watch     : true && ENABLE_WATCH,
      options   : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        stylelint : {
          fix            : false,
          failAfterError : true,
          reporters      : [ { formatter: 'string', console: true } ],
          debug          : true,
        },
        diff : { hash : 'css_lint' },
      },
    },
    'icon_font' : {
      src           : [ DIR_DEV.src + '/fonts/*.svg' ],
      dist          : DIR_DEV.dist,
      watch         : true && ENABLE_WATCH,
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
        diff : {
          hash      : 'icon_font',
          allForOne : true,
        },
      },
    },
    'img_min' : {
      src     : [
        ''  + DIR_DEV.src + '/**/*.{png,jpg,svg}',
        '!' + DIR_DEV.src + '/**/_sprite*/*.{png,svg}',
      ],
      dist    : DIR_DEV.dist,
      watch   : true && ENABLE_WATCH,
      options : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        imageminMozjpeg : {
          quality : 90,
        },
        imageminPngquant : {
          quality : [ 0.8, 0.9 ],
        },
        svgo : {
          plugins : [
            { removeViewBox : false },
            { cleanupIDs : true },
          ],
        },
        diff : { hash : 'img_min' },
      },
    },
    'js_webpack' : {
      src            : [ DIR_DEV.src + '/**/*.entry.js' ],
      base           : DIR_DEV.src,
      dist           : DIR_DEV.dist,
      options        : {
        del          : {
          dist    : [ DIR_DEV.dist + '/**/*.js.map' ],
          options : {
            force : true,
          },
        },
        errorHandler : notify.onError( 'Error: <%= error.message %>' ),
      },
      webpackConfig  : {
        mode      : 'development',
        output    : {},
        devtool   : ( true && ENABLE_SOURCEMAP_DEV ) ? 'source-map' : false,
        module    : {
          rules : [
            {
              test    : /\.js$/,
              exclude : /node_modules/,
              use     : [
                {
                  loader  : 'babel-loader',
                  options : {
                    presets : [ '@babel/preset-env' ]
                  },
                },
              ],
            },
          ],
        },
        externals : {
          'ua-parser-js' : 'UaParser',
          'jquery'       : 'jQuery',
        },
        cache: {
          type           : 'filesystem',
          cacheDirectory : path.resolve( __dirname, '../../../.webpack_cache' ),
        },
        watch   : true && ENABLE_WATCH,
        plugins : [
          new webpack.SourceMapDevToolPlugin( {
            filename : SOURCEMAPS_DIR + '/[file].map',
          } ),
        ],
        watchOptions : {
          aggregateTimeout : 200,
          poll             : 500,
        },
      }
    },
    'js_lint' : {
      src : [
        ''  + '*.js',
        ''  + 'gulpkit.js/**/*.js',
        ''  + DIR_DEV.src + '/**/*.js',
        '!' + DIR_DEV.src + '/**/_vendor/*.js',
      ],
      dist    : DIR_DEV.dist,
      watch   : true && ENABLE_WATCH,
      options : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        eslint : {
          useEslintrc: true,
        },
        diff : { hash : 'js_lint' },
      },
    },
    'html_pug' : {
      src : [
        ''  + DIR_DEV.src + '/**/*.pug',
        // '!' + DIR_DEV.src + '/**/_*.pug',
        // '!' + DIR_DEV.src + '/**/_*/**/*.pug',
      ],
      dist    : DIR_DEV.dist,
      base    : DIR_DEV.src,
      watch   : true && ENABLE_WATCH,
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
        diff : { hash : 'html_pug' },
      },
    },
    'sprite' : {
      src      : [ DIR_DEV.src + '/img/_sprite/*.png' ],
      dist     : DIR_DEV.dist,
      watch    : true && ENABLE_WATCH,
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
        diff : {
          hash      : 'sprite',
          allForOne : true,
        },
      },
    },
    'sprite_svg': {
      src   : [ DIR_DEV.src + '/img/_sprite_svg/*.svg' ],
      base  : DIR_DEV.src,
      dist  : DIR_DEV.dist,
      watch : true && ENABLE_WATCH,
      options :  {
        svgSprite : {
          mode  : {
            symbol : {
              dest    : 'img',
              sprite  : 'common_symbols.svg',
              example : {
                dest : '../examples/sprite_svg_symbols.html',
              },
            },
            css : {
              dest       : 'css',
              sprite     : '../img/common_sheet.svg',
              prefix     : '.icon_%s',
              dimensions : '_dims',
              render     : {
                scss : {
                  dest: path.resolve( process.cwd(), 'css/_sprite_vector.scss' ),
                },
              },
              example: {
                dest: path.resolve( process.cwd(), 'examples/sprite_svg_bg.html' ),
              }
            },
          },
          shape : {
            // dimension : {
            //   maxWidth  : 32,
            //   maxHeight : 32,
            // },
            spacing : {
              // padding : 10,
            },
            transform : [
              {
                svgo: {
                  plugins : [
                    { removeViewBox : false },
                  ],
                },
              },
            ],
          },
          svg : {
            xmlDeclaration     : false,
            doctypeDeclaration : false,
          },
        },
        diff : {
          hash     : 'sprite_svg',
          allForOne: true,
        },
      },
    },
    'serve' : null, // 別途の設定ファイルにて
    'setup_watch' : {
      errorHandler : notify.onError( 'Error: <%= error.message %>' ),
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
    'clean' : {
      dist : [
        DIR_PROD.dist
      ],
    },
    'css_sass' : {
      dist      : DIR_PROD.dist,
      watch     : false,
      sourcemap : false || ENABLE_SOURCEMAP_PROD,
      options   : {
        sass : {
          outputStyle : 'compressed', // nested, compact, compressed, expanded
        },
        diff : { hash : '' },
      },
    },
    'css_lint' : {
      dist    : DIR_PROD.dist,
      watch   : false,
      options : {
        diff : { hash : '' },
      },
    },
    'icon_font' : {
      dist        : DIR_PROD.dist,
      watch       : false,
      fontsCopyTo : DIR_PROD.dist + '/fonts/icons',
      options : {
        diff : {
          hash      : '',
          allForOne : false,
        },
      },
    },
    'img_min' : {
      dist    : DIR_PROD.dist,
      watch   : false,
      options : {
        diff : { hash : '' },
      },
    },
    'js_webpack' : {
      dist       : DIR_PROD.dist,
      webpackConfig : {
        mode    : 'production',
        devtool : ( false || ENABLE_SOURCEMAP_PROD ) ? 'source-map' : false,
        optimization : {
          minimizer : [ new TerserPlugin( { extractComments : false } ) ],
        },
        plugins: [
          function() {},
        ],
      }
    },
    'js_lint' : {
      dist  : DIR_PROD.dist,
      watch : false,
      options : {
        diff : { hash : '' },
      },
    },
    'html_pug' : {
      dist    : DIR_PROD.dist,
      watch   : false,
      options : {
        diff : { hash : '' },
      },
    },
    'sprite' : {
      dist    : DIR_PROD.dist,
      watch   : false,
      options : {
        diff : {
          hash      : '',
          allForOne : false,
        },
      },
    },
    'sprite_svg' : {
      dist  : DIR_PROD.dist,
      watch: false,
      options : {
        diff : {
          hash      : '',
          allForOne : false,
        },
      },
    },
    'serve' : null, // 別途の設定ファイルにて
    'setup_watch' : {},
  }
;
// config_serve_orig.js がconfig_serve.js にリネーム、複製されていれば、、
// config_serve.js 自体はGit でignore されている。
// 作業者毎でip アドレス等を自由に設定させるため。
if ( fs.existsSync( './gulpfile.js/config_serve.js' ) ) {
  config_dev.serve = require( './config_serve' ).conf_dev;
  config_prod.serve = require( './config_serve' ).conf_prod;
}

// 'production'用の設定は、'development' を基準にしてマージする
switch ( NODE_ENV ) {
case 'production':
  let m;
  module.exports = m = merge( {}, config_dev, config_prod );
  console.info( m.js_webpack );
  break;
case 'development':
default:
  module.exports = config_dev;
}
