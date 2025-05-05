import { resolve } from 'node:path';

import merge        from 'lodash/mergeWith.js';
import webpack      from 'webpack';
import log          from 'fancy-log';
import chalk        from 'chalk';
import TerserPlugin from 'terser-webpack-plugin';
import autoprefixer from 'autoprefixer';

const
  NODE_ENV        = process.env.NODE_ENV
  ,WATCH_ENV      = process.env.WATCH_ENV
  ,DIFF_ENV       = process.env.DIFF_ENV
  ,IS_PRODUCTION  = ( NODE_ENV === 'production' )
  ,IS_DEVELOPMENT = ( NODE_ENV === 'development' )
;
const
  DIR_SRC =  {
    'production'  : 'src',
    'development' : 'src',
  },
  DIR_DIST = {
    'production'  : 'dist/production/html',
    'development' : 'dist/development/html',
  }
;
const
  SRC                 = DIR_SRC[ NODE_ENV ]
  ,DIST               = DIR_DIST[ NODE_ENV ]
  ,SOURCEMAPS_ENABLED = IS_DEVELOPMENT || !IS_PRODUCTION
  ,WATCH_ENABLED      = ( WATCH_ENV ) ? !!Number( WATCH_ENV ) : IS_DEVELOPMENT || !IS_PRODUCTION
  ,DIFF_ENABLED       = ( DIFF_ENV )  ? !!Number( DIFF_ENV )  : IS_DEVELOPMENT || !IS_PRODUCTION
  ,SOURCEMAPS_DIR     = 'sourcemaps'
  ,WEBPACK_CACHE_PATH = resolve( process.cwd(), '.webpack_cache' )
  ,ERROR_COLOR_HEX    = '#FF0000'
  ,GIT_DIFF_COMMAND   = `git status -suall gulpkit/ ${ SRC }/`
  ,EVENT_NAME_WATCH_INIT  = 'myWatchInit'
  ,EVENT_NAME_WATCH_START = 'myWatchStart'
;
const
  diffCommonOtions = {
    command  : GIT_DIFF_COMMAND,
    enabled  : DIFF_ENABLED,
    eventNameOnInit  : EVENT_NAME_WATCH_INIT,
    eventNameOnReset : EVENT_NAME_WATCH_START,
  },
  plumberCommonOptions = {
    errorHandler : function( err ) {
      log.error( chalk.hex( ERROR_COLOR_HEX )( err.stack ) );
      this.emit( 'end' );
    },
  }
;
const
  config = {}
;
const
  config_dev = {
    'clean' : {
      command : `git clean -f ${ DIST }/`,
    },
    'copy_to' : {
      src  : [ SRC + '/**/*.{mp4,webm}' ],
      base : SRC,
      dist : DIST,
      enabledWatch : WATCH_ENABLED,
      options : {
        plumber : plumberCommonOptions,
        diff : { ...diffCommonOtions,
          name     : 'copy_to',
          oneToOne : true,
        },
        src : {
          base     : SRC,
          encoding : false,
          read     : !DIFF_ENABLED,
        },
      },
    },
    'css_sass' : {
      src  : [ SRC + '/**/*.scss' ],
      dist : DIST,
      base : SRC,
      enabledWatch      : WATCH_ENABLED,
      enabledCssMqpack  : true,
      enabledSourcemaps : SOURCEMAPS_ENABLED,
      sourcemap_dir     : '/' + SOURCEMAPS_DIR,
      options   : {
        plumber : plumberCommonOptions,
        postcss : {
          plugins : [ autoprefixer() ]
        },
        sass : {
          outputStyle : 'expanded', // nested, compact, compressed, expanded
          linefeed    : 'lf', // 'crlf', 'lf'
          indentType  : 'space', // 'space', 'tab'
          indentWidth : 2,
          silenceDeprecations : [ 'legacy-js-api' ], // Dart Sass 2.0.0 までの間
        },
        diff : { ...diffCommonOtions,
          name : 'css_sass',
        },
      },
    },
    'css_scss_lint' : {
      src : [
        ''  + SRC + '/**/*.scss',
        '!' + SRC + '/**/css/_sprite_svg.scss',
        '!' + SRC + '/**/_vendor/*.scss',
        '!' + SRC + '/**/_templates/*.scss',
      ],
      dist : DIST,
      enabledWatch : WATCH_ENABLED,
      options : {
        plumber : plumberCommonOptions,
        stylelint : {
          fix            : false,
          failAfterError : true,
          reporters      : [ { formatter : 'string', console : true } ],
          debug          : true,
        },
        diff : { ...diffCommonOtions,
          name     : 'css_scss_lint',
          oneToOne : true,
        },
        src : {
          read : !DIFF_ENABLED,
        },
      },
    },
    'html_pug' : {
      src : [
        ''  + SRC + '/**/*.pug',
        ''  + SRC + '/**/*_data.json',
      ],
      imgSrc : [
        ''  + SRC + '/**/*.{png,jpg,svg}',
        '!' + SRC + '/**/_sprite*/*.{png,svg}',
        '!' + SRC + '/**/fonts/icons/*.svg',
      ],
      dist : DIST,
      base : SRC,
      data : resolve( process.cwd(), `${ SRC }/_data/_pug_data.json` ),
      enabledWatch : WATCH_ENABLED,
      options : {
        imgSize : true,
        injectImageSize : {
          imgRegEx : /<(img|source)(.*?)(src|srcset)=(["'])([^"'?]*)(\??[^"'?]*)["'](.*?)>/g,
          enabled  : true,
        },
        formatHtml : {
          repairAElement        : true,
          commentPosition       : 'inside', // inside or outside
          commentOnOneLine      : true,
          blankLineAfterComment : true,
          indent                : true,
          uglyAElementRegEx     : /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg,
          endCommentRegEx       : /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/[.#].+?)-->/mg,
        },
        beautify : {
          indent_size : 2,
          indent_char : ' ',
        },
        pug : {
          pretty  : true,
          basedir : SRC,
        },
        diff : { ...diffCommonOtions,
          name : 'html_pug',
        },
        plumber : plumberCommonOptions,
      },
    },
    'icon_font' : {
      src       : [ SRC + '/**/fonts/icons/*.svg' ],
      base      : SRC,
      dist      : DIST,
      fontsDist : DIST + '[subdir]/fonts',
      scssDist  : SRC  + '[subdir]/css',
      group        : '/fonts/icons',
      fontPath     : '../fonts/',
      scssFileName : '_icons.scss',
      cssClass     : 'icon',
      templatePath : SRC + '/css/_templates/_icons.scss.handlebars',
      enabledWatch : WATCH_ENABLED,
      options : {
        iconfont : {
          fontName       : 'icons[subdir]',
          prependUnicode : false,
          formats        : [ 'ttf', 'eot', 'woff', 'woff2' ],
          normalize      : true,
          fontHeight     : 1001,
          startUnicode   : 0xF001,
        },
        plumber : plumberCommonOptions,
        diff : { ...diffCommonOtions,
          name  : 'icon_font',
          group : '/fonts/icons',
        },
      },
    },
    'img_min' : {
      src : [
        ''  + SRC + '/**/*.{png,jpg,svg}',
        '!' + SRC + '/**/_sprite*/*.{png,svg}',
        '!' + SRC + '/**/fonts/icons/*.svg',
      ],
      dist : DIST,
      enabledWatch : WATCH_ENABLED,
      options : {
        plumber : plumberCommonOptions,
        imageminMozjpeg : {
          quality : 90,
        },
        imageminPngquant : {
          quality : [ 0.8, 0.9 ],
        },
        svgo : {
          plugins : [
            {
              name   : 'removeViewBox',
              active : true,
            },
            {
              name   : 'cleanupIDs',
              active : false,
            },
          ],
        },
        diff : { ...diffCommonOtions,
          name     : 'img_min',
          oneToOne : true,
        },
        src : {
          base     : SRC,
          encoding : false,
          read     : !DIFF_ENABLED,
        },
      },
    },
    'img_sprite' : {
      src   : [ SRC + '/**/img/_sprite/**/*.png' ],
      dist  : DIST,
      base  : SRC,
      group : '/img/_sprite',
      imgDist  : DIST + '[subdir]/img',
      scssDist : SRC + '[subdir]/css',
      enabledWatch : WATCH_ENABLED,
      options : {
        plumber : plumberCommonOptions,
        sprite : {
          cssName     : '_mixins_sprite.scss',
          imgName     : 'common_pack.png',
          imgPath     : '../img/common_pack.png',
          cssFormat   : 'scss',
          padding     : 10,
          cssTemplate : SRC + '/css/_templates/_sprite.scss.handlebars',
          cssVarMap   : function( sprite ) {
            sprite.name = 'sheet-' + sprite.name;
          },
        },
        diff : { ...diffCommonOtions,
          name  : 'img_sprite',
          group : '/img/_sprite',
        },
      },
    },
    'img_sprite_svg' : {
      src   : [ SRC + '/**/img/_sprite_svg/**/*.svg' ],
      base  : SRC,
      dist  : DIST,
      group : '/img/_sprite_svg',
      enabledWatch : WATCH_ENABLED,
      options :  {
        plumber : plumberCommonOptions,
        svgSprite : {
          mode : {
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
                  dest : resolve( process.cwd(), 'css/_sprite_svg.scss' ),
                },
              },
              example : {
                dest : resolve( process.cwd(), '_sprite_svg_bg_example.html' ),
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
                svgo : {
                  plugins : [
                    {
                      name   : 'removeViewBox',
                      active : true,
                    },
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
        svgLint : {
        },
        diff : { ...diffCommonOtions,
          name    : 'img_sprite_svg',
          group   : '/img/_sprite_svg',
        },
      },
    },
    'js_eslint' : {
      src : [
        './gulpkit/**/*.js',
        ''  + SRC + '/**/*.js',
        '!' + SRC + '/**/_vendor/*.js',
      ],
      dist : DIST,
      enabledWatch : WATCH_ENABLED,
      options : {
        plumber : plumberCommonOptions,
        eslint : {
        },
        diff : { ...diffCommonOtions,
          name     : 'js_eslint',
          oneToOne : true,
        },
        src : {
          read : !DIFF_ENABLED,
        },
      },
    },
    'js_webpack' : {
      src  : [ SRC + '/**/*.{js,json}' ],
      dist : DIST,
      entry       : '.entry.js',
      splitChunks : '.split.json',
      enabledWatch : WATCH_ENABLED,
      base : SRC,
      options : {
        plumber : plumberCommonOptions,
      },
      cacheDirectory : WEBPACK_CACHE_PATH,
      webpackConfig : {
        mode      : NODE_ENV,
        output    : {},
        devtool   : ( SOURCEMAPS_ENABLED ) ? 'source-map' : false,
        module    : {
          rules : [
            {
              test    : /\.js$/,
              exclude : /node_modules/,
              use     : [
                {
                  loader  : 'babel-loader',
                  options : {
                    presets : [
                      [
                        '@babel/preset-env',
                        {
                          useBuiltIns : 'usage',
                          corejs      : 3,
                        },
                      ],
                    ],
                  },
                },
              ], //use
            },
          ], //rules
        }, //module
        cache : {
          type : ( DIFF_ENABLED ) ? 'filesystem' : 'memory',
        },
        plugins : [
          new webpack.SourceMapDevToolPlugin( {
            filename : SOURCEMAPS_DIR + '/[file].map',
          } ),
        ],
        optimization : {},
      }
    },
    'task_watch' : {
      watchInitEventName  : EVENT_NAME_WATCH_INIT,
      watchStartEventName : EVENT_NAME_WATCH_START,
      options : {
        watch : {
          usePolling : true,
        },
      },
    },
  }
;
const
  config_prod = {
    'clean' : {},
    'copy_to' : {},
    'css_sass' : {
      sourcemapsEnabled : SOURCEMAPS_ENABLED,
      options   : {
        sass : {
          outputStyle : 'compressed', // nested, compact, compressed, expanded
        },
      },
    },
    'css_scss_lint' : {},
    'html_pug' : {},
    'icon_font' : {},
    'img_min' : {},
    'img_sprite' : {},
    'img_sprite_svg' : {
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
    'js_eslint' : {},
    'js_webpack' : {
      webpackConfig : {
        devtool : ( SOURCEMAPS_ENABLED ) ? 'source-map' : false,
        optimization : {
          minimizer : [
            new TerserPlugin( {
              extractComments : false,
            } ),
          ],
        },
        plugins : [
          function() {},
        ],
      }
    },
    'task_watch' : {},
  }
;

// 'production'用の設定は、'development' を基準にしてマージする
switch ( NODE_ENV ) {
case 'production':
  merge( config, config_dev, config_prod );
  break;
case 'development':
  merge( config, config_dev );
default:
}

export default config;

export const {
  clean,
  copy_to,
  css_sass,
  css_scss_lint,
  icon_font,
  html_pug,
  img_min,
  img_sprite,
  img_sprite_svg,
  js_eslint,
  js_webpack,
  browse,
  task_watch,
} = config;
