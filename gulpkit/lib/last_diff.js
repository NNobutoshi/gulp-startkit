import { mkdir } from 'node:fs/promises';
import { readFileSync, writeFile, existsSync, rm } from 'node:fs';
import { resolve, dirname } from 'node:path';

const
  FILEPATH  = resolve( process.cwd(), '.last_diff/.diffmap' )
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
  get   : _get,
  set   : _set,
  write : _write,
  reset : _reset,
};

/*
 * 環境変数に格納されている差分ファイルリストを優先して取得。
 */
function _get( name ) {
  if ( diffData ) {
    return diffData[ name ] || {};
  } else if ( existsSync( FILEPATH ) ) {
    diffData = JSON.parse( readFileSync( FILEPATH, 'utf-8' ) );
    return diffData[ name ] || {};
  } else {
    diffData = {};
    return {};
  }
}

/*
 * 環境変数に格納する。
 */
function _set( name, data ) {
  diffData[ name ] = data;
}

/*
 * ファイルに書き込み、保存。
 */
async function _write() {
  if ( !diffData  ) {
    return false;
  }
  if ( !existsSync( DIRNAME ) ) {
    await mkdir( DIRNAME, { recursive: true } )
      .catch( ( error ) => {
        throw error;
      } )
    ;
  }
  writeFile( FILEPATH, JSON.stringify( diffData, null, 2 ), 'utf-8', ( error ) => {
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
