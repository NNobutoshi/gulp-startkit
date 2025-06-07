import { cwd } from 'node:process';
import path    from 'node:path';

import through  from 'through2';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';

export { logSteamData as default };

/**
 * @module lib/log_stream_data
 * @requires node:process
 * @requires node:path
 * @requires through2
 * @requires fancy-log
 * @requires chalk
 */
const
  CWD = cwd()
;
const defaultSettings = {
  onStream     : true,
  forEachFile  : true,
  textColorHex : '#000088',
};

/**
 * Gulp stream のデータをログに出力する。
 * @param {object} options - 色や出力の制限などが設定可能なオプション
 * @returns {Stream} - 処理されたストリーム
 */
function logSteamData( options ) {
  const
    settings = { ...defaultSettings, ...options }
  ;
  const
    title = settings.title
    ,subtitle = settings.subtitle
  ;
  let fileCounter = 0;
  // Stream データでは無い場合。
  if ( settings.onStream === false ) {
    fancyLog( chalk.hex( settings.textColorHex )( `[${ title }]: ${ subtitle }` ) );
    return;
  }
  return through.obj(
    function _transform( file, enc, callback ) {
      fileCounter += 1;
      // ファイルが何をされたかfile 毎の出力が必要ない場合。
      if ( settings.forEachFile === false ) {
        callback( null, file );
        return;
      }
      // ファイルが何をされたかfile 毎の出力が必要な場合。
      fancyLog(
        chalk.hex( settings.textColorHex )( `[${ title }]: ${ subtitle }` )
        + ` ${ path.relative( CWD, file.path ) }`
      );
      callback( null, file );
    },
    function _flush( callback ) {
      if ( fileCounter === 0 ) {
        callback();
        return;
      }
      // いくつのファイルが何をされたかを出力。
      fancyLog(
        chalk.hex( settings.textColorHex )( `[${ title }]:` )
        + ` ${ fileCounter } files `
        + chalk.hex( settings.textColorHex )( subtitle )
      );
      callback();
    },
  );
}
