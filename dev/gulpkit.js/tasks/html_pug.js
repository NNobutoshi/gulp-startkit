const
  { src, dest, lastRun } = require( 'gulp' )
  ,tap          = require( 'gulp-tap' )
  ,beautifyHtml = require( 'js-beautify' ).html
  ,pug          = require( 'pug' )
  ,log          = require( 'fancy-log' )
;
const
  config = require( '../config.js' ).html_pug
;
const
  options = config.options
;

module.exports = {
  html_pug,
  html_pug_partial,
};

function html_pug() {
  const
    totalFiles = { counter : 0 }
    ,srcOptions = {
      since : lastRun( html_pug ) || process.lastRunTime,
    }
  ;
  return src( config.src, srcOptions )
    .pipe( tap( _pugRender( totalFiles ) ) )
    .pipe( dest( config.dist ) )
    .on( 'finish', () => {
      log( `html_pug: rendered ${totalFiles.counter} files` );
    } )
  ;
}

function html_pug_partial() {
  const
    totalFiles = { counter : 0 }
  ;
  return src( config.src )
    .pipe( tap( _pugRender( totalFiles ) ) )
    .pipe( dest( config.dist ) )
    .on( 'finish', () => {
      log( `Pug: rendered ${totalFiles.counter} files` );
    } )
  ;
}

function _pugRender( totalFiles ) {
  const
    ugliyAElementRegEx = /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg
    ,endCommentRegEx = /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/[.#].+?)-->/mg
    ,errorHandler = options.errorHandler
  ;
  return ( file, t ) => {
    let
      contents = ''
    ;
    options.pug.filename = file.path;
    try {
      contents = pug.render( String( file.contents ), options.pug );
      totalFiles.counter++;
    } catch ( e ) {
      errorHandler( e );
    }
    if ( options.assistPretty.assistAElement ) {
      contents = contents.replace( ugliyAElementRegEx, function( _all, indent, element, linefeed ) {
        element = element
          .replace( '><a ', '>' + linefeed + '<a ' )
          .replace( '</a>', '</a>' + linefeed )
        ;
        return beautifyHtml( element, options.beautifyHtml ).replace( /^/mg, indent );
      } );
    }
    if ( options.assistPretty.indent === false ) {
      contents = contents.replace( /^([\t ]+)/mg, '' );
    }
    if ( options.assistPretty.commentPosition ) {
      contents = contents.replace( endCommentRegEx, _replacementEndComment );
    }
    file.contents = new global.Buffer.from( contents );
    file.path = file.path.replace( /\.pug$/, '.html' );
    return t.through;
  };

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

}
