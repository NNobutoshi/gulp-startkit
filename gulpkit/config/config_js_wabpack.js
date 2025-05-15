import webpack      from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { commonConfig, commonOptions } from './common.js';
import mergeConfForEnv from './merge_conf.js';

export { mergedConf as config, mergedOptions as options };

// 開発環境用。
const devConfig = {
  src            : [ commonConfig.SRC + '/**/*.{js,json}' ],
  dist           : commonConfig.DIST,
  entry          : '.entry.js',
  splitChunks    : '.split.json',
  enabledWatch   : commonConfig.WATCH_ENABLED,
  base           : commonConfig.SRC,
  cacheDirectory : commonConfig.WEBPACK_CACHE_PATH,
  webpackConfig  : {
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
// 本番環境用。
// 開発環境と異なる設定を行う場合に、
// その異なるプロパティ部分だけの同一構造のオブジェクトを代入。
// 同一設定の場合はnull を明示的に代入。
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

// devConf に同じ。
const devOptions = {
  plumber : commonOptions.plumber,
};
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeConfForEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeConfForEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;

