const
  gulp = require('gulp')
;

const
  changed = require('gulp-changed')
  ,notify = require('gulp-notify')
  ,tap    = require('gulp-tap')
;

const
  beautifyHtml = require('js-beautify').html
  ,pug         = require('pug')
;

const  
  config    = require('../config.js').config
  ,settings = require('../config.js').settings
;

const
  options = {
    assistPretty : {
      assistAElement   : true,
      commentPosition  : 'inside',
      commentOnOneLine : true,
      emptyLine        : true,
      indent           : true,
    },
    beautifyHtml : {
      indent_size : 2,
      indent_char : ' ',
    },
    errorHandler : notify.onError('Error: <%= error.message %>'),
    pug : {
      pretty  : true,
      basedir : settings.src,
    },
  }
;

gulp.task( 'html_pug', () => {
  const
    self = config[ 'html_pug' ]
  ;
  let
    stream
  ;
  stream = gulp
    .src( self.src )
    .pipe( changed( settings.dist, {
      extension: '.html'
    } ) )
    .pipe( tap( _pugRender ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
  return stream;
} )
;

gulp.task( 'html_pug_chidlen', () => {
  const
    self = config[ 'html_pug_chidlen' ]
  ;
  let
    stream
  ;
  stream = gulp
    .src( self.src )
    .pipe( tap( _pugRender ) )
    .pipe( gulp.dest( settings.dist ) )
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
