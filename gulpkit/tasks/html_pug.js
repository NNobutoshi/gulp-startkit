import { cwd }    from 'node:process';
import { Buffer } from 'node:buffer';
import path       from 'node:path';

import { src as gulpSrc, dest } from 'gulp';
import plumber  from 'gulp-plumber';
import pug      from 'pug';
import through  from 'through2';
import beautify from 'js-beautify';
import { imageSizeFromFile } from 'image-size/fromFile';

import diff, { organizeSelectedFileMap } from '../lib/diff_build.js';
import logStreamData                     from '../lib/log_stream_data.js';

import { config, options } from '../config/config_html_pug.js';

export { html_pug as default };

const
  CWD = cwd()
;
let
  pugCommonDataMap = new Map()
  ,pugPageData = {}
;

/**
 * @module tasks/html_pug
 * @requires node:process
 * @requires node:path
 * @requires node:buffer
 * @requires node:fs
 * @requires gulp
 * @requires gulp-plumber
 * @requires pug
 * @requires through2
 * @requires js-beautify
 * @requires image-size/fromFile
 * @requires ../lib/diff_build.js
 * @requires ../lib/log_stream_data.js
 * @requires ../config/config_html_pug.js
 */
/**
 * Pug を実行するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/html_pug
 * @returns {Object} - Gulp stream
 */
function html_pug() {
  return gulpSrc( config.dataSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( _loadPugData() )
    .pipe( gulpSrc( config.src ) )
    .pipe( gulpSrc( config.subsrc, { read : false } ) ) // 画像ファイルの更新も検知させる。
    .pipe( diff( options.diff ,_collectImporterFiles ,organizeSelectedFileMap ) )
    .pipe( _setPugData() )
    .pipe( _renderPug() )
    .pipe( _formatHtml() )
    .pipe( _injectImageSize() )
    .pipe( dest( config.dist ) )
    .pipe( logStreamData( options.logStreamData ) )
  ;
}

/**
 * Gulp src で流れてくるPug 用JSON ファイルを読み込み、パースを行う。
 * パースしたデータは共通用とページ固有用とでそれぞれ、pugCoomonDataMap とpugPageData に格納する。
 * データはPug の実行時にPug に渡すデータとして使用する。
 * @private
 * @returns {Object} - Gulp stream
 */
function _loadPugData() {
  return through.obj( function _transform( file, enc, callback ) {
    const
      data = JSON.parse( String( file.contents ) )
    ;
    if ( file.path.includes( '_common_' ) ) {
      pugCommonDataMap.set( file.path, data );
    } else {
      pugPageData = { ...pugPageData, ...data };
    }
    callback();
  } );
}

/**
 * Pug の実行前に、Pug に渡すデータをセットする。<br>
 * @private
 * @returns {Object} - Gulp stream
 */
function _setPugData() {
  return through.obj( function _transform( file, enc, callback ) {
    if ( file.path.endsWith( '.pug' ) === true ) {
      const
        keyFilePath = file.path
          .replace( path.resolve( CWD, config.base ), '' )
          .replace( /\\/g, '/' )
          .replace( /\.pug$/, '.html' )
      ;
      const
        commonDataFilePath = pugPageData[ keyFilePath ]?.common
      ;
      if ( !commonDataFilePath ) {
        return callback( null, file );
      }
      const
        pugCommonData = _getPugCommonData( commonDataFilePath, pugCommonDataMap )
      ;
      file.data = {
        // common 用を基にpage 用をマージする。
        pageData : { ...pugCommonData, ...pugPageData[ keyFilePath ] },
      };
    }
    callback( null, file );
  } );
}

/**
 * ページそれぞれで指定されている共通用JSONデータのパスをキーにしている値を、<br>
 * _loadPugData() で準備したpugCommonDataMap から取得する。
 * @param {String} commonDataFilePath - ページそれぞれから指定されている共通用JSONデータのパス
 * @param {Map} pugCommonDataMap - ページ共通のデータが格納されたMap
 * @returns {Object} - 引数で渡されたパスをkey にするMap の値
 */
function _getPugCommonData( commonDataFilePath, pugCommonDataMap ) {
  const
    reslovedCommonDataFilePath = path.join(
      path.resolve( CWD, config.base ), commonDataFilePath
    )
  ;
  return pugCommonDataMap.get( reslovedCommonDataFilePath );
}

/**
 * diff_build 用コールバック関数。<br>
 * インポート元のファイルを収集してMap に追加する。<br>
 * through2 のtransformFunction の内部で実行。<br>
 * chunk のcontents から読み込んでいるパスを調べ、自身をインポーターとして収集。
 *
 * @example
 * collectedFiles
 * {
 *   '読み込んでいるパス': [
 *     'chunk自身のパス'
 *   ]
 * }
 * @private
 * @param {Object} file - vinyl オブジェクト
 * @param {Map} collectedFiles - 依存関係を格納する Map
 */
function _collectImporterFiles( file, collectedFiles ) {
  const
    contents = String( file.contents )
  ;
  const
    importRuleRegEx = /(^.*?(extends|include)\s*(.+)$)|((img|source)\s*?\(.*?(src|srcset)=["']([^"'?]+)\??[^"'?]*["'].*?\))/mg
    ,matches = contents.matchAll( importRuleRegEx )
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
 * @private
 * @returns {object} - Gulp stream
 */
function _renderPug() {
  const ignoreFileRegEx = /^_|\.(png|jpg|svg)$/;
  return through.obj(
    function _transform( file, enc, callback ) {
      if ( ignoreFileRegEx.test( file.basename ) === true ) {
        return callback();
      }
      const pugOptions = { ...options.pug,
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
 * @private
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
 * @private
 * @returns {object} - Gulp stream
 */
function _injectImageSize() {
  const mapImageElementStrings = new Map();
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

}

/**
 * img || source 要素に width と height を追加する。
 * @private
 * @param {Object} match RegExp から得られるマッチした文字列が格納された配列
 * @param {Object} file 参照するファイル（vinyl オブジェクト）
 * @param {Map} map match[0] をkey にし、値にwidth 、height が設定されたimg 要素の文字列を代入するMap オブジェクト
 * @param {Function} errorCallback ストリームにエラーを伝えるCallback
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
    ;
    const
      elementWithSize = ''
        + '<'
        + `${ tagName }${ frontPart }${ attrName }=`
        + `${ q }${ srcPath }${ query }${ q } `
        + `width=${ q }${ dimensions.width }${ q } `
        + `height=${ q }${ dimensions.height }${ q }${ rearPart }`
        + '>'
    ;
    map.set( fullStr, elementWithSize );
  } catch ( err ) {
    errorCallback( err );
  }
}

/**
 * 閉じタグ付近に付けるコメントに関する体裁を整える。
 * @private
 * @param {String} _full RegExP で得られるマッチする全文字列
 * @param {String} endTag RegExP で得られる閉じタグにあたる文字列
 * @param {String} lineFeed RegExP で得られる改行コードにあたる文字列
 * @param {String} indent RegExP で得られるインデントにあたる文字列
 * @param {String} comment RegExP で得られるコメントタグの'&lt;!--'と'--&gt;'を除く文字列
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
 * @private
 * @param {String} srcPath
 * @return {Boolean}
 */
function _isExternalSrc( srcPath ) {
  return /^\/\/|^https?:\/\//.test( srcPath );
}

/** srcPath がルートパスか否かを調べる。
 * @private
 * @param {String} srcPath
 * @return {Boolean}
 */
function _isRootPath( srcPath ) {
  return /^\//.test( srcPath );
}

/**
 * srcPath を絶対パスにする。
 * @private
 * @param {String} srcPath
 * @param {String} base
 * @param {String} dirname
 * @return {String} - 絶対パス
 */
function _absolutePath( srcPath, base, dirname ) {
  return ( _isRootPath( srcPath ) )
  // ルートパスであれば
    ? path.join( path.resolve( CWD, base ), srcPath )
  // 相対パスであれば
    : path.resolve( dirname, srcPath );
}
