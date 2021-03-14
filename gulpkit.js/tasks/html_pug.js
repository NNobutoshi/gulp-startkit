const
  path = require( 'path' )
;
const
  { src, dest } = require( 'gulp' )
  ,plumber      = require( 'gulp-plumber' )
  ,pug          = require( 'pug' )
  ,through      = require( 'through2' )
  ,beautifyHtml = require( 'js-beautify' ).html
  ,log          = require( 'fancy-log' )
;
const
  diff = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).html_pug
;
const
  options  = config.options
  ,pugData = require( config.data )
;

module.exports = html_pug;

function html_pug() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ,_collect ,_select ) )
    .on( 'data', ( file ) => {
      const keyFilePath = '/' + path
        .relative( path.resolve( process.cwd(), config.base ), file.path )
        .replace( /\\/g, '/' )
        .replace( /\.pug$/, '.html' )
      ;
      file.data = {
        siteData : pugData.defaults,
        pageData : pugData[ keyFilePath ],
      };
    } )
    .pipe( _pugRender() )
    .pipe( _postPug() )
    .pipe( dest( config.dist ) )
  ;
}

/*
 * 依存関係を調べ、Objectにまとめる。
 * through2 のtransform の中で実行。
 * chunk のcontents から読み込んでいるパスを調べる
 *
 * collection
 * {
 *   '読み込んでいるパス': [
 *     'chunk自身のパス'
 *    ]
 * }
 */
function _collect( file, collection ) {
  const
    contents = String( file.contents )
    ,regex = /^.*?(extends|include) *(.+)$/mg
    ,matches = contents.matchAll( regex )
  ;
  for ( const match of matches ) {
    let dependentFilePath;
    if ( /^\//.test( match[ 2 ] ) ) {
      // ルートパスであれば
      dependentFilePath = path.join( path.resolve( process.cwd(), config.base ), match[ 2 ] );
    } else {
      // 相対パスであれば
      dependentFilePath = path.resolve( file.dirname, match[ 2 ] );
    }
    if ( !collection[ dependentFilePath ] ) {
      collection[ dependentFilePath ] = [];
    }
    collection[ dependentFilePath ].push( file.path );
  }
}

/*
 * diff_build.jsの hrough2 flush の中で、Object で集めた通過候補毎に実行される。
 * 候補ファイルに依存するものを最終選択する。
 */
function _select( filePath, collection, destFiles ) {
  ( function _run_recursive( filePath ) {
    if ( Array.isArray( collection[ filePath ] ) && collection[ filePath ].length > 0 ) {
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
    partialFileRegEx = /[\\/]_/
    ,rendered = {
      files : []
    }
  ;
  const stream = through.obj( ( file, enc, callBack ) => {
    if ( partialFileRegEx.test( path.relative( __dirname, file.path ) ) ) {
      return callBack();
    }
    options.pug.filename = file.path;
    options.pug.self = true;
    options.pug.siteData = file.data.siteData;
    options.pug.pageData = file.data.pageData;
    pug.render( String( file.contents ), options.pug, ( error, contents ) => {
      if ( error ) {
        stream.emit( 'error', error );
        return callBack();
      }
      file.contents = new Buffer.from( contents );
      file.path = file.path.replace( /\.pug$/, '.html' );
      rendered.files.push( file.path );
      log( `html_pug: rendered: ${path.relative( process.cwd(), file.path )}` );
      return callBack( null, file );
    } );
  }, ( callBack ) => {
    log( `html_pug: rendered ${rendered.files.length} files` );
    callBack();
  } );
  return stream;
}

/*
 * Pug のrender 後実行。
 * HTML の体裁を整える。
 */
function _postPug() {
  const
    ugliyAElementRegEx = /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg
    ,endCommentRegEx   = /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/[.#].+?)-->/mg
  ;
  return through.obj( ( file, enc, callBack ) => {
    let
      contents = String( file.contents )
    ;

    /*
     * オプションで指定があれば、
     * <div> などを内包する<a> の体裁を整える。
     *
     * <a>             \ <a>
     *  <div>          \   <div>
     *  </div></a>     \   </div>
     *                 \ </a>
     */
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

    /*
     * オプションで指定があれば、インデントをトル。
     */
    if ( options.assistPretty.indent === false ) {
      contents = contents.replace( /^([\t ]+)/mg, '' );
    }

    /*
     * 閉じタグ付近に付けるコメントに関する体裁。
     */
    if ( options.assistPretty.commentPosition ) {
      contents = contents.replace( endCommentRegEx, _replacementEndComment );
    }
    file.contents = new global.Buffer.from( contents );
    return callBack( null, file );
  } );
}

function _replacementEndComment( _all, endTag, lineFeed, indent, comment ) {
  comment = '<!--' + comment + '-->';

  /*
   * コメントを閉じタグ内側に付けたい場合。
   */
  if ( options.assistPretty.commentPosition === 'inside' ) {

    /*
     * コメントと閉じタグを1行にまとめるか否か。
     * <!-- --></div>
     * or
     * <!-- -->
     * </div>
     */
    if ( options.assistPretty.commentOnOneLine === true ) {

      /*
       * コメントの付いた閉じタグ後に空行をつけるか否か。
       */
      if ( options.assistPretty.emptyLine === true ) {
        return comment + endTag + lineFeed;
      } else {
        return comment + endTag;
      }
    } else {

      /*
       * コメントの付いた閉じタグ後に空行をつけるか否か。
       */
      if ( options.assistPretty.emptyLine === true ) {
        return comment + lineFeed + indent + endTag + lineFeed;
      } else {
        return comment + lineFeed + indent + endTag;
      }
    }

  /*
   * コメントを閉じタグ外側に付けたい場合。
   */
  } else {

    /*
     * コメントと閉じタグを1行にまとめるか否か。
     * </div><!-- -->
     * or
     * </div>
     * <!-- -->
     */
    if ( options.assistPretty.commentOnOneLine === true ) {

      /*
       * コメントの付いた閉じタグ後に空行をつけるか否か。
       */
      if ( options.assistPretty.emptyLine === true ) {
        return endTag + comment + lineFeed;
      } else {
        return endTag + comment;
      }
    } else {

      /*
       * コメントの付いた閉じタグ後に空行をつけるか否か。
       */
      if ( options.assistPretty.emptyLine === true ) {
        return endTag + lineFeed + indent + comment + lineFeed;
      } else {
        return endTag + lineFeed + indent + comment;
      }
    }
  }
}
