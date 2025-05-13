import { commonConfig, commonOptions } from './common.js';
import switchConfig        from './switch.js';
import autoprefixer        from 'autoprefixer';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src  : [ commonConfig.SRC + '/**/*.scss' ],
  dist : commonConfig.DIST,
  base : commonConfig.SRC,
  enabledWatch      : commonConfig.WATCH_ENABLED,
  enabledCssMqpack  : true,
  enabledSourcemaps : commonConfig.SOURCEMAPS_ENABLED,
  sourcemap_dir     : '/' + commonConfig.SOURCEMAPS_DIR,
  options   : {
  },
};
const prodConfig = {
  sourcemapsEnabled : commonConfig.SOURCEMAPS_ENABLED,
};

const devOptions = {
  plumber : commonOptions.plumber,
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
  diff : { ...commonOptions.diff,
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
};
const prodOptions = {
  sass : {
    outputStyle : 'compressed', // nested, compact, compressed, expanded
  },
};

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;
