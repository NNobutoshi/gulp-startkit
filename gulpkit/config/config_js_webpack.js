/**
 * @memberof module:config
 * @requires node:process
 * @requires node:path
 * @requires webpack
 * @requires terser-webpack-plugin
 * @requires ./common.js
 * @requires ./constants.js
 * @requires ./merge_by_env.js
 * @requires ./get_env_status.js
 */

import { cwd, env } from 'node:process';
import path         from 'node:path';

import webpack      from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { srcDir, distDir, commonOptions } from './common.js';
import { SOURCEMAPS_DIR }                 from './constants.js';
import mergeByEnv                         from './merge_by_env.js';
import getEnvStatus                       from './get_env_status.js';

export { mergedConfig as config, mergedOptions as options };

const
  CWD = cwd()
;
const
  NODE_ENV = env.NODE_ENV
;
const
  DIFF_STATUS = getEnvStatus( env.DIFF_ENABLED )
;
const
  SRC_DIR   = srcDir[ NODE_ENV ]
  ,DIST_DIR = distDir[ NODE_ENV ]
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:js_webpack
 */
const devConfig = {
  src            : [ `${ SRC_DIR }/**/*.{js,json}` ],
  dist           : DIST_DIR,
  base           : SRC_DIR,
  entry          : '.entry.js',
  splitChunks    : '.split.json',
  cacheDirectory : path.resolve( CWD, '.webpack_cache' ),
  webpackConfig  : {
    mode      : NODE_ENV,
    output    : {},
    devtool   : 'source-map',
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
      // 開発環境では差分ビルド用の環境変数で無効と設定されていない限り、'filesystem'を使用。
      type : ( DIFF_STATUS === false ) ? 'memory' : 'filesystem',
    },
    plugins : [
      new webpack.SourceMapDevToolPlugin( {
        filename : SOURCEMAPS_DIR + '/[file].map',
      } ),
    ],
    optimization : {},
  }
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:js_webpack
 */
const prodConfig = {
  webpackConfig : {
    devtool : false,
    cache : {
      // 本番環境では差分ビルド用の環境変数で有効と設定されていない限り、'memory'を使用。
      type : ( DIFF_STATUS === true ) ? 'filesystem' : 'memory',
    },
    plugins : [
      function() {},
    ],
    optimization : {
      minimizer : [
        new TerserPlugin( {
          extractComments : false,
        } ),
      ],
    },
  }
};

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:js_webpack
 */
const devOptions = {
  plumber : commonOptions.plumber,
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:js_webpack
 */
const prodOptions = null;

// 開発環境用の設定をベースにマージする。
const
  mergedConfig   = mergeByEnv( NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;

