import { mkdir } from 'node:fs/promises';
import { readFileSync, writeFile, existsSync, rm } from 'node:fs';
import { resolve, dirname } from 'node:path';

const
  FILEPATH  = resolve( process.cwd(), '.last_diff/.diffmap' )
  ,DIRNAME  = dirname( FILEPATH )
  ,DATANAME = 'myProjectTasksLastDiff'
;
let
  envData = process.env[ DATANAME ]
;

/*
 * Git コマンドで得たタスク終了時までの差分リストを環境変数に格納、取得、
 * また、ファイル保存する。
 */

export default  {
  get   : _get,
  set   : _set,
  write : _write,
  reset : _reset,
};

/*
 * 環境変数に格納されている差分ファイルリストを優先して取得。
 */
function _get() {
  if ( envData ) {
    return envData;
  } else if ( existsSync( FILEPATH ) ) {
    return JSON.parse( readFileSync( FILEPATH, 'utf-8' ) );
  }
  return {};
}

/*
 * 環境変数に格納する。
 */
function _set( map ) {
  envData = map;
}

/*
 * ファイルに書き込み、保存。
 */
async function _write() {
  if ( !envData  ) {
    return false;
  }
  if ( !existsSync( DIRNAME ) ) {
    await mkdir( DIRNAME, { recursive: true } )
      .catch( ( error ) => {
        throw error;
      } )
    ;
  }
  writeFile( FILEPATH, JSON.stringify( envData, null, 2 ), 'utf-8', ( error ) => {
    if ( error ) {
      throw error;
    }
  } );
}

/*
 * 保存のディレクトリごと削除。
 */
function _reset() {
  rm( DIRNAME, { recursive: true }, ( error ) => {
    if ( error ) {
      throw error;
    }
  } );
}
