import webpack      from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { config, options } from './common.js';
import switchConfig        from './switch.js';

const
  devConfig = {
    src  : [ config.SRC + '/**/*.{js,json}' ],
    dist : config.DIST,
    entry       : '.entry.js',
    splitChunks : '.split.json',
    enabledWatch : config.WATCH_ENABLED,
    base : config.SRC,
    options : {
      plumber : options.plumber,
    },
    cacheDirectory : config.WEBPACK_CACHE_PATH,
    webpackConfig : {
      mode      : config.NODE_ENV,
      output    : {},
      devtool   : ( config.SOURCEMAPS_ENABLED ) ? 'source-map' : false,
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
        type : ( config.DIFF_ENABLED ) ? 'filesystem' : 'memory',
      },
      plugins : [
        new webpack.SourceMapDevToolPlugin( {
          filename : config.SOURCEMAPS_DIR + '/[file].map',
        } ),
      ],
      optimization : {},
    }
  }
  ,prodConfig = {
    webpackConfig : {
      devtool : ( config.SOURCEMAPS_ENABLED ) ? 'source-map' : false,
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
  }
;

export default switchConfig( config.NODE_ENV, devConfig, prodConfig );
