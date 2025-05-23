import { src as gulpSrc } from 'gulp';
import plumber from 'gulp-plumber';

import { ESLint } from 'eslint';
import through    from 'through2';
import fancyLog   from 'fancy-log';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import { config, options } from '../config/config_js_eslint.js';

export { js_eslint as default };

/** @module tasks/js_eslint */
/**
 * JavaScriptのLintを実行するタスク。<br>
 * default としてエクスポート。
 * @returns {Object} - Gulp stream
 */
function js_eslint() {
  return gulpSrc( config.src, options.gulplSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( _runEsLint( options.eslint ) )
    .pipe( logStreamData( options.logStreamData ) )
  ;
}

/**
 * ESLint を実行するためのストリーム処理を提供。<br>
 * 各ファイルに対して ESLint を実行し、結果をログに出力する。
 * @param {Object} esLintOptions - ESLint のオプション設定
 * @returns {Stream} - Gulp ストリーム
 */
function _runEsLint( esLintOptions ) {

  /**
   * 各ファイルに対して ESLint を実行。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {string} enc - エンコーディングの種類
   * @param {Function} callback - 実行して処理の完了を伝える
   * @returns {Stream} - Gulp stream
   */
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        const
          eslint = new ESLint( esLintOptions )
          ,results = await eslint.lintText( String( file.contents ) )
          ,formatter = await eslint.loadFormatter( 'stylish' )
          ,filteredResults = ESLint.getErrorResults( results )
          ,resultText = formatter.format( filteredResults )
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
