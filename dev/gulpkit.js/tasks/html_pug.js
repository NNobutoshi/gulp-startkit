const
  gulp = require('gulp')
;

const
  changed = require('gulp-changed')
  ,tap    = require('gulp-tap')
;

const
  beautifyHtml = require('js-beautify').html
  ,pug         = require('pug')
;

const  
  config    = require('../config.js').config.html_pug
  ,settings = require('../config.js').settings
;

const
  options = config.options
;

gulp.task( 'html_pug', () => {
  let
    stream
  ;
  stream = gulp
    .src( config.src )
    .pipe( changed( settings.dist, {
      extension: '.html'
    } ) )
    .pipe( tap( _pugRender ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
  return stream;
} )
;

gulp.task( 'html_pug_children', () => {
  let
    stream
  ;
  stream = gulp
    .src( config.src )
    .pipe( tap( _pugRender ) )
    .pipe( gulp.dest( settings.dist ) )
    .pipe( tap( ( file ) => {
      console.info( 'file = ' + file. path );
    } ) )
  ;
  return stream;
} )
;

function _pugRender( file, t ) {
  const
    ugliyAElementRegEx = /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg
    ,endCommentRegEx = /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/?[.#].+?)-->/mg
    ,errorHandler = options.errorHandler
  ;
  let
    contents = ''
  ;
  options.pug.filename = file.path;
  try {
    contents = pug.render( String( file.contents ), options.pug );
  } catch( e ) {
    errorHandler( e );
  }
  if ( options.assistPretty.assistAElement ) {
    contents = contents.replace( ugliyAElementRegEx, function( all, indent, element, linefeed ) {
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
    contents = contents.replace( endCommentRegEx, function( all, endTag, lineFeed, indent, comment ) {
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
    } );
  }
  file.contents = new global.Buffer.from( contents );
  file.path = file.path.replace( /\.pug$/, '.html');
  return t.through;
}
