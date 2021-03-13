const
  fs    = require( 'fs' )
  ,path = require( 'path' )
;
const
  merge         = require( 'lodash/mergeWith' )
  ,webpack      = require( 'webpack' )
  ,log          = require( 'fancy-log' )
  ,chalk        = require( 'chalk' )
  ,TerserPlugin = require( 'terser-webpack-plugin' )
;
const
  NODE_ENV = process.env.NODE_ENV
;
const
  DIR_DEV = {
    dist : 'dist/development/html',
    src  : 'src',
  }
  ,DIR_PROD = {
    dist : 'dist/production/html',
    src  : 'src',
  }
;
const
  SRC                 = ( NODE_ENV === 'production' ) ? DIR_PROD.src : DIR_DEV.src
  ,DIST               = ( NODE_ENV === 'production' ) ? DIR_PROD.dist : DIR_DEV.dist
  ,ENABLE_SOURCEMAP   = ( NODE_ENV === 'production' ) ? false : true
  ,ENABLE_WATCH       = !!JSON.parse( process.env.WATCH_ENV || 'false' )
  ,ENABLE_DIFF        = !!JSON.parse( process.env.DIFF_ENV || 'false' )
  ,SOURCEMAPS_DIR     = 'sourcemaps'
  ,WEBPACK_CACHE_PATH = path.resolve( __dirname, '.webpack_cache' )
  ,ERROR_COLOR_HEX    = '#FF0000'
  ,GIT_DIFF_COMMAND   = `git status -suall gulpkit.js/ ${SRC}/` // タスクごとに違うコマンドは使えない。
;
const
  config_dev = {
    'clean' : {
      command : `git clean -f ${DIST}/`,
      options : {
        del : {
          force : true,
        },
      },
    },
    'css_sass' : {
      src           : [ SRC + '/**/*.scss' ],
      dist          : DIST,
      base          : SRC,
      watch         : true && ENABLE_WATCH,
      cssMqpack     : false,
      sourcemap     : true && ENABLE_SOURCEMAP,
      sourcemap_dir : '/' + SOURCEMAPS_DIR,
      options   : {
        plumber : {
          errorHandler : function( error ) {
            log.error( chalk.hex( ERROR_COLOR_HEX )( error.formatted ) );
            this.emit( 'end' );
          },
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
        diff : {
          name      : 'css_sass',
          command   : GIT_DIFF_COMMAND,
          detection : true && ENABLE_DIFF,
        },
      },
    },
    'css_lint' : {
      src       : [
        ''  + SRC + '/**/*.scss',
        '!' + SRC + '/**/css/_sprite_svg.scss',
        '!' + SRC + '/**/_vendor/*.scss',
        '!' + SRC + '/**/_templates/*.scss',
      ],
      dist      : DIST,
      watch     : true && ENABLE_WATCH,
      options   : {
        plumber : {
          errorHandler : function( error ) {
            log.error( chalk.hex( ERROR_COLOR_HEX )( error ) );
            this.emit( 'end' );
          },
        },
        stylelint : {
          fix            : false,
          failAfterError : true,
          reporters      : [ { formatter: 'string', console: true } ],
          debug          : true,
        },
        diff : {
          name      : 'css_lint',
          command   : GIT_DIFF_COMMAND,
          detection : true && ENABLE_DIFF,
        },
      },
    },
    'icon_font' : {
      src           : [ SRC + '/**/fonts/icons/*.svg' ],
      dist          : DIST,
      group         : '/fonts/icons',
      base          : SRC,
      watch         : true && ENABLE_WATCH,
      fontsDist     : SRC +  '[subdir]/fonts',
      fontsCopyFrom : SRC +  '[subdir]/fonts/*.*',
      fontsCopyTo   : DIST + '[subdir]/fonts',
      options       : {
        iconfont : {
          fontName       : 'icons',
          prependUnicode : true,
          formats        : [ 'ttf', 'eot', 'woff', 'woff2' ],
          normalize      : true,
          startUnicode   : 0xF001,
        },
        iconfontCss : {
          fontName   : 'icons',
          path       : SRC + '/_templates/_icons.scss',
          targetPath : '../css/_icons.scss',
          fontPath   : '../fonts/',
          firstGlyph : 0xF001,
        },
        plumber : {
          errorHandler : function( error ) {
            log.error( chalk.hex( ERROR_COLOR_HEX )( error ) );
            this.emit( 'end' );
          },
        },
        diff : {
          name      : 'icon_font',
          command   : GIT_DIFF_COMMAND,
          detection : true && ENABLE_DIFF,
          allForOne : '/fonts/icons',
        },
      },
    },
    'img_min' : {
      src     : [
        ''  + SRC + '/**/*.{png,jpg,svg}',
        '!' + SRC + '/**/_sprite*/*.{png,svg}',
        '!' + SRC + '/**/fonts/icons/*.{png,svg}',
      ],
      dist    : DIST,
      watch   : true && ENABLE_WATCH,
      options : {
        plumber : {
          errorHandler : function( error ) {
            this.emit( 'end' );
          },
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
        diff : {
          name      : 'img_min',
          command   : GIT_DIFF_COMMAND,
          detection : true && ENABLE_DIFF,
        },
      },
    },
    'js_webpack' : {
      src            : [ SRC + '/**/*.{js,json}' ],
      dist           : DIST,
      targetEntry    : /\.entry\.js$/,
      shareFileConf  : /\.split\.json$/,
      watch          : true && ENABLE_WATCH,
      base           : SRC,
      options        : {
        del : {
          dist    : [ DIST + '/**/*.js.map' ],
          options : {
            force : true,
          },
        },
        plumber : {
          errorHandler : function( error ) {
            log.error( chalk.hex( ERROR_COLOR_HEX )( error ) );
            this.emit( 'end' );
          },
        },
      },
      cacheDirectory : WEBPACK_CACHE_PATH,
      webpackConfig  : {
        mode      : NODE_ENV,
        output    : {},
        devtool   : ( true && ENABLE_SOURCEMAP ) ? 'source-map' : false,
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
        cache : {
          type : ( ENABLE_DIFF ) ? 'filesystem' : 'memory',
        },
        plugins : [
          new webpack.SourceMapDevToolPlugin( {
            filename : SOURCEMAPS_DIR + '/[file].map',
          } ),
        ],
        optimization : {},
        watchOptions : {
          aggregateTimeout : 200,
          poll             : 500,
        },
      }
    },
    'js_eslint' : {
      src : [
        ''  + './gulpkit.js/**/*.js',
        ''  + SRC + '/**/*.js',
        '!' + SRC + '/**/_vendor/*.js',
      ],
      dist    : DIST,
      watch   : true && ENABLE_WATCH,
      options : {
        plumber : {
          errorHandler : function( error ) {
            log.error( chalk.hex( ERROR_COLOR_HEX )( error ) );
            this.emit( 'end' );
          },
        },
        eslint : {
          useEslintrc: true,
        },
        diff : {
          name      : 'js_eslint',
          command   : GIT_DIFF_COMMAND,
          detection : true && ENABLE_DIFF,
        },
      },
    },
    'html_pug' : {
      src     : [ SRC + '/**/*.pug' ],
      dist    : DIST,
      base    : SRC,
      watch   : true && ENABLE_WATCH,
      data    : path.resolve( process.cwd(), `${SRC}/_pug_data.js` ),
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
        pug : {
          pretty  : true,
          basedir : SRC,
        },
        diff : {
          name      : 'html_pug',
          command   : GIT_DIFF_COMMAND,
          detection : true && ENABLE_DIFF,
        },
        plumber : {
          errorHandler : function( error ) {
            log.error( chalk.hex( ERROR_COLOR_HEX )( error ) );
          },
        },
      },
    },
    'sprite' : {
      src      : [ SRC + '/**/img/_sprite/**/*.png' ],
      dist     : DIST,
      base     : SRC,
      group    : '/img/_sprite',
      watch    : true && ENABLE_WATCH,
      imgDist  : DIST + '[subdir]/img',
      scssDist : SRC + '[subdir]/css',
      options : {
        plumber : {
          errorHandler : function( error ) {
            log.error( chalk.hex( ERROR_COLOR_HEX )( error ) );
            this.emit( 'end' );
          },
        },
        sprite : {
          cssName     : '_mixins_sprite.scss',
          imgName     : 'common_pack.png',
          imgPath     : '../img/common_pack.png',
          cssFormat   : 'scss',
          padding     : 10,
          cssTemplate : SRC + '/_templates/scss.template.handlebars',
          cssVarMap   : function( sprite ) {
            sprite.name = 'sheet-' + sprite.name;
          },
        },
        diff : {
          name      : 'sprite',
          command   : GIT_DIFF_COMMAND,
          detection : true && ENABLE_DIFF,
          allForOne : '/img/_sprite',
        },
      },
    },
    'sprite_svg' : {
      src     : [ SRC + '/**/img/_sprite_svg/**/*.svg' ],
      base    : SRC,
      dist    : DIST,
      group   : '/img/_sprite_svg',
      watch   : true && ENABLE_WATCH,
      options :  {
        plumber: {
          errorHandler : function( error ) {
            log.error( chalk.hex( ERROR_COLOR_HEX )( error ) );
            this.emit( 'end' );
          },
        },
        svgSprite : {
          mode  : {
            symbol : {
              dest    : 'img',
              sprite  : 'common_symbols.svg',
              example : {
                dest : '../_sprite_svg_example.html',
              },
            },
            css : {
              dest       : 'css',
              sprite     : '../img/common_sheet.svg',
              prefix     : '.icon_%s',
              dimensions : '_dims',
              bust       : false,
              render     : {
                scss : {
                  dest: path.resolve( process.cwd(), 'css/_sprite_svg.scss' ),
                },
              },
              example: {
                dest: path.resolve( process.cwd(), '_sprite_svg_bg_example.html' ),
              }
            },
          },
          shape : {
            // dimension : {
            //   maxWidth  : 32,
            //   maxHeight : 32,
            // },
            // spacing : {
            //   padding : 10,
            // },
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
          name      : 'sprite_svg',
          command   : GIT_DIFF_COMMAND,
          detection : true && ENABLE_DIFF,
          allForOne : '/img/_sprite_svg',
        },
      },
    },
    'serve' : { enable: false }, // 別途の設定ファイルにて
    'watcher' : {
      options : {
        watch : {
          usePolling : true
        },
      },
    },
  }
;
const
  config_prod = {
    'clean' : {},
    'css_sass' : {
      sourcemap : false || ENABLE_SOURCEMAP,
      options   : {
        sass : {
          outputStyle : 'compressed', // nested, compact, compressed, expanded
        },
      },
    },
    'css_lint' : {},
    'icon_font' : {},
    'img_min' : {},
    'js_webpack' : {
      webpackConfig : {
        devtool : ( false || ENABLE_SOURCEMAP ) ? 'source-map' : false,
        optimization : {
          minimizer : [
            new TerserPlugin( {
              extractComments : false
            } ),
          ],
        },
        plugins: [
          function() {},
        ],
      }
    },
    'js_eslint' : {},
    'html_pug' : {},
    'sprite' : {},
    'sprite_svg' : {
      options : {
        svgSprite : {
          mode  : {
            symbol : {
              example : false,
            },
            css : {
              example : false,
            },
          },
        },
      },
    },
    'serve' : {}, // 別途の設定ファイルにて
    'watcher' : {},
  }
;

// config_serve.js が存在すれば、設定を上書き。
// config_serve.js 自体はGit でignore している。
// 実装者毎で設定を自由にさせるため。
if ( fs.existsSync( path.resolve( __dirname, './config_serve.js' ) ) ) {
  config_dev.serve = require( './config_serve.js' ).conf_dev;
  config_prod.serve = require( './config_serve.js' ).conf_prod;
}

// 'production'用の設定は、'development' を基準にしてマージする
switch ( NODE_ENV ) {
case 'production':
  module.exports = merge( {}, config_dev, config_prod );
  break;
case 'development':
default:
  module.exports = config_dev;
}
