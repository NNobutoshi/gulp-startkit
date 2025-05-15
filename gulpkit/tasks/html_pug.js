import { readFileSync } from 'node:fs';
import { Buffer }       from 'node:buffer';
import path             from 'node:path';

import { src, dest } from 'gulp';
import plumber       from 'gulp-plumber';
import pug           from 'pug';
import through       from 'through2';
import beautify      from 'js-beautify';
import { imageSizeFromFile } from 'image-size/fromFile';

import diff, { organizeSelectedFileMap } from '../lib/diff_build.js';
import logStreamData                     from '../lib/log_stream_data.js';

import { config, options } from '../config/config_html_pug.js';

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
    .pipe( src( config.subsrc, { read : false } ) ) // 画像ファイルの更新も検知させる。
    .pipe( diff( options.diff ,_collectImporterFiles ,organizeSelectedFileMap ) )
    .on( 'data', _setPugData )
    .pipe( _renderPug() )
    .pipe( _formatHtml() )
    .pipe( _injectImageSize() )
    .pipe( dest( config.dist ) )
    .pipe( logStreamData( options.logStreamData ) )
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
    .replace( path.resolve( process.cwd(), config.base ), '' )
    .replace( /\\/g, '/' )
    .replace( /\.pug$/, '.html' )
  ;
  file.data = {
    siteData : pugData.defaults,
    pageData : pugData[ keyFilePath ],
  };
}

/**
 * インポート元のファイルを収集してMap に追加する。
 * through2 のtransformFunction の内部で実行。
 * chunk のcontents から読み込んでいるパスを調べ、自身をインポーターとして収集。
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
function _collectImporterFiles( file, collectedFiles ) {
  const
    contents         = String( file.contents )
    ,importRuleRegEx = /(^.*?(extends|include)\s*(.+)$)|((img|source)\s*?\(.*?(src|srcset)=["']([^"'?]+)\??[^"'?]*["'].*?\))/mg
    ,matches         = contents.matchAll( importRuleRegEx )
  ;
  for ( const match of matches ) {
    const
      srcPath = match[ 3 ] || match[ 7 ]
    ;
    if ( _isExternalSrc( srcPath ) === true || !srcPath ) {
      continue;
    }
    const dependencyFilePath = _absolutePath( srcPath, config.base, file.dirname );
    if ( collectedFiles.has( dependencyFilePath ) === false ) {
      collectedFiles.set( dependencyFilePath, [] );
    }
    collectedFiles.get( dependencyFilePath )?.push( file.path );
  } // for
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
        self     : true,
        filename : file.path,
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
        contents = contents.replace( /^([^\S\n\r\f]+)/mg, '' );
      }
      // 閉じタグ付近に付けるコメントに関する体裁。
      if ( options.formatHtml.commentPosition ) {
        contents = contents.replace( endCommentRegEx, _replaceEndComment );
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
   * @param {Object} match
   * @param {Object} file
   * @param {Map} map
   * @param {Function} errorCallback
   * @returns {Promise<void>}
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
      ,absoluteSrcPath = _absolutePath( srcPath, config.base, file.dirname )
    ;
    try {
      const
        dimensions = await imageSizeFromFile( absoluteSrcPath )
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
 * @param {String} _full
 * @param {String} endTag
 * @param {String} lineFeed
 * @param {String} indent
 * @param {String} comment
 * @returns {String} 置換文字列
 */
function _replaceEndComment( _full, endTag, lineFeed, indent, comment ) {
  const
    htmlComment     = '<!--' + comment + '-->'
    ,positionInside = options.formatHtml.commentPosition === 'inside'
    ,oneLine        = options.formatHtml.commentOnOneLine === true
    ,blankLine      = options.formatHtml.blankLineAfterComment === true
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
 * @param {String} srcPath
 * @return {Boolean}
 */
function _isExternalSrc( srcPath ) {
  return /^\/\/|^https?:\/\//.test( srcPath );
}

/** srcPath がルートパスか否かを調べる。
 * @param {String} srcPath
 * @return {Boolean}
 */
function _isRootPath( srcPath ) {
  return /^\//.test( srcPath );
}

/**
 * srcPath を絶対パスにする。
 * @param {String} srcPath
 * @param {String} base
 * @param {String} dirname
 * @return {String} - 絶対パス
 */
function _absolutePath( srcPath, base, dirname ) {
  return ( _isRootPath( srcPath ) )
  // ルートパスであれば
    ? path.join( path.resolve( process.cwd(), base ), srcPath )
  // 相対パスであれば
    : path.resolve( dirname, srcPath );
}
