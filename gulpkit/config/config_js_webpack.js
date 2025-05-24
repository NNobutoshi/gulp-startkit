import path from 'node:path';

import webpack      from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { commonConfig, commonOptions } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

/**
 * @module config_js_webpack
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */
/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config_js_webpack
 */
const devConfig = {
  src            : [ commonConfig.SRC + '/**/*.{js,json}' ],
  dist           : commonConfig.DIST,
  base           : commonConfig.SRC,
  entry          : '.entry.js',
  splitChunks    : '.split.json',
  enabledWatch   : commonConfig.WATCH_ENABLED,
  cacheDirectory : path.resolve( process.cwd(), '.webpack_cache' ),
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

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_js_webpack
 */
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

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config_js_webpack
 */
const devOptions = {
  plumber : commonOptions.plumber,
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_js_webpack
 */
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;

