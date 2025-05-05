import { relative, resolve } from 'node:path';
import { readFile }          from 'node:fs/promises';

import { src }   from 'gulp';
import plumber   from 'gulp-plumber';
import webpack   from 'webpack';
import log       from 'fancy-log';
import through   from 'through2';
import mergeWith from 'lodash/mergeWith.js';
import isEqual   from 'lodash/isEqual.js';

import { js_webpack as config } from '../config.js';

const
  CHARSET = 'utf-8'
;
const
  options = config.options
;
let
  webpackCompiler = null
  ,webpackConfig = config.webpackConfig
;

/**
 * cache 機能や差分ビルド機能は、Webpack の備えているものを。
 * watch はGulpのものを使用。
 * entry や splitChunks は、Gulp.src() 後,chumk が通ってくる毎に作成し、
 * 既存の webpackConfigと 比較して差異があれば再代入する。
 */

/**
 * config.js 側で'filesystem' の指定があれば、cacheDirectory をここで指定。
 * 'memory' が指定されているとcacheDirectory をそのままにしておけないため。
 */
if ( webpackConfig.cache?.type === 'filesystem' ) {
  webpackConfig.cache.cacheDirectory = config.cacheDirectory;
}

/**
 * webpack のコンパイルを実行するタスク。
 * @returns {Object} - Gulp stream
 */
export default function js_webpack() {
  return src( config.src, { read : false } )
    .pipe( plumber( options.plumber ) )
    .pipe( _prepareWebpackConfig() )
    .pipe( _runWebpack() )
  ;
}

/**
 * webpack のconfig ファイルをstream のchunk 情報を元に整形し準備する。
 * @returns {Object} - Gulp stream
 */
function _prepareWebpackConfig() {
  const
    entryFileNamePattern = config.entry
    ,splitChunksFileNamePattern = config.splitChunks
    ,entries = {}
    ,splitChunksGroups = {}
  ;
  return through.obj( _transform, _flush );

  /**
   * chunkのpath やconfig.js の設定からentry や splitChunks を作る。
   * @returns {Promise<void>}
   */
  async function _transform( file, enc, callback ) {
    try {
      // chunk のpath が、splitChunks用のJSON データであれば、
      // chunk のcontentsを webpackConfig で使える形式に変換する。
      if ( file.path.endsWith( splitChunksFileNamePattern ) === true ) {
        await _createSplitChunks( splitChunksGroups, file.path );
      }
      // entry ファイルであれば、webpackConfig で使える形式に変換して登録。
      if ( file.path.endsWith( entryFileNamePattern ) === true ) {
        const { entryName, relativeEntryPath } = _createEntry( file.path );
        entries[ entryName ] = relativeEntryPath;
      }
      callback( null, file );
    } catch ( err ) {
      callback( err );
    }
  }

  function _flush( callback ) {
    if (
      webpackCompiler === null
      || !isEqual( webpackConfig.entry, entries )
      || !isEqual( webpackConfig.optimization?.splitChunks?.cacheGroups, splitChunksGroups )
    ) {

      // 新しく構成された entry や splitChunks が既存のものと異なる場合、マージする。
      webpackConfig.entry = entries;
      mergeWith( webpackConfig.output, {
        filename : '[name].js',
        path : resolve( process.cwd(), config.dist ),
      } );
      mergeWith( webpackConfig.optimization, {
        splitChunks : {
          cacheGroups : splitChunksGroups,
        }
      } );
      webpackCompiler = webpack( webpackConfig );
    }
    callback();
  }
}

/**
 * webpack のコンパイルを実行する。
 * @returns {Stream} - Gulp stream
 */
function _runWebpack() {
  return through.obj( _noop, _flush );
  function _noop( file, enc, callback ) {
    callback( null, file );
  }

  /**
   * webpackCompiler がまだ無いか、
   * 新たに作ったentreis や splitChunks がWebpackConfig のものと相違があれば、
   * webpackCompiler を用意する。
   * @param {Function} callback - Gulp stream のコールバック
   */
  function _flush( callback ) {
    webpackCompiler.run( ( err, stats ) => {
      if ( err ) {
        return callback( err );
      }
      if ( stats?.hasErrors?.() ) {
        const messages = stats.toJson().errors.map( e => e.message );
        return callback( new Error( messages.join( '\n' ) ) );
      }
      if ( stats ) {
        log( stats.toString( {
          colors : true,
          chunks : false,
          assets : false,
          hash : true,
          errors : false,
        } ) );
      }
      callback();
    } );
  }
}

/**
 * vendor など、ディレクトリで共通で使用するモジュールは、
 * そのディレクトリ毎で設定が行えるようにする。
 * そのためのJSON data をwebpackConfig で使用可能な状態にする。
 * @param {Object} groups - webpackConfig の cacheGroups
 * @param {String} chunkConfigPath - JSON data のpath
 * @returns {Promise<void>}
 */
async function _createSplitChunks( groups, chunkConfigPath ) {
  const
    contents = await readFile( chunkConfigPath, CHARSET )
    ,chunkConfig = JSON.parse( contents )
  ;
  for ( const [ key, value ] of Object.entries( chunkConfig ) ) {
    const test = value.test.join( '|' ).replace( /\//g, '[\\\\/]' );
    chunkConfig[ key ].test = new RegExp( test );
  }
  mergeWith( groups, chunkConfig );
}

/**
 * エントリーパスから Webpack 用の key と val を作成する
 * @param {string} filePath - 対象のファイルパス
 * @returns {{ entryName: string, relativeEntryPath: string }}
 */
function _createEntry( filePath ) {
  const entryName = relative( config.base, filePath ).replace( config.entry, '' ).replace( /\\/g, '/' );

  let relativeEntryPath = relative( process.cwd(), filePath ).replace( /\\/g , '/' );
  relativeEntryPath = /^\.?\.\//.test( relativeEntryPath ) ? relativeEntryPath : './' + relativeEntryPath;

  return { entryName, relativeEntryPath };
}
