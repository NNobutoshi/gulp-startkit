import { mkdir, existsSync }   from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import log        from 'fancy-log';
import XLSX       from 'xlsx';

const
  CHARSET               = 'utf-8'
  ,SRC_DIR              = '../../src'
  ,PUG_CONFIG_FILE_PATH = '../../src/_data/_pug_data.json'
  ,SITE_MAP_FILE_PATH   = '../../src/_data/sitemap.xlsx'
  ,DIRNAME              = dirname( fileURLToPath( import.meta.url ) )
  ,settings = {
    src          : resolve( DIRNAME, SRC_DIR ),
    extension    : /\.pug?$/,
    configFile   : resolve( DIRNAME, PUG_CONFIG_FILE_PATH ),
    indexName    : 'index.pug',
    linefeed     : '\n', // '\r\n'
    sheetName    : 'Sheet1',
    xlsxFilePath : resolve( DIRNAME, SITE_MAP_FILE_PATH ),
  }
  ,force = ( process.argv.includes( 'force' ) ) ? true : false // 既存の各pug ファイルを刷新するか否か
;

( async function _run() {
  const
    workBook     = XLSX.readFile( settings.xlsxFilePath )
    ,jSONData    = _xlsxToJson( workBook )
    ,confStrings = await _readConfigFile()
    ,indent      = _getIndent( confStrings, /[\s\S]+?( +)"{{": "",/ )
    ,dataStrings = _deleteWrapperParen( jSONData, indent )
  ;
  _writePugConfigFile( confStrings, dataStrings, indent );
  for ( let url in jSONData ) {
    _createPugFileByProps( jSONData[ url ], _createPugFile );
  }
} )();

function _xlsxToJson( workBook ) {
  return _reJsonData(
    XLSX.utils.sheet_to_json( workBook.Sheets[ settings.sheetName ] )
  );
}

async function _readConfigFile() {
  try {
    return await readFile( settings.configFile, CHARSET );
  } catch ( error ) {
    return console.error( error );
  }
}

function _getIndent( configContent, indentRegeX ) {
  const
    matches = configContent.match( indentRegeX )
  ;
  return ( matches !== null &&  matches[ 1 ] ) ? matches[ 1 ] : false;
}

function _deleteWrapperParen( jSONData, indent ) {
  return JSON
    .stringify( jSONData, null, 2 )
    .replace( new RegExp( `^\\{\\${ settings.linefeed }` ), '' )
    .replace( new RegExp( `\\}\\${ settings.linefeed }\\}` ), `},${ settings.linefeed }` )
    .replace( /^ {2}/mg, indent )
  ;
}

async function _writePugConfigFile( content, newStrings, indent ) {
  content = content.replace( /"{{": "",[\s\S]*?"}}": ""/, `"{{": "",${ settings.linefeed + newStrings + indent }"}}": ""` );
  try {
    await writeFile( settings.configFile, content, CHARSET );
    log( `configed  "${ relative( process.cwd(), settings.configFile ) }"` );
  } catch ( error ) {
    console.error( error );
  }
}

function _reJsonData( data ) {
  const
    res = {}
  ;
  data.forEach( ( item ) => {
    res[ item.url ] = item;
  } );
  return res;
}

function _createPugFileByProps( props, createPugFile ) {
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
  pugUrl = join( settings.src , pugUrl );
  mkdir( dirname( pugUrl ),{ recursive: true }, ( error ) =>{
    if ( error ) {
      console.error( error );
    }
    createPugFile( pugUrl, htmlUrl, temp );
  } )
  ;
}

async function _createPugFile( pugUrl, htmlUrl, template ) {
  let
    content
    ,isNew = !existsSync( pugUrl )
  ;
  if ( !isNew && force === false ) {
    return;
  }
  content = await _readTemplateFile( template );
  await _writePugFile( content, pugUrl, htmlUrl, isNew );
}

async function _readTemplateFile( template ) {
  try {
    return await readFile( join( settings.src, template ), CHARSET );
  } catch ( error ) {
    return console.error( error );
  }
}

async function _writePugFile( content, pugUrl, htmlUrl, isNew ) {
  try {
    await writeFile( pugUrl, content.replace( '//{page}', `"${ htmlUrl }"` ), CHARSET );
    if ( isNew ) {
      log( `newly created "${ relative( process.cwd(), pugUrl ) }"` );
    } else {
      log( `Updated       "${ relative( process.cwd(), pugUrl ) }"` );
    }
  } catch ( error ) {
    return console.error( error );
  }
}
