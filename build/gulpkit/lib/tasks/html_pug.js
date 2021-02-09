const
  path = require( 'path' )
;
const
  { src, dest } = require( 'gulp' )
  ,pug          = require( 'pug' )
  ,through      = require( 'through2' )
  ,beautifyHtml = require( 'js-beautify' ).html
  ,log          = require( 'fancy-log' )
  ,diff         = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).html_pug
;
const
  options = config.options
;

module.exports = html_pug;

function html_pug() {
  return src( config.src )
    .pipe( diff(
      options.diff
      ,_map
      ,_filter
    ) )
    .pipe( _pugRender() )
    .pipe( _postPug() )
    .pipe( dest( config.dist ) )
  ;
}

function _map( file, collection ) {
  const
    contents = String( file.contents )
    ,regex = /^.*?(extends|include) *(.+)$/mg
    ,matches = contents.matchAll( regex )
  ;
  for ( const match of matches ) {
    for ( let i = 0, len = match.length; i < len; i++ ) {
      let keyFileName;
      if ( i % 3 === 2 ) { // パス部分
        if ( /^\//.test( match[ i ] ) ) {
          keyFileName = path.join( config.base, match[ i ] );
        } else {
          keyFileName = path.resolve( file.dirname, match[ i ] );
        }
        if ( !collection[ keyFileName ] ) {
          collection[ keyFileName ] = [];
        }
        collection[ keyFileName ].push( file.path );
      }
    }
  }
}

function _filter( filePath, collection, destFiles ) {
  ( function _run_recursive( filePath ) {
    if ( collection[ filePath ] && collection[ filePath ].length ) {
      collection[ filePath ].forEach( ( item ) => {
        destFiles[ item ] = 1;
        if ( Object.keys( collection ).includes( item ) ) {
          _run_recursive( item );
        }
      } );
    }
  } )( filePath );
}

function _pugRender() {
  const
    errorHandler = options.errorHandler
    ,partialFileRegEx = /[\\/]_/
    ,rendered = {
      files : []
    }
  ;
  return through.obj( ( file, enc, callBack ) => {
    if ( partialFileRegEx.test( path.relative( __dirname, file.path ) ) ) {
      return callBack();
    }
    options.pug.filename = file.path;
    pug.render( String( file.contents ), options.pug, ( error, contents ) => {
      if ( error ) {
        callBack();
        return errorHandler( error );
      }
      file.contents = new global.Buffer.from( contents );
      file.path = file.path.replace( /\.pug$/, '.html' );
      rendered.files.push( file.path );
      return callBack( null, file );
    } );
  }, ( callBack ) => {
    log( `html_pug: rendered ${rendered.files.length } files` );
    callBack();
  } );
}

function _postPug() {
  const
    ugliyAElementRegEx = /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg
    ,endCommentRegEx = /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/[.#].+?)-->/mg
  ;
  return through.obj( ( file, enc, cb ) => {
    let
      contents = String( file.contents )
    ;
    if ( options.assistPretty.assistAElement ) {
      contents = contents.replace(
        ugliyAElementRegEx
        ,function( _all, indent, element, linefeed ) {
          element = element
            .replace( '><a ', '>' + linefeed + '<a ' )
            .replace( '</a>', '</a>' + linefeed )
          ;
          return beautifyHtml( element, options.beautifyHtml ).replace( /^/mg, indent );
        } )
      ;
    }
    if ( options.assistPretty.indent === false ) {
      contents = contents.replace( /^([\t ]+)/mg, '' );
    }
    if ( options.assistPretty.commentPosition ) {
      contents = contents.replace( endCommentRegEx, _replacementEndComment );
    }
    file.contents = new global.Buffer.from( contents );
    return cb( null, file );
  } );
}

function _replacementEndComment( _all, endTag, lineFeed, indent, comment ) {
  comment = '<!--' + comment + '-->';
  if ( options.assistPretty.commentPosition === 'inside' ) {
    if ( options.assistPretty.commentOnOneLine === true ) {
      if ( options.assistPretty.emptyLine === true ) {
        return comment + endTag + lineFeed;
      } else {
        return comment + endTag;
      }
    } else {
      if ( options.assistPretty.emptyLine === true ) {
        return comment + lineFeed + indent + endTag + lineFeed;
      } else {
        return comment + lineFeed + indent + endTag;
      }
    }
  } else {
    if ( options.assistPretty.commentOnOneLine === true ) {
      if ( options.assistPretty.emptyLine === true ) {
        return endTag + comment + lineFeed;
      } else {
        return endTag + comment;
      }
    } else {
      if ( options.assistPretty.emptyLine === true ) {
        return endTag + lineFeed + indent + comment + lineFeed;
      } else {
        return endTag + lineFeed + indent + comment;
      }
    }
  }
}
