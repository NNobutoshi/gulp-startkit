import { cwd }      from 'node:process';
import path         from 'node:path';
import { readFile } from 'node:fs/promises';

import { src as gulpSrc } from 'gulp';
import plumber   from 'gulp-plumber';
import webpack   from 'webpack';
import fancyLog  from 'fancy-log';
import through   from 'through2';
import merge     from 'lodash/merge.js';
import isEqual   from 'lodash/isEqual.js';

import { config, options } from '../config/config_js_webpack.js';

export { js_webpack as default };

const
  CHARSET = 'utf-8'
  ,CWD    = cwd()
;
let
  webpackCompiler = null
  ,webpackConfig = config.webpackConfig
;

/**
 * @module tasks/js_webpack
 * @requires node:process
 * @requires node:path
 * @requires node:fs/promises
 * @requires gulp
 * @requires gulp-plumber
 * @requires webpack
 * @requires fancy-log
 * @requires through2
 * @requires lodash/merge.js
 * @requires lodash/isEqual.js
 * @requires ../config/config_js_webpack.js
 * @requires ../lib/diff_build.js
 * @requires ../lib/log_stream_data.js
 * @requires ../lib/prepare_webpack_config.js
 * @requires ../lib/webpack_config.js
 * @description
 * cache 機能や差分ビルド機能は、Webpack の備えているものを。<br>
 * watch はGulpのものを使用。<br>
 * entry や splitChunks をGulp.src() 後にvinylオブジェクトが通ってくるごとに作成し、<br>
 * 既存の webpackConfigと 比較して差異があればwebpackConfig を再構築する。
 */

/**
 * config.js 側で'filesystem' の指定があれば、cacheDirectory をここで指定。<br>
 * 'memory' が指定されているとcacheDirectory をそのままにしておけないため。
 */
if ( webpackConfig.cache?.type === 'filesystem' ) {
  webpackConfig.cache.cacheDirectory = config.cacheDirectory;
}

/**
 * webpack のコンパイルを実行するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/js_webpack
 * @returns {Stream} - Gulp ストリーム
 */
function js_webpack() {
  return gulpSrc( config.src, { read : false } )
    .pipe( plumber( options.plumber ) )
    .pipe( _runWebPack() )
  ;
}

/**
 * webpackConfig ファイルをストリームのファイル（vinyl オブジェクト）情報を元に整形して備え、<br>
 * webpack を実行する。
 * @private
 * @returns {Stream} - Gulp ストリーム
 */
function _runWebPack() {
  const
    entries = {}
    ,splitChunksGroups = {}
    ,splitChunksFileNamePattern = config.splitChunks
    ,entryFileNamePattern = config.entry
  ;
  return through.obj( _transform, _flush );
  async function _transform( file, enc, callback ) {
    try  {
      const filePath = file.path;
      // chunk のpath が、splitChunks用のJSON データであれば。
      if ( filePath.endsWith( splitChunksFileNamePattern ) === true ) {
        await _createSplitChunks( filePath, splitChunksGroups );
      }
      // entry ファイルであれば。
      if ( filePath.endsWith( entryFileNamePattern ) === true ) {
        _createEntries( filePath, entries );
      }
      callback();
    } catch ( err ) {
      callback( err );
    }
  }
  function _flush( callback ) {
    _setUpWebpackCompiler( splitChunksGroups, entries );
    _runWebpackCompiler( callback );
  }
}

/**
 * vendor など、ディレクトリで共通で使用するモジュールは、そのディレクトリごとで設定が行えるようにする。<br>
 * そのためのJSON data をwebpackConfig で使用可能な状態にする。
 * @private
 * @param {object} splitChunksGroups - webpackConfig の cacheGroups
 * @param {string} chunkConfigPath - JSON data のpath
 * @returns {Promise<void>}
 */
async function _createSplitChunks( chunkConfigPath, splitChunksGroups ) {
  const chunkConfig = JSON.parse( await readFile( chunkConfigPath, CHARSET ) );
  for ( const [ key, value ] of Object.entries( chunkConfig ) ) {
    const test = value.test.join( '|' ).replace( /\//g, '[\\\\/]' );
    chunkConfig[ key ].test = new RegExp( test );
  }
  merge( splitChunksGroups, chunkConfig );
}

/**
 * weblackConfig のentry プロパティで有効な値を作成する。
 * @private
 * @param {object} file - 処理対象のファイル (Vinyl オブジェクト)
 * @param {object} entries
 */
async function _createEntries( filePath, entries ) {
  const { entryName, relativeEntryPath } = _getEntriesKeyValue( filePath );
  entries[ entryName ] = relativeEntryPath;
}

/**
 * webpackCompiler がまだ無いか、新たに作ったentreis や splitChunks がWebpackConfig のそれと差異があれば、<br>
 * 新たなwebpackConfig でwebpackCompiler を初期化する。
 * @private
 * @param {object} splitChunksGroups
 * @param {object} entries
 */
function _setUpWebpackCompiler( splitChunksGroups, entries ) {
  if (
    webpackCompiler === null
      || !isEqual( webpackConfig.entry, entries )
      || !isEqual( webpackConfig.optimization?.splitChunks?.cacheGroups, splitChunksGroups )
  ) {
    // 新しく構成された entry や splitChunks が既存のものと異なる場合、マージする。
    webpackConfig.entry = entries;
    merge( webpackConfig.output, {
      filename : '[name].js',
      path : path.resolve( CWD, config.dist ),
    } );
    merge( webpackConfig.optimization, {
      splitChunks : {
        cacheGroups : splitChunksGroups,
      }
    } );
    webpackCompiler = webpack( webpackConfig );
  }
}

/**
 * webpack のコンパイルを実行する。
 * @private
 * @param {Function} callback - Gulp stream のコールバック
 */
function _runWebpackCompiler( callback ) {
  webpackCompiler.run( ( err, stats ) => {
    if ( err ) {
      return callback( err );
    }
    if ( stats?.hasErrors?.() ) {
      const messages = stats.toJson().errors.map( e => e.message );
      return callback( new Error( messages.join( '\n' ) ) );
    }
    if ( stats ) {
      fancyLog( stats.toString( {
        colors : true,
        chunks : false,
        assets : false,
        hash   : true,
        errors : false,
      } ) );
    }
    callback();
  } );
}

/**
 * エントリーパスから Webpack 用の key と val を作成する
 * @private
 * @param {string} filePath - 対象のファイルパス
 * @returns {{ entryName: string, relativeEntryPath: string }}
 */
function _getEntriesKeyValue( filePath ) {
  const
    entryName = path
      .relative( config.base, filePath )
      .replace( config.entry, '' )
      .replace( /\\/g, '/' )
  ;
  let
    relativeEntryPath = path
      .relative( CWD, filePath )
      .replace( /\\/g , '/' )
  ;
  relativeEntryPath = /^\.?\.\//.test( relativeEntryPath )
    ? relativeEntryPath
    : './' + relativeEntryPath
  ;
  return { entryName, relativeEntryPath };
}
