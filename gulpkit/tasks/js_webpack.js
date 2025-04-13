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
  options = config.options
;
let
  compiler = null
  ,webpackConfig = config.webpackConfig
;

/*
 * cache 機能や差分ビルド機能は、Webpack の備えているものを。
 * watch はGulpのものを使用。
 * entry や splitChunks は、Gulp.src() 後,chumk が通ってくる毎に作成し、
 * 既存の webpackConfigと 比較して差異があれば再代入する。
 */

/*
 * config.js 側で'filesystem' の指定があれば、cacheDirectory はここで指定。
 * 'memory' が指定されているとctacheDirectory をそのままにしておけないため。
 */
if ( webpackConfig.cache && webpackConfig.cache.type === 'filesystem' ) {
  webpackConfig.cache.cacheDirectory = config.cacheDirectory;
}

export default function js_webpack() {
  return src( config.src, { read : false } )
    .pipe( plumber( options.plumber ) )
    .pipe( _webpackCompile() )
  ;
}

function _webpackCompile() {
  const
    regexTarget = config.targetEntry // /\.entry\.js$/
    ,regexShareFileConf = config.shareFileConf // /\.split\.json$/
    ,entries = {}
    ,cacheGroups = {}
  ;

  return through.obj( _transform, _flush );

  /*
   * chunkのpath やconfig.js の設定からentry や splitChunks を作る。
   */
  async function _transform( file, enc, callback ) {
    let key, val;

    /*
     * chunk のPath が、splitChunks用のJSON Data であれば、
     * chunk のcontentsを webpackConfig で使用可能な状態にする。
     */
    if ( regexShareFileConf && regexShareFileConf.test( file.path ) ) {
      await _createSplitChunks( cacheGroups, file.path, callback );
    }

    /*
     * entry であれば、webpackConfig で使用可能な状態にする。
     */
    if ( regexTarget.test( file.path ) ) {
      key = relative( config.base, file.path ).replace( regexTarget, '' ).replace( /\\/g, '/' );
      val = relative( process.cwd(), file.path ).replace( /\\/g , '/' );
      val = /^\.?\.\//.test( val ) ? val : './' + val;
      entries[ key ] = val;
    }
    callback();
  }

  /*
   * compiler がまだ無いか、
   * 新たに作ったentreis や splitChunks がWebpackConfig のものと相違があれば、
   * compiler を用意する。
   */
  function _flush( callbackForStream ) {
    if (
      compiler === null
      || !isEqual( webpackConfig.entry, entries )
      || !isEqual( webpackConfig.optimization.splitChunks.cacheGroups, cacheGroups )
    ) {
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

/*
 * Webpack のコンパイルを実行。
 * Gulp のstream で使用するため、callback を受け取る。
 * @param {Function} callbackForStream - Gulp のstream で使用するため、callback を受け取る。
 * @param {object} compiler - webpack のコンパイラ
 */
function _runWebpackCompiler( callbackForStream, compiler ) {
  compiler.run( _callbackForRunWebpackCompiler( callbackForStream ) );
}

/*
* webpack のコンパイラの実行後のcallback。
* @param {Function} callbackForStream - Gulp のstream で使用するため、callback を受け取る。
*/
function _callbackForRunWebpackCompiler( callbackForStream ) {
  return ( error, stats ) => {
    let errorMessages = [];
    if ( error ) {
      return callbackForStream( error );
    }
    if ( stats && stats.hasErrors && stats.hasErrors() ) {
      stats.toJson().errors.forEach( ( item ) => {
        errorMessages.push( item.message );
      } );
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

/*
 * vendor など、ディレクトリで共通で使用するモジュールは、
 * そのディレクトリ毎で設定が行えるようにする。
 * そのためのJSON data をwebpackConfig で使用可能な状態にする。
 * @param {object} groups - webpackConfig の cacheGroups
 * @param {string} subConfPath - JSON data のpath
 * @param {Function} callback - Gulp のstream で使用するため、callback を受け取る。
 */
async function _createSplitChunks( groups, subConfPath, callback ) {
  try {
    const
      contents = await readFile( subConfPath )
      ,subConfObj = JSON.parse( contents )
    ;
    for ( let [ key, value ] of Object.entries( subConfObj ) ) {
      const test = value.test.join( '|' ).replace( /\//g, '[\\\\/]' );
      subConfObj[ key ].test = new RegExp( test );
    }
    mergeWith( groups, subConfObj );
  } catch ( error ) {
    callback( error );
  }
}
