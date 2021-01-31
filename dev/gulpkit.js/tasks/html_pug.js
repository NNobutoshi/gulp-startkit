const
  { src, dest } = require( 'gulp' )
  ,beautifyHtml = require( 'js-beautify' ).html
  ,pug          = require( 'pug' )
  ,log          = require( 'fancy-log' )
  ,path         = require( 'path' )
  ,through      = require( 'through2' )
  ,diff         = require( 'gulp-diff-build' )
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
    .pipe( diff( options.diff ) )
    .pipe( _pugRender() )
    .pipe( _postPug() )
    .pipe( dest( config.dist ) )
    .on( 'finish', () => {
      log( `html_pug: rendered ${_pugRender.totalFiles.counter} files` );
    } )
  ;
}

function _pugRender() {
  const
    errorHandler = options.errorHandler
    ,partialFileRegEx = /[\\/]_/
  ;
  _pugRender.totalFiles = { counter : 0 };
  return through.obj( ( file, enc, cb ) => {
    if ( partialFileRegEx.test( path.relative( __dirname, file.path ) ) ) {
      return cb();
    }
    options.pug.filename = file.path;
    pug.render( String( file.contents ), options.pug, ( error, contents ) => {
      if ( error ) {
        cb();
        return errorHandler( error );
      }
      _pugRender.totalFiles.counter++;
      file.contents = new global.Buffer.from( contents );
      file.path = file.path.replace( /\.pug$/, '.html' );
      return cb( null, file );
    } );
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
