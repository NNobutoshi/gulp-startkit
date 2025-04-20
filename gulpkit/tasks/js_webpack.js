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
  compiler = null
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
    .pipe( _webpackCompile() )
  ;
}

/**
 * webpack のコンパイルを実行する。
 * @returns {Object} - Gulp stream
 * @description
 */
function _webpackCompile() {
  const
    regexTarget = config.targetEntry // /\.entry\.js$/
    ,regexShareFileConf = config.shareFileConf // /\.split\.json$/
    ,entries = {}
    ,cacheGroups = {}
  ;

  return through.obj( _collectEntryAndChunks, _runWebpackWithConfig );

  /*
   * chunkのpath やconfig.js の設定からentry や splitChunks を作る。
   */
  async function _collectEntryAndChunks( file, enc, callback ) {
    try {

      /*
       * chunk のpath が、splitChunks用のJSON データであれば、
       * chunk のcontentsを webpackConfig で使かえる形式に変換する。
       */
      if ( regexShareFileConf?.test( file.path ) ) {
        await _createSplitChunks( cacheGroups, file.path );
      }

      /*
       * entry であれば、webpackConfig で使用可能な状態にする。
       */
      if ( regexTarget.test( file.path ) ) {
        const { key, val } = _createEntry( file.path );
        entries[ key ] = val;
      }
      callback();
    } catch ( err ) {
      callback( err );
    }
  }

  /*
   * compiler がまだ無いか、
   * 新たに作ったentreis や splitChunks がWebpackConfig のものと相違があれば、
   * compiler を用意する。
   */
  function _runWebpackWithConfig( callbackForStream ) {
    if (
      compiler === null
      || !isEqual( webpackConfig.entry, entries )
      || !isEqual( webpackConfig.optimization?.splitChunks?.cacheGroups, cacheGroups )
    ) {

      /* 新しく構成された entry や splitChunks が既存のものと異なる場合に config を再構築*/
      mergeWith( webpackConfig, {
        entry : entries,
        output : {
          filename : '[name].js',
          path : resolve( process.cwd(), config.dist ),
        },
        optimization : {
          splitChunks : {
            cacheGroups : cacheGroups,
          }
        }
      } );
      compiler = webpack( webpackConfig );
    }
    _runWebpackCompiler( callbackForStream, compiler );
  }

}

/**
 * Webpack のコンパイルを実行。
 * Gulp のstream で使用するため、callback を受け取る。
 * @param {Function} callbackForStream - Gulp のstream で使用するため、callback を受け取る。
 * @param {object} compiler - webpack のコンパイラ
 */
function _runWebpackCompiler( callbackForStream, compiler ) {
  compiler.run( _callbackForRunWebpackCompiler( callbackForStream ) );
}

/**
 * webpack のコンパイラの実行後のcallback。
 * @param {Function} callbackForStream - Gulp のstream で使用するため、callback を受け取る。
 */
function _callbackForRunWebpackCompiler( callbackForStream ) {
  return ( err, stats ) => {
    if ( err ) {
      return callbackForStream( err );
    }
    if ( stats?.hasErrors?.() ) {
      const errorMessages = stats.toJson().errors.map( ( e ) => e.message );
      return callbackForStream( new Error( errorMessages.join( '\n' ) ) );
    }
    if ( stats ) {
      log( stats.toString( {
        colors : true,
        chunks : false,
        assets : false,
        hash   : true,
        errors : false,
      } ) );
    }
    callbackForStream();
  };
}

/**
 * vendor など、ディレクトリで共通で使用するモジュールは、
 * そのディレクトリ毎で設定が行えるようにする。
 * そのためのJSON data をwebpackConfig で使用可能な状態にする。
 * @param {object} groups - webpackConfig の cacheGroups
 * @param {string} subConfPath - JSON data のpath
 */
async function _createSplitChunks( groups, subConfPath ) {
  const
    contents = await readFile( subConfPath, CHARSET )
    ,subConfObj = JSON.parse( contents )
  ;
  for ( const [ key, value ] of Object.entries( subConfObj ) ) {
    const test = value.test.join( '|' ).replace( /\//g, '[\\\\/]' );
    subConfObj[ key ].test = new RegExp( test );
  }
  mergeWith( groups, subConfObj );
}

/**
 * エントリーパスから Webpack 用の key と val を作成する
 * @param {string} filePath - 対象のファイルパス
 * @returns {{ key: string, val: string }}
 */
function _createEntry( filePath ) {
  const key = relative( config.base, filePath ).replace( config.targetEntry, '' ).replace( /\\/g, '/' );

  let val = relative( process.cwd(), filePath ).replace( /\\/g , '/' );
  val = /^\.?\.\//.test( val ) ? val : './' + val;

  return { key, val };
}
