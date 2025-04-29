import { mkdir, readFile           } from 'node:fs/promises';
import { writeFile, existsSync, rm } from 'node:fs';
import { resolve, dirname }          from 'node:path';

const
  FILEPATH  = resolve( process.cwd(), '.last_diff/.diffmap' )
  ,CHARSET = 'utf-8'
  ,DIRNAME  = dirname( FILEPATH )
;

let
  diffData
;

/*
 * Git コマンドで得たタスク終了時までの差分リストを環境変数に格納、取得、
 * また、ファイル保存する。
 */

export default  {
  get   : _getDiffData,
  set   : _setDiffData,
  write : _writeDiffDataToFile,
  reset : _reset,
};

/**
 * 環境変数に格納されている差分ファイルリストを優先して取得。
 * @param {string} name
 * @returns {object} diff data
 */
async function _getDiffData( name ) {
  if ( diffData ) {
    return diffData[ name ] || {};
  } else if ( existsSync( FILEPATH ) ) {
    try {
      diffData = JSON.parse( await readFile( FILEPATH, CHARSET ) );
    } catch ( err ) {
      throw err;
    }
    return diffData[ name ] || {};
  } else {
    diffData = {};
    return {};
  }
}

/**
 * 環境変数に格納する。
 * @param {string} name
 * @param {object} data
 */
function _setDiffData( name, data ) {
  diffData[ name ] = data;
}

/**
 * ファイルに書き込み、保存。
 * @returns {Promise}
 */
async function _writeDiffDataToFile() {
  if ( !diffData  ) {
    return false;
  }
  if ( !existsSync( DIRNAME ) ) {
    await mkdir( DIRNAME, { recursive : true } )
      .catch( ( err ) => {
        throw err;
      } )
    ;
  }
  writeFile( FILEPATH, JSON.stringify( diffData, null, 2 ), 'utf-8', ( err ) => {
    if ( err ) {
      throw err;
    }
  } );
}

/**
 * 保存のディレクトリごと削除。
 */
function _reset() {
  rm( DIRNAME, { recursive : true }, ( err ) => {
    if ( err ) {
      throw err;
    }
  } );
}
