import { relative } from 'node:path';

import through  from 'through2';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';

const defaultSettings = {
  onStream     : true,
  forEachFile  : true,
  textColorHex : '#000088',
};

/**
 * Gulp stream のデータをログに出力する。
 * @param {String} title - タスク名などlog 冒頭に表示させたい文字列
 * @param {String} subTitle - 何をしたかを表す文字列
 * @param {Object} options - 色や出力の制限などが設定可能なオプション
 * @returns {Stream} - 処理されたストリーム
 */
export default function logSteamData( title, subTitle, options ) {
  const settings = { ...defaultSettings, ...options };
  let fileCounter = 0;
  // Stream データでは無い場合。
  if ( settings.onStream === false ) {
    fancyLog( chalk.hex( settings.textColorHex )( `${ title } ${ subTitle }` ) );
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
        chalk.hex( settings.textColorHex )( `${ title } ${ subTitle }` )
        + ` ${ relative( process.cwd(), file.path ) }`
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
        chalk.hex( settings.textColorHex )( title )
        + ` ${ fileCounter } files `
        + chalk.hex( settings.textColorHex )( subTitle )
      );
      callback();
    },
  );
}
