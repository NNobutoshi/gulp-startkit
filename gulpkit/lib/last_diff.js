/**
 * Git コマンドで得たタスク終了時までの差分データを取得。<br>
 * また、ファイル保存する。
 * @module lib/last_diff
 * @requires node:process
 * @requires node:fs/promises
 * @requires node:path
 * @requires ../utilities/exists.js
 */

import { cwd } from 'node:process';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

import existsFile from '../utilities/exists.js';

const
  FILEPATH = path.resolve( cwd(), '.last_diff/.diffmap' ),
  CHARSET  = 'utf-8'
;
const
  DIRNAME = path.dirname( FILEPATH )
;
let
  lastDiffData = null
;

export default {
  get    : _getLastDiffData,
  set    : _setLastDiffData,
  write  : _writeDiffDataToFile,
  reset  : _reset,
  delete : _delete,
};

/**
 * モジュールスコープ変数に代入されている差分ファイルリスト（object）を優先して取得。<br>
 * 未代入であれば、保存先ファイルから取得。<br>
 * 保存ファイルが存在しなければ、空のobject を返す。
 * @returns {object|Promise<object>} - lastDiffData
 */
async function _getLastDiffData() {
  if ( lastDiffData ) {
    return lastDiffData;
  }
  try {
    if ( await existsFile( FILEPATH ) ) {
      lastDiffData = JSON.parse( await readFile( FILEPATH, CHARSET ) );
    } else {
      lastDiffData = {};
    }
  } catch ( err ) {
    throw err;
  }
  return lastDiffData;
}

/**
 * モジュールスコープ変数に代入する。
 * @param {object} data
 */
function _setLastDiffData( data ) {
  lastDiffData = data;
}

/**
 * ファイルに書き込み。<br>
 * 保存先ディレクトリが存在しなければ作成する。
 * @returns {Promise<void>}
 */
async function _writeDiffDataToFile() {
  if ( !lastDiffData ) {
    throw new Error( 'No data to write.' );
  }
  try {
    if ( await existsFile( DIRNAME ) === false ) {
      await mkdir( DIRNAME, { recursive : true } );
    }
    await writeFile( FILEPATH, JSON.stringify( lastDiffData, null, 2 ), CHARSET );
  } catch ( err ) {
    throw err;
  }
}

/**
 * リセット。
 * @example
 * lastDiffData = null;
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
