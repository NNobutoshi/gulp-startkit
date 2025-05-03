import { mkdir, readFile           } from 'node:fs/promises';
import { writeFile, existsSync, rm } from 'node:fs';
import { resolve, dirname }          from 'node:path';

const
  FILEPATH  = resolve( process.cwd(), '.last_diff/.diffmap' )
  ,CHARSET = 'utf-8'
  ,DIRNAME  = dirname( FILEPATH )
;

let
  lastDiffData = null
;

/*
 * Git コマンドで得たタスク終了時までの差分リストを環境変数に格納、取得、
 * また、ファイル保存する。
 */

export default  {
  get   : _getLastDiffData,
  set   : _setLastDiffData,
  write : _writeDiffDataToFile,
  reset : _reset,
  delete : _delete,
};

/**
 * 環境変数に格納されている差分ファイルリストを優先して取得。
 * @param {string} name
 * @returns {object} diff data
 */
async function _getLastDiffData() {
  if ( lastDiffData ) {
    return lastDiffData;
  } else if ( existsSync( FILEPATH ) ) {
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
 * モジュールスコープ変数に格納する。
 * @param {string} name
 * @param {object} data
 */
function _setLastDiffData( data ) {
  lastDiffData = data;
}

/**
 * ファイルに書き込み、保存。
 * @returns {Promise}
 */
async function _writeDiffDataToFile() {
  if ( !lastDiffData ) {
    return false;
  }
  if ( !existsSync( DIRNAME ) ) {
    await mkdir( DIRNAME, { recursive : true } )
      .catch( ( err ) => {
        throw err;
      } )
    ;
  }
  writeFile( FILEPATH, JSON.stringify( lastDiffData, null, 2 ), CHARSET, ( err ) => {
    if ( err ) {
      throw err;
    }
  } );
}

function _reset() {
  lastDiffData = null;
}

/**
 * 保存のディレクトリごと削除。
 */
function _delete() {
  rm( DIRNAME, { recursive : true }, ( err ) => {
    if ( err ) {
      throw err;
    }
  } );
}
