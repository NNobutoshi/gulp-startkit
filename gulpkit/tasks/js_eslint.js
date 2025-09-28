/**
 * @module tasks/js_eslint
 * @requires gulp
 * @requires gulp-plumber
 * @requires eslint
 * @requires through2
 * @requires fancy-log
 * @requires ../lib/diff_build.js
 * @requires ../lib/log_stream_data.js
 * @requires ../lib/watch_task.js
 * @requires ../config/config_js_eslint.js
 */

import { src as gulpSrc } from 'gulp';
import plumber from 'gulp-plumber';

import { ESLint } from 'eslint';
import through    from 'through2';
import fancyLog   from 'fancy-log';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';
import watchTask     from '../lib/watch_task.js';

import { config, options } from '../config/config_js_eslint.js';

export { js_eslint as default };

/**
 * JavaScriptのLintを実行するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/js_eslint
 * @returns {Stream} - Gulp ストリーム
 */
function js_eslint() {
  return gulpSrc( config.src, options.gulpSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( _runEsLint( options.eslint ) )
    .pipe( logStreamData( options.logStreamData ) )
  ;
}

if ( options.watch.enabled === true ) {
  watchTask( config.src, options.watch, js_eslint );
}

/**
 * ESLint を実行するためのストリーム処理を提供。<br>
 * 各ファイルに対して ESLint を実行し、結果をログに出力する。
 * @private
 * @param {object} esLintOptions - ESLint のオプション設定
 * @returns {Stream} - Gulp ストリーム
 */
function _runEsLint( esLintOptions ) {

  /**
   * 各ファイルに対して ESLint を実行。
   * @param {object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {string} enc - エンコーディングの種類
   * @param {function} callback - 実行して処理の完了を伝える
   * @returns {Stream} - Gulp ストリーム
   */
  return through.obj( async function _transform( file, enc, callback ) {
    try {
      const
        eslint = new ESLint( esLintOptions )
      ;
      const
        results    = await eslint.lintText( file.contents.toString() )
        ,formatter = await eslint.loadFormatter( 'stylish' )
      ;
      const
        filteredResults = ESLint.getErrorResults( results )
      ;
      const
        resultText = formatter.format( filteredResults )
      ;
      if ( resultText ) {
        fancyLog( resultText.replace( '<text>', file.path ) );
      }
      callback( null, file );
    } catch ( err ) {
      callback( err );
    }
  }
  );
}
