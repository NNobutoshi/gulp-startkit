import webpack      from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { commonConfig, commonOptions } from './common.js';
import switchConfig     from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src  : [ commonConfig.SRC + '/**/*.{js,json}' ],
  dist : commonConfig.DIST,
  entry        : '.entry.js',
  splitChunks  : '.split.json',
  enabledWatch : commonConfig.WATCH_ENABLED,
  base : commonConfig.SRC,
  options : {
  },
  cacheDirectory : commonConfig.WEBPACK_CACHE_PATH,
  webpackConfig : {
    mode      : commonConfig.NODE_ENV,
    output    : {},
    devtool   : ( commonConfig.SOURCEMAPS_ENABLED ) ? 'source-map' : false,
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
      type : ( commonConfig.DIFF_ENABLED ) ? 'filesystem' : 'memory',
    },
    plugins : [
      new webpack.SourceMapDevToolPlugin( {
        filename : commonConfig.SOURCEMAPS_DIR + '/[file].map',
      } ),
    ],
    optimization : {},
  }
};
const prodConfig = {
  webpackConfig : {
    devtool : ( commonConfig.SOURCEMAPS_ENABLED ) ? 'source-map' : false,
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
};

const devOptions = {
  plumber : commonOptions.plumber,
};
const prodOptions = null;

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;

