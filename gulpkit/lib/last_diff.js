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
 * 環境変数に格納されている差分ファイルリストを優先して取得。
 * @returns {object} - lastDiffData
 */
async function _getLastDiffData() {
  if ( lastDiffData ) {
    return lastDiffData;
  } else if ( await _exists( FILEPATH ) ) {
    try {
      lastDiffData = JSON.parse( await readFile( FILEPATH, CHARSET ) );
    } catch ( err ) {
      throw err;
    }
    return lastDiffData || {};
  } else {
    return lastDiffData = {};
  }
}

/**
 * ファイルの存在を確認する。
 * @param {String} filePath - 差分を情報を書き込むファイルのパス
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
 * モジュールスコープ変数に格納する。
 * @param {string} name
 * @param {object} data
 */
function _setLastDiffData( data ) {
  lastDiffData = data;
}

/**
 * ファイルに書き込み。
 * @returns {Promise}
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
