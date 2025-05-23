import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path                           from 'node:path';
import { fileURLToPath }              from 'node:url';

import fanctLog from 'fancy-log';
import XLSX     from 'xlsx';

import existsFile from '../utilities/exists.js';

const
  CHARSET               = 'utf-8'
  ,SRC_DIR              = '../../src'
  ,PUG_CONFIG_FILE_PATH = '../../src/_data/_pug_data.json'
  ,SITE_MAP_FILE_PATH   = '../../src/_data/sitemap.xlsx'
  ,DIRNAME              = path.dirname( fileURLToPath( import.meta.url ) )
;
const
  settings = {
    src          : path.resolve( DIRNAME, SRC_DIR ),
    extension    : /\.pug?$/,
    configFile   : path.resolve( DIRNAME, PUG_CONFIG_FILE_PATH ),
    indexName    : 'index.pug',
    linefeed     : '\n', // '\r\n'
    sheetName    : 'Sheet1',
    xlsxFilePath : path.resolve( DIRNAME, SITE_MAP_FILE_PATH ),
  }
  ,force = ( process.argv.includes( 'force' ) ) ? true : false // 既存の各pug ファイルを刷新するか否か
;

/**
 * @module pug_tmp_engine
 * @requires node:fs/promises
 * @requires node:path
 * @requires node:url
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
  const
    workBook     = XLSX.readFile( settings.xlsxFilePath )
    ,jSONData    = _xlsxToJson( workBook )
    ,confStrings = await _readConfigFile()
    ,indent      = _getIndent( confStrings, /[\s\S]+?( +)"{{": "",/ )
    ,dataStrings = _deleteWrapperParen( jSONData, indent )
  ;
  await _writePugConfigFile( confStrings, dataStrings, indent );
  for ( let url in jSONData ) {
    await _createPugFileByProps( jSONData[ url ], _createPugFile );
  }
} )();

/**
 * Excel のデータを JSON に変換する。
 * @private
 * @param {object} workBook - Excel のデータ
 * @returns {object} JSON データ
 */
function _xlsxToJson( workBook ) {
  return _reJsonData(
    XLSX.utils.sheet_to_json( workBook.Sheets[ settings.sheetName ] )
  );
}

/**
 * Pug の設定ファイルを読み込む。
 * @private
 * @returns {object} Pug の設定ファイルの内容
 */
async function _readConfigFile() {
  try {
    return await readFile( settings.configFile, CHARSET );
  } catch ( err ) {
    return console.error( err.stack );
  }
}

/**
 * Pug の設定ファイルの内容から、インデントを取得する。
 * @private
 * @param {string} configContent - Pug の設定ファイルの内容
 * @param {RegExp} indentRegeX - インデントを取得するための正規表現
 * @returns {string|boolean} インデントの文字列、または false
 */
function _getIndent( configContent, indentRegeX ) {
  const
    matches = configContent.match( indentRegeX )
  ;
  return ( matches !== null &&  matches[ 1 ] ) ? matches[ 1 ] : false;
}

/**
 * @private
 * @param {object} jSONData - JSON データ
 * @param {string} indent - インデント
 * @returns {string} JSON データから変換された文字列
 */
function _deleteWrapperParen( jSONData, indent ) {
  return JSON
    .stringify( jSONData, null, 2 )
    .replace( new RegExp( `^\\{\\${ settings.linefeed }` ), '' )
    .replace( new RegExp( `\\}\\${ settings.linefeed }\\}` ), `},${ settings.linefeed }` )
    .replace( /^ {2}/mg, indent )
  ;
}

/**
 * Pug の設定ファイルに書き込む。
 * @private
 * @param {string} content - Pug の設定ファイルの内容
 * @param {string} newStrings - 新しい文字列
 * @param {string} indent - インデント
 */
async function _writePugConfigFile( content, newStrings, indent ) {
  content = content.replace( /"{{": "",[\s\S]*?"}}": ""/, `"{{": "",${ settings.linefeed + newStrings + indent }"}}": ""` );
  try {
    await writeFile( settings.configFile, content, CHARSET );
    fanctLog( `configed  "${ path.relative( process.cwd(), settings.configFile ) }"` );
  } catch ( err ) {
    return console.error( err.stack );
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
  const
    res = {}
  ;
  data.forEach( ( item ) => {
    res[ item.url ] = item;
  } );
  return res;
}

/**
 * Pug のファイルを作成する。
 * @private
 * @param {object} props - Pug のプロパティ
 * @param {Function} createPugFile - Pug ファイルを作成する関数
 */
async function _createPugFileByProps( props, createFile ) {
  let
    url      = props.url
    ,temp    = props.template
    ,htmlUrl = url
    ,pugUrl  = ''
  ;
  if ( url.match( /\/$/ ) ) {
    pugUrl = url.replace( /\/$/, '/index.pug' );
  }
  if ( url.match( /\.html?$/ ) ) {
    pugUrl = url.replace( /\.html?$/, '.pug' );
  }
  pugUrl = path.join( settings.src , pugUrl );
  try {
    await mkdir( path.dirname( pugUrl ),{ recursive : true } );
    createFile( pugUrl, htmlUrl, temp );
  } catch ( err ) {
    console.error( err.stack );
  }
}

/**
 * Pug ファイルを作成する。
 * @private
 * @param {string} pugUrl - Pug ファイルの URL
 * @param {string} htmlUrl - HTML ファイルの URL
 * @param {string} template - テンプレート
 */
async function _createPugFile( pugUrl, htmlUrl, template ) {
  try {
    const isNew = !await existsFile( pugUrl );
    if ( !isNew && force === false ) {
      return;
    }
    const content = await _readTemplateFile( template );
    await _writePugFile( content, pugUrl, htmlUrl, isNew );
  } catch ( err ) {
    return console.error( err.stack );
  }
}

/**
 * テンプレートファイルを読み込む。
 * @private
 * @param {string} template - テンプレートファイルの URL
 * @returns {string} テンプレートファイルの内容
 */
async function _readTemplateFile( template ) {
  try {
    return await readFile( path.join( settings.src, template ), CHARSET );
  } catch ( err ) {
    return console.error( err.stack );
  }
}

/**
 * Pug ファイルを書き込む。
 * @private
 * @param {string} content - Pug ファイルの内容
 * @param {string} pugUrl - Pug ファイルの URL
 * @param {string} htmlUrl - HTML ファイルの URL
 * @param {boolean} isNew - 新しいファイルかどうか
 */
async function _writePugFile( content, pugUrl, htmlUrl, isNew ) {
  try {
    await writeFile( pugUrl, content.replace( '//{page}', `"${ htmlUrl }"` ), CHARSET );
    if ( isNew ) {
      fanctLog( `newly created "${ path.relative( process.cwd(), pugUrl ) }"` );
    } else {
      fanctLog( `Updated       "${ path.relative( process.cwd(), pugUrl ) }"` );
    }
  } catch ( err ) {
    return console.error( err.stack );
  }
}
