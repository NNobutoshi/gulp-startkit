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
 * @requires ../lib/watch_task.js
 * @requires ../config/config_html_pug.js
 */

import { cwd }    from 'node:process';
import { Buffer } from 'node:buffer';
import path       from 'node:path';

import { src as gulpSrc, dest } from 'gulp';
import plumber  from 'gulp-plumber';
import pug      from 'pug';
import through  from 'through2';
import beautify from 'js-beautify';
import fancyLog from 'fancy-log';
import chalk    from 'chalk';
import { imageSizeFromFile } from 'image-size/fromFile';

import diff, { organizeSelectedFileMap } from '../lib/diff_build.js';
import logStreamData                     from '../lib/log_stream_data.js';
import watchTask                         from '../lib/watch_task.js';

import { config, options } from '../config/config_html_pug.js';

export { html_pug as default };

const
  CWD = cwd(),
  BASE_COMMON_DATA_NAME = '_pug_common_data'
;


/**
 * Pug を実行するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/html_pug
 * @returns {Stream} - Gulp ストリーム
 */
function html_pug() {
  const
    pugCommonDataMap = new Map(),
    pugPageData      = new Map()
  ;
  if ( options.watch.enabled === true && !html_pug.watchIsEnabled ) {
    html_pug.watchIsEnabled = true;
  }
  return gulpSrc( config.dataSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( _loadPugData( pugCommonDataMap, pugPageData ) )
    .pipe( gulpSrc( config.src.concat( config.dataSrc ) ) )
    .pipe( gulpSrc( config.imgSrc, { read : false } ) ) // 画像ファイルの更新も検知させる。
    .pipe( diff( options.diff ,_collectImporterFiles ,organizeSelectedFileMap ) )
    .pipe( _setPugData( pugCommonDataMap, pugPageData ) )
    .pipe( _renderPug() )
    .pipe( _formatHtml() )
    .pipe( _injectImageSize() )
    .pipe( dest( config.dist ) )
    .pipe( logStreamData( options.logStreamData ) )
  ;
}

if ( options.watch.enabled === true ) {
  watchTask( config.src.concat( config.dataSrc, config.imgSrc ), options.watch, html_pug );
}

/**
 * Gulp src で流れてくるPug データ用JSON ファイルを読み込み、パースを行う。<br>
 * パースしたデータは、各ページ共通で値を利用するpugCoomonDataMap と、<br>
 * 各ページ固有に利用するpugPageData とで別々に格納する。<br>
 * データはPug の実行時にPug に渡すデータとして使用する。
 * @private
 * @param {Map} pugCommonDataMap - 各ページ共通で値を利用するデータのMap
 * @param {Map} pugPageData - 各ページ固有に利用するデータのMap
 * @returns {Stream} - Gulp ストリーム
 */
function _loadPugData( pugCommonDataMap, pugPageData ) {
  return through.obj( function _transform( file, enc, callback ) {
    let data;
    try {
      data = JSON.parse( file.contents.toString() );
    } catch ( err ) {
      return callback( err );
    }
    if ( file.path.includes( BASE_COMMON_DATA_NAME ) === true ) {
      pugCommonDataMap.set( file.path, data );
    } else {
      Object.keys( data ).forEach( ( key ) => {
        pugPageData.set( key, data[ key ] );
      } );
    }
    callback();
  } );
}

/**
 * Pug の実行前に、Pug に渡すデータをセットする。
 * @private
 * @param {Map} pugCommonDataMap - 各ページ共通で値を利用するデータのMap
 * @param {Map} pugPageData - 各ページ固有に利用するデータのMap
 * @returns {Stream} - Gulp ストリーム
 */
function _setPugData( pugCommonDataMap, pugPageData ) {
  return through.obj( function _transform( file, enc, callback ) {
    // 名前が _ で始まるファイルや、.pug で終わらないファイルは処理しない。
    if (
      file.path.endsWith( '.pug' ) === false ||
      file.basename.startsWith( '_' ) === true
    ) {
      return callback( null, file );
    }
    const siteRootPath = _getSiteRootPath( file.path ).replace( /\.pug$/, '.html' );
    const myPageData = pugPageData.get( siteRootPath );
    const commonDataFilePath = myPageData?.common;
    const
      commonData = ( commonDataFilePath )
        ? _getPugCommonData( myPageData.common, pugCommonDataMap )
        : {}
    ;
    if ( !myPageData ) {
      fancyLog(
        chalk.yellow( `[Warning] No Pug data found for ${ siteRootPath }.` )
      );
      file.data = {
        pageData : { url : siteRootPath },
      };
      return callback( null, file );
    }
    if ( !commonDataFilePath ) {
      fancyLog(
        chalk.yellow( `[Warning] No common data file path specified for ${ siteRootPath }.` )
      );
    }
    file.data = {
      // common 用を基にpage 用をマージする。
      pageData : {
        ...commonData,
        ...myPageData,
      },
    };
    callback( null, file );
  } );
}

/**
 * 各ページ共通用のJSON ファイルのパスをキーにしている値を、_loadPugData() で準備したpugCommonDataMap から取得する。<br>
 * 共通用のJSON データのパスは各ページごと個別にcommon プロパティで指定されている。
 * @param {string} commonDataFilePath - 各ページごと個別に定されている共通用JSONデータのパス
 * @param {Map} pugCommonDataMap - ページ共通のデータが格納されたMap
 * @returns {object} - 引数で渡されたパスをkey にするMap の値
 */
function _getPugCommonData( commonDataFilePath, pugCommonDataMap ) {
  const
    reslovedCommonDataFilePath = path.join(
      path.resolve( CWD, config.base ),
      commonDataFilePath,
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
 * @param {object} file - vinyl オブジェクト
 * @param {Map} collectedFiles - 依存関係を格納する Map
 */
function _collectImporterFiles( file, collectedFiles ) {
  const
    contents = file.contents?.toString?.()
  ;
  if ( !contents ) {
    return;
  }
  const
    importRuleRegEx = /(^.*?(extends|include)\s*(.+)$)|((img|source)\s*?\(.*?(src|srcset)=["']([^"'?]+)\??[^"'?]*["'].*?\))/mg
  ;
  const
    matches = contents.matchAll( importRuleRegEx )
  ;
  for ( const match of matches ) {
    const
      srcPath = match[ 3 ] || match[ 7 ]
    ;
    if ( _isExternalSrc( srcPath ) === true || !srcPath ) {
      continue;
    }
    const
      dependencyFilePath = _getAbsolutePath( srcPath, config.base, file.dirname )
    ;
    if ( collectedFiles.has( dependencyFilePath ) === false ) {
      collectedFiles.set( dependencyFilePath, [] );
    }
    collectedFiles.get( dependencyFilePath )?.push( file.path );
  } // for
}

/**
 * Pug の実行。
 * @private
 * @returns {Stream} - Gulp ストリーム
 */
function _renderPug() {
  return through.obj( function _transform( file, enc, callback ) {
    if ( file.basename.startsWith( '_' ) === true || file.basename.endsWith( '.pug' ) === false ) {
      return callback();
    }
    const
      pugOptions = { ...options.pug,
        self     : true,
        filename : file.path,
        pageData : file.data.pageData,
      }
    ;
    try {
      const
        html = pug.render( file.contents.toString(), pugOptions )
      ;
      file.contents = Buffer.from( html );
      file.path = file.path.replace( /\.pug$/, '.html' );
      callback( null, file );
    } catch ( err ) {
      return callback( err );
    }
  } );
}

/**
 * Pug の実行後、HTML ファイルに対して実行。
 * HTML の体裁を整える。
 * @private
 * @returns {Stream} - Gulp ストリーム
 */
function _formatHtml() {
  const
    { uglyAElementRegEx, endCommentRegEx, commentPosition } = options.formatHtml
  ;
  return through.obj( function _transform( file, enc, callback ) {
    let contents = file.contents.toString();
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
          const
            fixed = element
              .replace( '><a ', '>' + linefeed + '<a ' )
              .replace( '</a>', '</a>' + linefeed )
          ;
          return beautify.html( fixed, options.beautify ).replace( /^/mg, indent );
        },
      );
    } // if
    // オプションで指定があれば、インデントをトル。
    if ( options.formatHtml.indent === false ) {
      contents = contents.replace( /^([^\S\n\r\f]+)/mg, '' );
    }
    // 閉じタグ付近に付けるコメントに関する体裁。
    if ( commentPosition === 'inside' || commentPosition === 'outside' ) {
      contents = contents.replace( endCommentRegEx, _formatEndComment );
    }
    file.contents = Buffer.from( contents );
    callback( null, file );
  } );
}

/**
 * img サイズの自動挿入
 * @private
 * @returns {Stream} - Gulp ストリーム
 */
function _injectImageSize() {
  const
    imageElementTagMap = new Map()
  ;
  if ( options.imgSize === false ) {
    return through.obj();
  }
  return through.obj( async function _transform( file, enc, callback ) {
    const
      imgRegEx = options.injectImageSize.imgRegEx,
      allPromisesToReplacing = []
    ;
    let contents = file.contents.toString();
    for ( const match of contents.matchAll( imgRegEx ) ) {
      const
        frontPart = match[ 2 ],
        srcPath   = match[ 5 ],
        rearPart  = match[ 7 ]
      ;
      if (
        _isExternalSrc( srcPath ) === true
        || ( frontPart.includes( 'width' ) === true || frontPart.includes( 'height' ) === true )
        || ( rearPart.includes( 'width' )  === true || rearPart.includes( 'height' )  === true )
      ) {
        continue;
      }
      allPromisesToReplacing.push(
        _addImageDimensions( match, file, imageElementTagMap, callback )
      );
    } // for

    try {
      await Promise.all( allPromisesToReplacing );
      contents = contents.replace(
        imgRegEx,
        ( fullStr ) => imageElementTagMap.get( fullStr ) || fullStr,
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
 * @param {object} match RegExp から得られるマッチした文字列が格納された配列
 * @param {object} file 参照するファイル（vinyl オブジェクト）
 * @param {Map} map match[0] をkey にし、値にwidth 、height が設定されたimg 要素の文字列を代入するMap オブジェクト
 * @param {function} errorCallback ストリームにエラーを伝えるCallback
 * @returns {Promise<void>}
 */
async function _addImageDimensions( match, file, map, errorCallback ) {
  const
    fullStr   = match[ 0 ],
    tagName   = match[ 1 ],
    frontPart = match[ 2 ],
    attrName  = match[ 3 ],
    quote     = match[ 4 ],
    srcPath   = match[ 5 ],
    query     = match[ 6 ],
    rearPart  = match[ 7 ],
    absoluteSrcPath = _getAbsolutePath( srcPath, config.base, file.dirname )
  ;
  try {
    const
      dimensions = await imageSizeFromFile( absoluteSrcPath )
    ;
    const
      elementWithSize = ''
        + '<'
        + `${ tagName }${ frontPart }${ attrName }=`
        + `${ quote }${ srcPath }${ query }${ quote } `
        + `width=${ quote }${ dimensions.width }${ quote } `
        + `height=${ quote }${ dimensions.height }${ quote }${ rearPart }`
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
 * @param {string} _full RegExP で得られるマッチする全文字列
 * @param {string} closingTag RegExP で得られる閉じタグにあたる文字列
 * @param {string} lineFeed RegExP で得られる改行コードにあたる文字列
 * @param {string} indent RegExP で得られるインデントにあたる文字列
 * @param {string} comment RegExP で得られるコメントタグの'&lt;!--'と'--&gt;'を除く文字列
 * @returns {string} 置換文字列
 */
function _formatEndComment( _full, closingTag, lineFeed, indent, comment ) {
  const
    htmlComment = `<!--${ comment }-->`,
    { commentPosition, commentOnOneLine, blankLineAfterComment } = options.formatHtml
  ;
  const
    commentIsInside = ( commentPosition === 'inside' )
  ;
  const
    // コメントと閉じタグの順序を決定。
    parts = ( commentIsInside === true )
      ? [ htmlComment, closingTag ]
      : [ closingTag, htmlComment ],
    joiner = ( commentOnOneLine === true )
      ? ''
      : `${ lineFeed }${ indent }`
  ;
  // 改行の有無を決定。
  let
    result = parts.join( joiner )
  ;
  // 空行を付ける場合。
  if ( blankLineAfterComment === true ) {
    result += lineFeed;
  }

  return result;
}

/**
 * srcPath が外部の src か否かを調べる。
 * @private
 * @param {string} srcPath
 * @returns {boolean}
 */
function _isExternalSrc( srcPath ) {
  return /^\/\/|^https?:\/\//.test( srcPath );
}

/**
 * サイトルートパスにする。
 * @private
 * @param {string} filePath 絶対パス
 * @returns {string} サイトルートパス
 */
function _getSiteRootPath( filePath ) {
  return filePath
    .replace( path.resolve( CWD, config.base ), '' )
    .replace( /\\/g, '/' )
  ;
}

/**
 * srcPath を絶対パスにする。
 * @private
 * @param {string} srcPath
 * @param {string} base
 * @param {string} dirname
 * @returns {string} - 絶対パス
 */
function _getAbsolutePath( srcPath, base, dirname ) {
  return ( _isRootPath( srcPath ) )
  // ルートパスであれば
    ? path.join( path.resolve( CWD, base ), srcPath )
  // 相対パスであれば
    : path.resolve( dirname, srcPath );
}

/** srcPath がルートパスか否かを調べる。
 * @private
 * @param {string} srcPath
 * @returns {boolean}
 */
function _isRootPath( srcPath ) {
  return /^\//.test( srcPath );
}
