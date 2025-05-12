import { config, options } from './common.js';
import switchConfig        from './switch.js';
import autoprefixer        from 'autoprefixer';

const
  devConfig = {
    src  : [ config.SRC + '/**/*.scss' ],
    dist : config.DIST,
    base : config.SRC,
    enabledWatch      : config.WATCH_ENABLED,
    enabledCssMqpack  : true,
    enabledSourcemaps : config.SOURCEMAPS_ENABLED,
    sourcemap_dir     : '/' + config.SOURCEMAPS_DIR,
    options   : {
      plumber : options.plumber,
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
      diff : { ...options.diff,
        name : 'css_sass',
      },
      logStreamData : {
        scss : {
          title    : 'css_sass',
          subtitle : 'compiled',
        },
        sourceMaps : {
          title       : 'css_sass:map',
          subtitle    : 'created',
          forEachFile : false,
        },
      },
    },
  }
  ,prodConfig = {
    sourcemapsEnabled : config.SOURCEMAPS_ENABLED,
    options   : {
      sass : {
        outputStyle : 'compressed', // nested, compact, compressed, expanded
      },
    },
  }
;

export default switchConfig( config.NODE_ENV, devConfig, prodConfig );
