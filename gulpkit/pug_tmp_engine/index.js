import { cwd , argv }                 from 'node:process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path                           from 'node:path';

import fancyLog from 'fancy-log';
import XLSX     from 'xlsx';

import existsFile from '../utilities/exists.js';
import { html } from '../index.js';

const
  CHARSET               = 'utf-8'
  ,CWD                  = cwd()
  ,SRC_DIR_NAME         = 'src'
  ,PUG_CONFIG_FILE_NAME = '_pug_data.json'
  ,SITE_MAP_FILE_PATH   = argv[ 2 ]
;
const
  SRC_DIR          = path.resolve( CWD, SRC_DIR_NAME )
  ,XLSX_FILE_PATH  = path.resolve( CWD, SITE_MAP_FILE_PATH )
  ,DATA_FILE_PATH  = path.resolve( CWD, path.dirname( SITE_MAP_FILE_PATH ), PUG_CONFIG_FILE_NAME )
  ,XLSX_SHEET_NAME = 'Sheet1'
  ,FORCED = ( argv[ 3 ]?.includes( 'force' ) ) ? true : false // 既存の各pug ファイルを刷新するか否か
;

/**
 * @module pug_tmp_engine
 * @requires node:fs/promises
 * @requires node:path
 * @requires fancy-log
 * @requires xlsx
 * @requires ../utilities/exists.js
 */
/**
 * Excel のデータを JSON に変換する。
 * @function _run
 * @param {object} workBook - Excel のデータ
 * @returns {object} JSON データ
 */
( async function _run() {
  const workBook    = XLSX.readFile( XLSX_FILE_PATH );
  const jSONData    = _xlsxToJson( workBook );
  const dataStrings = JSON.stringify( jSONData, null, 2 );
  await _writePugDataFile( dataStrings );
  for ( let url in jSONData ) {
    await _createPugFileByDataProps( jSONData[ url ], _createPugFile );
  }
  html();
} )();

/**
 * Excel のデータを JSON に変換する。
 * @private
 * @param {object} workBook - Excel のデータ
 * @returns {object} JSON データ
 */
function _xlsxToJson( workBook ) {
  return _reJsonData(
    XLSX.utils.sheet_to_json( workBook.Sheets[ XLSX_SHEET_NAME ] )
  );
}

/**
 * Pug のデータファイルに書き込む。
 * @private
 * @param {string} content - Pug の設定ファイルの内容
 * @param {string} newStrings - 新しい文字列
 * @param {string} indent - インデント
 * @returns {Promise<void>}
 */
async function _writePugDataFile( content ) {
  try {
    await writeFile( DATA_FILE_PATH, content, CHARSET );
    fancyLog( `configed  "${ path.relative( CWD, DATA_FILE_PATH ) }"` );
  } catch ( err ) {
    fancyLog.error( err.stack );
  }
}

/**
 * JSON データを変換する。
 * データ中のurl をkey にするObject に作り変える。
 * @private
 * @param {object} data - JSON データ
 * @returns {object} 変換された JSON データ
 */
function _reJsonData( data ) {
  const res = {};
  data.forEach( ( item ) => {
    res[ item.url ] = item;
  } );
  return res;
}

/**
 * Pug のファイルを作成する。
 * @private
 * @param {object} props - JSON データのプロパティ
 * @param {Function} createPugFile - Pug ファイルを作成する関数
 * @returns {Promise<void>}
 */
async function _createPugFileByDataProps( props, createFile ) {
  let
    url     = props.url
    ,temp   = props.template
    ,pugUrl = ''
  ;
  if ( url.match( /\/$/ ) ) {
    pugUrl = url.replace( /\/$/, '/index.pug' );
  }
  if ( url.match( /\.html?$/ ) ) {
    pugUrl = url.replace( /\.html?$/, '.pug' );
  }
  pugUrl = path.join( SRC_DIR, pugUrl );
  try {
    await mkdir( path.dirname( pugUrl ),{ recursive : true } );
    await createFile( pugUrl, temp );
  } catch ( err ) {
    fancyLog.error( err.stack );
    throw err;
  }
}

/**
 * Pug ファイルを作成する。
 * @private
 * @param {string} pugUrl - Pug ファイルの URL
 * @param {string} template - テンプレート
 * @returns {Promise<void>}
 */
async function _createPugFile( pugUrl, template ) {
  try {
    const exists = await existsFile( pugUrl );
    if ( exists && FORCED === false ) {
      return;
    }
    const content = await _readTemplateFile( template );
    await _writePugFile( content, pugUrl, exists );
  } catch ( err ) {
    fancyLog.error( err.stack );
    throw err;
  }
}

/**
 * テンプレートファイルを読み込む。
 * @private
 * @param {string} template - テンプレートファイルの URL
 * @returns {Promise<string>} テンプレートファイルの内容
 */
async function _readTemplateFile( template ) {
  try {
    return await readFile( path.join( SRC_DIR, template ), CHARSET );
  } catch ( err ) {
    fancyLog.error( err.stack );
    throw err;
  }
}

/**
 * Pug ファイルを書き込む。
 * @private
 * @param {string} content - Pug ファイルの内容
 * @param {string} pugUrl - Pug ファイルの URL
 * @param {boolean} exists - Pug ファイルが既存か否か
 * @returns {Promise<void>} テンプレートファイルの内容
 */
async function _writePugFile( content, pugUrl, exists ) {
  try {
    await writeFile( pugUrl, content, CHARSET );
    if ( exists ) {
      fancyLog( `Updated       "${ path.relative( CWD, pugUrl ) }"` );
    } else {
      fancyLog( `newly created "${ path.relative( CWD, pugUrl ) }"` );
    }
  } catch ( err ) {
    fancyLog.error( err.stack );
    throw err;
  }
}
