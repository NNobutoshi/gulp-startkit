/**
 * @module pug_tmp_engine
 * @requires node:fs/promises
 * @requires node:path
 * @requires fancy-log
 * @requires chalk
 * @requires xlsx
 * @requires ../utilities/exists.js
 */

import { cwd , argv }                 from 'node:process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path                           from 'node:path';

import fancyLog from 'fancy-log';
import chalk    from 'chalk';
import XLSX     from 'xlsx';

import existsFile from '../utilities/exists.js';
import { html }   from '../index.js';

const
  CHARSET              = 'utf-8',
  CWD                  = cwd(),
  SRC_DIR_NAME         = 'src',
  PUG_CONFIG_FILE_NAME = '_pug_data.json',
  SITE_MAP_FILE_PATH   = argv[ 2 ],
  ERROR_COLOR          = '#FF0000'
;
const
  SRC_DIR         = path.resolve( CWD, SRC_DIR_NAME ),
  XLSX_FILE_PATH  = path.resolve( CWD, SITE_MAP_FILE_PATH ),
  DATA_FILE_PATH  = path.resolve( CWD, path.dirname( SITE_MAP_FILE_PATH ), PUG_CONFIG_FILE_NAME ),
  XLSX_SHEET_NAME = 'Sheet1',
  FORCED = ( argv[ 3 ] === 'force'  ) ? true : false // 既存の各pug ファイルを刷新するか否か
;

/**
 * Excel のデータを JSON に変換する。<br>
 * 変換された JSON データを基にPug データファイル（各HTML ファイルの属性値等をひとまとめにしたJSON）、およびPug ファイルを作成する。<br>
 * Pug データファイルは、Pug の実行時にPug に渡すデータとして使用する。
 * @function _run
 * @returns {Promise<void>}
 */
( async function _run() {
  try {
    _validatePath( SITE_MAP_FILE_PATH );
  } catch ( err ) {
    fancyLog.error( chalk.hex( ERROR_COLOR )( err.stack ) );
  }
  const workBook       = XLSX.readFile( XLSX_FILE_PATH );
  const jsonDataOrigin = XLSX.utils.sheet_to_json( workBook.Sheets[ XLSX_SHEET_NAME ] );
  const jsonData       = _mapJsonDataByUrl( jsonDataOrigin );
  const dataStrings    = JSON.stringify( jsonData, null, 2 );
  await _writePugDataFile( dataStrings );
  fancyLog( `configured  "${ path.relative( CWD, DATA_FILE_PATH ) }"` );
  for ( let url in jsonData ) {
    try {
      const
        templateFilePath = path.join( SRC_DIR, jsonData[ url ].template ),
        pugFilePath      = _getPugFilePath( jsonData[ url ].url )
     ;
      const
        exists = await existsFile( pugFilePath )
     ;
      if ( exists && FORCED === false ) {
        continue;
      }
      await _createPugFile( pugFilePath, templateFilePath );
      if ( exists ) {
        fancyLog( `updated       "${ path.relative( CWD, pugFilePath ) }"` );
      } else {
        fancyLog( `newly created "${ path.relative( CWD, pugFilePath ) }"` );
      }
    } catch ( err ) {
      fancyLog.error( chalk.hex( ERROR_COLOR )( err.stack ) );
    }
  } // for

  /**
   * 生成されたPug ファイルを基にHTML ファイルを生成する。
   */
  html();
} )();

/**
 * 絶対パスもしくはExcel ファイルパス以外はエラーを返す。
 * @param {string} filePath - ファイルパス
 * @throws {Error} 相対パスもしくはExcel ファイル以外のパスの場合にエラーを返す
 */
function _validatePath( filePath ) {
  if ( path.isAbsolute( filePath ) === true || /\.xlsx?$/.test( filePath ) === false ) {
    throw new Error(
      `The file path "${ filePath }" is not a relative path or an Excel file path.
      Please provide a valid path.`
    );
  }
}

/**
 * Pug のデータファイルに書き込む。
 * @private
 * @param {string} content - Pug の設定ファイルの内容
 * @returns {Promise<void>}
 */
async function _writePugDataFile( content ) {
  try {
    await writeFile( DATA_FILE_PATH, content + '\n', CHARSET );
  } catch ( err ) {
    throw err;
  }
}

/**
 * データ中のurl をkey とするObject を生成する。
 * @private
 * @param {object} data - JSON データ
 * @returns {object} 変換された JSON データ
 */
function _mapJsonDataByUrl( data ) {
  const
    res = {}
  ;
  data.forEach( ( item ) => {
    res[ item.url ] = item;
  } );
  return res;
}

/**
 * HTML ファイルのサイトルートパスを基にPug ファイルのパスを生成する。
 * @private
 * @param {string} siteRootHtmlFilePath - HTMLファイルのサイトルートパス
 * @returns {string} Pug ファイルのパス
 */
function _getPugFilePath( siteRootHtmlFilePath ) {
  let siteRootPugFilePath = '';
  if ( /\/$/.test( siteRootHtmlFilePath ) === true ) {
    siteRootPugFilePath = siteRootHtmlFilePath.replace( /\/$/, '/index.pug' );
  }
  if ( /\.html?$/.test( siteRootHtmlFilePath ) === true ) {
    siteRootPugFilePath = siteRootHtmlFilePath.replace( /\.html?$/, '.pug' );
  }
  return path.join( SRC_DIR, siteRootPugFilePath );
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
    const
      content = await _readTemplateFile( templateFilePath )
    ;
    await mkdir( path.dirname( pugFilePath ), { recursive : true } );
    await writeFile( pugFilePath, content, CHARSET );
  } catch ( err ) {
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
    console.info( 'remplateFile === ', templateFilePath );
    return await readFile( templateFilePath, CHARSET );
  } catch ( err ) {
    throw err;
  }
}
