import { readFileSync }  from 'node:fs';
import { resolve, join } from 'node:path';
import { Buffer }        from 'node:buffer';

import { src, dest } from 'gulp';
import plumber       from 'gulp-plumber';
import pug           from 'pug';
import through       from 'through2';
import beautify      from 'js-beautify';
import { imageSizeFromFile } from 'image-size/fromFile';

import diff, { organizeSelectedFileMap } from '../lib/diff_build.js';
import logStreamData                     from '../lib/log_stream_data.js';

import { html_pug as config } from '../config.js';

const
  LOG_TITLE = '[html_pug]:'
  ,LOG_SUBTITLE = 'renderd'
;
const
  options = config.options
;
let
  pugData
;

/**
 * Pug を実行するタスク。
 * @returns {Object} - Gulp stream
 */
export default function html_pug() {
  pugData = JSON.parse( readFileSync( config.data ).toString() );
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( src( config.imgSrc, { read : false } ) )
    .pipe( diff( options.diff ,_collectDependencyFiles ,organizeSelectedFileMap ) )
    .on( 'data', _setPugData )
    .pipe( _renderPug() )
    .pipe( _formatHtml() )
    .pipe( _injectImageSize() )
    .pipe( dest( config.dist ) )
    .pipe( logStreamData( LOG_TITLE, LOG_SUBTITLE ) )
  ;
}

/**
 * Pug の実行前に、Pug に渡すデータをセットする。
 * @param {object} file
 */
function _setPugData( file ) {
  if ( file.path.endsWith( '.pug' ) === false ) {
    return;
  }

  const keyFilePath = file.path
    .replace( resolve( process.cwd(), config.base ), '' )
    .replace( /\\/g, '/' )
    .replace( /\.pug$/, '.html' )
  ;
  file.data = {
    siteData : pugData.defaults,
    pageData : pugData[ keyFilePath ],
  };
}

/**
 * 依存関係を調べ、Objectにまとめる。
 * through2 のtransformFunction の内部で実行。
 * chunk のcontents から読み込んでいるパスを調べる
 *
 * collectedFiles
 * {
 *   '読み込んでいるパス': [
 *     'chunk自身のパス'
 *    ]
 * }
 * @param {Object} file
 * @param {Map} collectedFiles - 依存関係を格納する Map
 */
function _collectDependencyFiles( file, collectedFiles ) {
  const
    contents = String( file.contents )
    ,regex   = /(^.*?(extends|include) *(.+)$)|((img|source)\s*?\(.*?(src|srcset)=["']([^"'?]+)\??[^"'?]*["'].*?\))/mg
    ,matches = contents.matchAll( regex )
  ;
  for ( const match of matches ) {
    const
      filePath = match[ 3 ] || match[ 7 ]
    ;
    if ( _isExternalSrc( filePath ) === true ) {
      continue;
    }
    const dependencyFilePath = ( _isRootPath( filePath ) )
      // ルートパスであれば
      ? join( resolve( process.cwd(), config.base ), filePath )
      // 相対パスであれば
      : resolve( file.dirname, filePath )
    ;
    if ( dependencyFilePath && collectedFiles.has( dependencyFilePath ) === false ) {
      collectedFiles.set( dependencyFilePath, [] );
    }
    if ( dependencyFilePath ) {
      collectedFiles.get( dependencyFilePath ).push( file.path );
    }
  }
}

/**
 * Pug の実行。
 * @returns {object} - Gulp stream
 */
function _renderPug() {
  const ignoreFileRegEx = /^_|\.(png|jpg|svg)$/;

  return through.obj(
    function _transform( file, enc, callback ) {
      if ( ignoreFileRegEx.test( file.basename ) === true ) {
        return callback();
      }
      const pugOptions = {
        ...options.pug,
        filename : file.path,
        self : true,
        siteData : file.data.siteData,
        pageData : file.data.pageData,
      };
      try {
        const html = pug.render( String( file.contents ), pugOptions );
        file.contents = Buffer.from( html );
        file.path = file.path.replace( /\.pug$/, '.html' );
        callback( null, file );
      } catch ( err ) {
        return callback( err );
      }
    }
  );
}

/**
 * Pug の実行後、HTML ファイルに対して実行。
 * HTML の体裁を整える。
 * @returns {object} - Gulp stream
 */
function _formatHtml() {
  const
    uglyAElementRegEx = options.formatHtml.uglyAElementRegEx
    ,endCommentRegEx  = options.formatHtml.endCommentRegEx
  ;

  return through.obj(
    function( file, enc, callback ) {
      let contents = String( file.contents );
      // オプションで指定があれば、
      // <div> などを内包する<a> の体裁を整える。
      //
      // <a>             \ <a>
      //  <div>          \   <div>
      //  </div></a>     \   </div>
      //                 \ </a>
      if ( options.formatHtml.repairAElement === true ) {
        contents = contents.replace(
          uglyAElementRegEx,
          ( _all, indent, element, linefeed ) => {
            const fixed = element
              .replace( '><a ', '>' + linefeed + '<a ' )
              .replace( '</a>', '</a>' + linefeed )
            ;
            return beautify.html( fixed, options.beautify ).replace( /^/mg, indent );
          },
        )
        ;
      }
      // オプションで指定があれば、インデントをトル。
      if ( options.formatHtml.indent === false ) {
        contents = contents.replace( /^([\t ]+)/mg, '' );
      }
      // 閉じタグ付近に付けるコメントに関する体裁。
      if ( options.formatHtml.commentPosition ) {
        contents = contents.replace( endCommentRegEx, _replacementEndComment );
      }
      file.contents = Buffer.from( contents );
      callback( null, file );
    }
  );
}

/**
 * img サイズの自動挿入
 * @returns {object} - Gulp stream
 */
function _injectImageSize() {
  const
    mapImageElementStrings = new Map()
  ;
  if ( options.imgSize === false ) {
    return through.obj();
  }

  return through.obj( async function( file, enc, callback ) {
    const
      imgRegEx = options.injectImageSize.imgRegEx
      ,promiseReplaceImageElementStringsAll = []
    ;
    let contents = String( file.contents );
    for ( const match of contents.matchAll( imgRegEx ) ) {
      const
        frontPart = match[ 2 ]
        ,srcPath  = match[ 5 ]
        ,rearPart = match[ 7 ]
      ;
      if (
        _isExternalSrc( srcPath ) === true
        || ( frontPart.includes( 'width' ) === true || frontPart.includes( 'height' ) === true )
        || ( rearPart.includes( 'width' )  === true || rearPart.includes( 'height' )  === true )
      ) {
        continue;
      }
      promiseReplaceImageElementStringsAll.push(
        _addImageDimensionsToElementStrings( match, file, mapImageElementStrings, callback )
      );
    } // for

    try {
      await Promise.all( promiseReplaceImageElementStringsAll );
      contents = contents.replace(
        imgRegEx,
        ( fullStr ) => mapImageElementStrings.get( fullStr ) || fullStr,
      );
      file.contents = Buffer.from( contents );
      callback( null, file );
    } catch ( err ) {
      callback( err );
    }
  } );

  /**
   * img || source 要素に width と height を追加する。
   * @param {object} match
   * @param {object} file
   * @param {function} errorCallback
   */
  async function _addImageDimensionsToElementStrings( match, file, map, errorCallback ) {
    const
      fullStr    = match[ 0 ]
      ,tagName   = match[ 1 ]
      ,frontPart = match[ 2 ]
      ,attrName  = match[ 3 ]
      ,q         = match[ 4 ]
      ,srcPath   = match[ 5 ]
      ,query     = match[ 6 ]
      ,rearPart  = match[ 7 ]
      ,preparedSrcPath = ( _isRootPath( srcPath ) )
        // ルートパスであれば
        ? join( resolve( process.cwd(), config.base ), srcPath )
        // 相対パスであれば
        : resolve( file.dirname, srcPath )
    ;
    try {
      const
        dimensions = await imageSizeFromFile( preparedSrcPath )
        ,elementWithSize  =
                    `<${ tagName }${ frontPart }${ attrName }=`
                  + `${ q }${ srcPath }${ query }${ q } `
                  + `width=${ q }${ dimensions.width }${ q } `
                  + `height=${ q }${ dimensions.height }${ q }${ rearPart }>`
      ;
      map.set( fullStr, elementWithSize );
    } catch ( err ) {
      errorCallback( err );
    }
  }
}

/**
 * 閉じタグ付近に付けるコメントに関する体裁。
 * @param {string} _all
 * @param {string} endTag
 * @param {string} lineFeed
 * @param {string} indent
 * @param {string} comment
 */
function _replacementEndComment( _all, endTag, lineFeed, indent, comment ) {
  const
    htmlComment = '<!--' + comment + '-->'
    ,positionInside = options.formatHtml.commentPosition === 'inside'
    ,oneLine = options.formatHtml.commentOnOneLine === true
    ,blankLine = options.formatHtml.blankLineAfterComment === true
  ;
  // コメントを閉じタグ内側に付けたい場合。
  if ( positionInside === true ) {
    // コメントと閉じタグを1行にまとめるか否か。
    // <!-- --></div>
    // or
    // <!-- -->
    // </div>
    if ( oneLine === true ) {
      // コメントの付いた閉じタグ後に空行をつけるか否か。
      return ( blankLine === true )
        ? htmlComment + endTag + lineFeed
        : htmlComment + endTag
      ;
    } else {
      //コメントの付いた閉じタグ後に空行をつけるか否か。
      return ( blankLine === true )
        ? htmlComment + lineFeed + indent + endTag + lineFeed
        : htmlComment + lineFeed + indent + endTag
      ;
    }

  // コメントを閉じタグ外側に付けたい場合。
  } else {
    // コメントと閉じタグを1行にまとめるか否か。
    // </div><!-- -->
    // or
    // </div>
    // <!-- -->
    if ( oneLine === true ) {
      // コメントの付いた閉じタグ後に空行をつけるか否か。
      return ( blankLine === true )
        ? endTag + htmlComment + lineFeed
        : endTag + htmlComment
      ;
    } else {
      // コメントの付いた閉じタグ後に空行をつけるか否か。
      return ( blankLine === true )
        ? endTag + lineFeed + indent + htmlComment + lineFeed
        : endTag + lineFeed + indent + htmlComment
      ;
    }
  }
}

/**
 * srcPath が外部の src か否かを調べる。
 * @param {string} srcPath
 * @return {boolean}
 */
function _isExternalSrc( srcPath ) {
  return /^\/\/|^https?:\/\//.test( srcPath );
}

/**
 * srcPath がルートパスか否かを調べる。
 * @param {string} srcPath
 * @return {boolean}
 */
function _isRootPath( srcPath ) {
  return /^\//.test( srcPath );
}
