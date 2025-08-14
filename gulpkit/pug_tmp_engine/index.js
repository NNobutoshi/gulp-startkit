/**
 * @module pug_tmp_engine
 * @requires node:fs/promises
 * @requires node:path
 * @requires fancy-log
 * @requires xlsx
 * @requires ../utilities/exists.js
 */

import { cwd , argv }                 from 'node:process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path                           from 'node:path';

import fancyLog from 'fancy-log';
import XLSX     from 'xlsx';

import existsFile from '../utilities/exists.js';
import { html }   from '../index.js';

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
  ,FORCED = ( argv[ 3 ] === 'force'  ) ? true : false // 既存の各pug ファイルを刷新するか否か
;

/**
 * Excel のデータを JSON に変換する。
 * @function _run
 * @param {object} workBook - Excel のデータ
 * @returns {object} JSON データ
 */
( async function _run() {
  const workBook       = XLSX.readFile( XLSX_FILE_PATH );
  const jsonDataOrigin = XLSX.utils.sheet_to_json( workBook.Sheets[ XLSX_SHEET_NAME ] );
  const jsonData       = _mapJsonDataByUrl( jsonDataOrigin );
  const dataStrings    = JSON.stringify( jsonData, null, 2 );
  await _writePugDataFile( dataStrings );
  for ( let url in jsonData ) {
    await _createPugFileByDataProps( jsonData[ url ], _createPugFile );
  }
  html();
} )();

/**
 * Pug のデータファイルに書き込む。
 * @private
 * @param {string} content - Pug の設定ファイルの内容
 * @returns {Promise<void>}
 */
async function _writePugDataFile( content ) {
  try {
    await writeFile( DATA_FILE_PATH, content, CHARSET );
    fancyLog( `configured  "${ path.relative( CWD, DATA_FILE_PATH ) }"` );
  } catch ( err ) {
    fancyLog.error( err.stack );
  }
}

/**
 * データ中のurl をkey とするObject を生成する。
 * @private
 * @param {object} data - JSON データ
 * @returns {object} 変換された JSON データ
 */
function _mapJsonDataByUrl( data ) {
  const res = {};
  data.forEach( ( item ) => {
    res[ item.url ] = item;
  } );
  return res;
}

/**
 * JSON データのプロパティを元にPug ファイルを作成する。
 * @private
 * @param {object} props - JSON データのプロパティ
 * @param {function} pugFileCreator - Pug ファイルを作成する関数
 * @returns {Promise<void>}
 */
async function _createPugFileByDataProps( props, pugFileCreator ) {
  let
    siteRootHtmlFilePath         = props.url
    ,siteRootTemplatePugFilePath = props.template
    ,siteRootPugFilePath         = ''
    ,pugFilePath                 = ''
  ;
  const
    templateFilePath = path.join( SRC_DIR, siteRootTemplatePugFilePath )
  ;
  if ( siteRootHtmlFilePath.match( /\/$/ ) ) {
    siteRootPugFilePath = siteRootHtmlFilePath.replace( /\/$/, '/index.pug' );
  }
  if ( siteRootHtmlFilePath.match( /\.html?$/ ) ) {
    siteRootPugFilePath = siteRootHtmlFilePath.replace( /\.html?$/, '.pug' );
  }
  pugFilePath = path.join( SRC_DIR, siteRootPugFilePath );
  try {
    await mkdir( path.dirname( pugFilePath ),{ recursive : true } );
    await pugFileCreator( pugFilePath, templateFilePath );
  } catch ( err ) {
    fancyLog.error( err.stack );
    throw err;
  }
}

/**
 * Pug ファイルを作成する。
 * @private
 * @param {string} pugFilePath - Pug ファイルの絶対パス
 * @param {string} templateFilePath - テンプレートファイルの絶対パス
 * @returns {Promise<void>}
 */
async function _createPugFile( pugFilePath, templateFilePath ) {
  try {
    const exists = await existsFile( pugFilePath );
    if ( exists && FORCED === false ) {
      return;
    }
    const content = await _readTemplateFile( templateFilePath );
    await _writePugFile( pugFilePath, content, exists );
  } catch ( err ) {
    fancyLog.error( err.stack );
    throw err;
  }
}

/**
 * テンプレートファイルを読み込む。
 * @private
 * @param {string} templateFilePath - テンプレートファイルの絶対パス
 * @returns {Promise<string>} テンプレートファイルの内容
 */
async function _readTemplateFile( templateFilePath ) {
  try {
    return await readFile( templateFilePath, CHARSET );
  } catch ( err ) {
    fancyLog.error( err.stack );
    throw err;
  }
}

/**
 * Pug ファイルを書き込む。
 * @private
 * @param {string} content - Pug ファイルの内容
 * @param {string} pugFilePath - Pug ファイルの絶対パス
 * @param {boolean} exists - Pug ファイルが既存か否か
 * @returns {Promise<void>} テンプレートファイルの内容
 */
async function _writePugFile( pugFilePath, content, exists ) {
  try {
    await writeFile( pugFilePath, content, CHARSET );
    if ( exists ) {
      fancyLog( `updated       "${ path.relative( CWD, pugFilePath ) }"` );
    } else {
      fancyLog( `newly created "${ path.relative( CWD, pugFilePath ) }"` );
    }
  } catch ( err ) {
    fancyLog.error( err.stack );
    throw err;
  }
}
