const
  nodeX2j   = require('xls-to-json')
  ,fs       = require('fs')
  ,charset  = 'utf-8'
  ,settings = {
    src         : './src'
    ,extension  : /\.pug?$/
    ,configFile : './src/_config.pug'
    ,indexName  : 'index.pug'
    ,linefeed   : '\n' // '\r\n'
    ,x2j : {
      input    : './sitemap.xlsx'
      ,output  : './output.json'
      ,sheet   : 'Sheet1'
    }
  }
  ,data = {}
  /* globals process */
  ,config = ( process.argv[ 2 ] )? Boolean( process.argv[ 2 ] ): true
  ,force = ( process.argv[ 3 ] )? Boolean( process.argv[ 3 ] ): false
;

_run();

function _run() {
  nodeX2j( settings.x2j, function( err, result ) {
    if( err ) {
      console.error( err );
    } else {
      result.forEach( _eachJsonData );
    }
    let
      content = ''
      ,string = ''
      ,indent = ''
    ;
    content = fs.readFileSync( settings.configFile, charset );
    indent = content.match( /[\s\S]+?( +)\/\/{{/ )[1];
    string = JSON.stringify( data, null, '  ' )
      .replace( new RegExp('^\\{' + '\\' + settings.linefeed, 'g'), '' )
      .replace( /\}$/, '' )
      .replace( /^ {2}/mg, indent )
    ;
    content = content.replace( /\/\/\{\{[\s\S]*?\/\/\}\}/, `//{{${settings.linefeed+string+indent}//}}` );

    if ( config ) {
      console.info( settings.configFile );
      console.info('==');
      fs.writeFileSync( settings.configFile, content, charset );
    }
    Object.keys( data ).forEach( ( key ) => {
      _runRecursively( data[ key ] );
    } );
    console.info('==');
  } );
}


function _eachJsonData( item ) {
  data[ item.url ] = item;
}

function _runRecursively( prop ) {
  let
    leaves = []
    ,parent = ''
    ,len = null
    ,url = prop.url
    ,key = url
  ;

  if ( url.match( /\/$/) ) {
    url = url.replace( /\/$/, '/index.pug');
  }
  if ( url.match(/\.html?$/) ) {
    url = url.replace( /\.html?$/, '.pug' );
  }
  url = './src' + url;
  leaves = url.split('/');
  len = leaves.length;
  leaves.forEach( function ( leaf, index ) {
    if ( parent === '' ) {
      parent = leaf;
    } else {
      parent  = parent + '/' + leaf;
    }
    if ( index === len -1 ) {
      if ( !fs.existsSync( parent ) || force ) {
        console.info( parent );
        _writeFile( url, key, prop.template );
      }
    } else {
      if ( !fs.existsSync( parent ) ) {
        fs.mkdirSync( parent );
      }
    }
  } );
}

function _writeFile( url, key, template ) {
  let
    content = ''
  ;
  content = fs.readFileSync( template, charset );
  content = content.replace( '//{page}', `"${key}"` );
  fs.writeFileSync( url, content, charset );
}
