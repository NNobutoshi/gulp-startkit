const
  fs    = require( 'fs' )
  ,path = require( 'path' )
;
const
  nodeX2j = require( 'xls-to-json' )
  ,mkdirp = require( 'mkdirp' )
  ,log    = require( 'fancy-log' )
;
const
  CHARSET               = 'utf-8'
  ,SRC_DIR              = '../../src'
  ,PUG_CONFIG_FILE_PATH = '../../src/_pug_data.json'
  ,SITE_MAP_FILE_PATH   = '../../src/sitemap.xlsx'
  // ,OUTPUT_JSON_PATH     = './output.json'
  ,settings = {
    src        : path.resolve( __dirname, SRC_DIR ),
    extension  : /\.pug?$/,
    configFile : path.resolve( __dirname, PUG_CONFIG_FILE_PATH ),
    indexName  : 'index.pug',
    linefeed   : '\n', // '\r\n'
    x2j        : {
      input  : path.resolve( __dirname , SITE_MAP_FILE_PATH ),
      // output : path.resolve( __dirname, OUTPUT_JSON_PATH ),
      sheet  : 'Sheet1',
    },
  }
  ,force = ( process.argv.includes( 'force' ) ) ? true : false // 既存の各pug ファイルを刷新するか否か
;
( async function _run() {
  const
    jSONData     = await _nodeX2j( settings.x2j )
    ,confStrings = await _readConfigFile()
    ,indent      = _getIndent( confStrings, /[\s\S]+?( +)"{{": "",/ )
    ,dataStrings = _deleteWrapperParen( jSONData, indent )
  ;
  _writePugConfigFile( confStrings, dataStrings, indent );
  Object.keys( jSONData ).forEach( ( url ) => {
    _createPugFileByProps( jSONData[ url ], _createPugFile );
  } );
} )();

function _nodeX2j( options ) {
  return new Promise( ( resolve, reject ) => {
    nodeX2j( options, ( error, result ) => {
      if ( error ) {
        reject();
        return console.error( error );
      }
      return resolve( _reJsonData( result ) );
    } );
  } );
}

function _readConfigFile() {
  return new Promise( ( resolve, reject ) => {
    fs.readFile( settings.configFile, CHARSET, ( error, content ) => {
      if ( error ) {
        reject();
        return console.error( error );
      }
      return resolve( content );
    } );
  } );
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
    .replace( new RegExp( `^\\{\\${settings.linefeed}` ), '' )
    .replace( new RegExp( `\\}\\${settings.linefeed}\\}` ), `},${settings.linefeed}` )
    .replace( /^ {2}/mg, indent )
  ;
}

function _writePugConfigFile( content, newStrings, indent ) {
  content = content.replace( /"{{": "",[\s\S]*?"}}": ""/, `"{{": "",${settings.linefeed + newStrings + indent}"}}": ""` );
  fs.writeFile( settings.configFile, content, CHARSET, ( error )  => {
    if ( error ) {
      return console.error( error );
    }
    log( `configed  "${path.relative( process.cwd(), settings.configFile )}"` );
  } );
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

function _createPugFileByProps( props, callback ) {
  let
    url = props.url
    ,temp = props.template
    ,htmlUrl = url
    ,pugUrl = ''
  ;
  if ( url.match( /\/$/ ) ) {
    pugUrl = url.replace( /\/$/, '/index.pug' );
  }
  if ( url.match( /\.html?$/ ) ) {
    pugUrl = url.replace( /\.html?$/, '.pug' );
  }
  pugUrl = path.join( settings.src , pugUrl );
  mkdirp.sync( path.dirname( pugUrl ) );
  callback( pugUrl, htmlUrl, temp );
}

async function _createPugFile( pugUrl, htmlUrl, template ) {
  let
    content
    ,isNew = !fs.existsSync( pugUrl )
  ;
  if ( !isNew && force === false ) {
    return;
  }
  content = await _readTemplateFile( template );
  await _writePugFile( content, pugUrl, htmlUrl, isNew );
}

function _readTemplateFile( template ) {
  return new Promise( ( resolve, reject ) => {
    fs.readFile( path.join( settings.src, template ), CHARSET, ( error, content ) => {
      if ( error ) {
        reject();
        return console.error( error );
      }
      return resolve( content );
    } );
  } );
}

function _writePugFile( content, pugUrl, htmlUrl, isNew ) {
  return new Promise( ( resolve, reject ) => {
    fs.writeFile( pugUrl, content.replace( '//{page}', `"${htmlUrl}"` ), CHARSET, ( error ) => {
      if ( error ) {
        reject();
        return console.error( error );
      }
      if ( isNew ) {
        log( `new created "${path.relative( process.cwd(), pugUrl )}"` );
      } else {
        log( `renewed     "${path.relative( process.cwd(), pugUrl )}"` );
      }
      resolve();
    } );
  } );
}
