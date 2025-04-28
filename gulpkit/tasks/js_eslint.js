import { src } from 'gulp';
import plumber from 'gulp-plumber';

import { ESLint } from 'eslint';
import through    from 'through2';
import fancyLog   from 'fancy-log';

import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import { js_eslint as config } from '../config.js';

const
  LOG_TITLE     = '[js_eslint]:'
  ,LOG_SUBTITLE = 'linted'
;
const
  options = config.options
  ,logOptions = {
    forEachFile : false,
  }
;

/**
 * JavaScriptのLintを実行するタスク。
 * @returns {Object} - Gulp stream
 */
export default function js_eslint() {
  return src( config.src, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( _runEsLint( options.eslint ) )
    .pipe( logStreamData( LOG_TITLE, LOG_SUBTITLE, logOptions ) )
  ;
}

/**
 * ESLint を実行するためのストリーム処理を提供。
 * 各ファイルに対して ESLint を実行し、結果をログに出力する。
 * @param {Object} esLintOptions - ESLint のオプション設定
 * @returns {Stream} - Gulp ストリーム
 */
function _runEsLint( esLintOptions ) {

  /**
   * 各ファイルに対して ESLint を実行。
   * @param {Object} file - 処理対象のファイル (Vinyl オブジェクト)
   * @param {string} enc - エンコーディング
   * @param {Function} callback - 処理完了時に呼び出されるコールバック関数
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
