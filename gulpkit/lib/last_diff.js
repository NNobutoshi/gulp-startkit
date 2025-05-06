import { mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const
  FILEPATH  = resolve( process.cwd(), '.last_diff/.diffmap' )
  ,CHARSET = 'utf-8'
  ,DIRNAME  = dirname( FILEPATH )
;

let
  lastDiffData = null
;

/**
 * Git コマンドで得たタスク終了時までの差分データを取得。
 * また、ファイル保存する。
 */
export default  {
  get    : _getLastDiffData,
  set    : _setLastDiffData,
  write  : _writeDiffDataToFile,
  reset  : _reset,
  delete : _delete,
};

/**
 * モジュールスコープ変数に代入されている差分ファイルリスト（Object）を優先して取得。
 * 未代入であれば、保存先ファイルから取得。
 * 保存ファイルが存在しなければ、空のObject を返す。
 * @returns {object} - lastDiffData
 */
async function _getLastDiffData() {
  if ( lastDiffData ) {
    return lastDiffData;
  }
  if ( await _exists( FILEPATH ) ) {
    try {
      const fileContent =  await readFile( FILEPATH, CHARSET );
      lastDiffData = JSON.parse( fileContent );
    } catch ( err ) {
      throw err;
    }
  } else {
    lastDiffData = {};
  }
  return lastDiffData;
}

/**
 * ファイルの存在を確認する。
 * @param {String} filePath - 直近の差分情報が書き込まれたファイルのパス
 * @returns {Promise<void>}
 */
async function _exists( filePath ) {
  try {
    await access( filePath );
    return true;
  } catch {
    return false;
  }
}

/**
 * モジュールスコープ変数に代入する。
 * @param {object} data
 */
function _setLastDiffData( data ) {
  lastDiffData = data;
}

/**
 * ファイルに書き込み。
 * @returns {Promise<void>}
 */
async function _writeDiffDataToFile() {
  if ( !lastDiffData ) {
    return false;
  }
  try {
    if ( await _exists( DIRNAME ) ) {
      await mkdir( DIRNAME, { recursive : true } );
    }
    await writeFile( FILEPATH, JSON.stringify( lastDiffData, null, 2 ), CHARSET );
  } catch ( err ) {
    throw err;
  }
}

/**
 * リセット。
 */
function _reset() {
  lastDiffData = null;
}

/**
 * 保存されたディレクトリごと削除。
 */
function _delete() {
  try {
    rm( DIRNAME, { recursive : true } );
  } catch ( err ) {
    throw err;
  }
}
