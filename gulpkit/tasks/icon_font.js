import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';

import { src, dest } from 'gulp';
import iconfont      from 'gulp-iconfont';
import plumber       from 'gulp-plumber';

import Handlebars    from 'handlebars';

import svgLint                from '../lib/svg_lint.js';
import assignTaskForEachGroup from '../lib/task_for_each.js';
import diff                   from '../lib/diff_build.js';
import logStreamData          from '../lib/log_stream_data.js';

import { icon_font as config } from '../config.js';

const
  CHARSET = 'utf-8'
;
const
  options = config.options
  ,PLACEHOLDER = config.placeholder
;

/**
 * アイコンフォントを作成するタスク。
 * @returns {Stream} - Gulp stream
 */
export default function icon_font() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( svgLint( options.svgLint ) )
    .pipe( assignTaskForEachGroup( config.group, config.base, _branchTask ) )
  ;
}

/**
 * iconfontの設定を行い、アイコンフォントの作成を行う。
 * @param {Array} branchSrc - 基のストリームから分けられたグループ毎のソース
 * @param {String} baseDir - 設定した任意のフォルダ名を末尾に持つパス
 * @param {Stream} trunkStream - エラーを伝えるストリーム
 * @returns {Stream} - iconfontのストリーム
 */
async function _branchTask( branchSrc, baseDir, trunkStream ) {
  const
    iconFontOptions = { ...options.iconfont }
    ,logOptions     = options.logStreamData.iconFont
    ,fontSubName    = ( baseDir ) ? baseDir.replace( /\//, '_' ) : ''
    ,templateData   = {
      fontName     : iconFontOptions.fontName.replace( PLACEHOLDER, fontSubName ),
      cssClass     : config.cssClass,
      fontPath     : config.fontPath,
      templatePath : config.templatePath,
      scssDist     : config.scssDist.replace( PLACEHOLDER, baseDir ),
    }
  ;
  try {
    iconFontOptions.fontName = templateData.fontName;
    iconFontOptions.timestamp = await _getTimestamp( branchSrc );
    return iconfont( branchSrc, iconFontOptions )
      .on( 'glyphs', _generateScssFromGlyphs( templateData, trunkStream ) )
      .pipe( dest( config.fontsDist.replace( PLACEHOLDER, baseDir ), { encoding : false } ) )
      .pipe( logStreamData( logOptions ) )
    ;
  } catch ( err ) {
    trunkStream.emit( 'error', err );
    return;
  }
}

/**
 * iconfont の設定と、アイコンフォントの作成を行う。
 * SCSS ファイル作成の準備を行う。
 * 引数にエラーを伝えるためのストリームを渡す。
 * @param {Object} templateData - iconfontの設定情報
 * @param {Object} trunkStream - エラーを伝えるために必要
 * @returns {Function} - glyphsを受け取る関数
 */
function _generateScssFromGlyphs( templateData, trunkStream ) {
  return function( glyphs ) {
    glyphs.forEach( ( glyph ) => {
      // unicodeを16進数のcodepointに変換
      glyph.codepoint = glyph.unicode[ 0 ].codePointAt( 0 ).toString( 16 ).toUpperCase();
    } );
    templateData.glyphs = glyphs;
    _createScssFile( templateData, trunkStream );
  };
}

/**
 * SCSSファイルを作成する
 * @param {Object} data - iconfontの設定情報
 * @param {Object} errorStream - エラーを伝えるストリーム
 * @returns {Promise<void>}
 */
async function _createScssFile( data, errorStream ) {
  try {
    const
      content = await readFile( data.templatePath, CHARSET )
      ,template = Handlebars.compile( content )
      ,sourceCode = template( data )
      ,filePath = `${ data.scssDist }/${ config.scssFileName }`
      ,logOptions = options.logStreamData.scss
     ;
    await mkdir( data.scssDist, { recursive : true } );
    await writeFile( filePath, sourceCode, { encoding : CHARSET } );
    logOptions.subtitle = `${ filePath } ${ logOptions.subtitle }`;
    logStreamData( logOptions );
  } catch ( err ) {
    errorStream.emit( 'error', err );
  }
}

/**
 * ファイルのタイムスタンプ(stats.mtime)を取得し、最も新しいものを返す。
 * タイムスタンプの違いでdist に差分が生じるのを防ぐ。
 * @param {Array} filePaths - ファイルパスの配列
 * @returns {Number} - タイムスタンプ
 * @returns {Promise<void>}
 */
async function _getTimestamp( filePaths ) {
  let
    latestTimeStamp = Math.round( new Date( 0 ) / 1000 )
  ;
  try {
    for ( const filePath of filePaths ) {
      const
        stats = await stat( filePath )
        ,fileTimestamp = Math.round( stats.mtime / 1000 )
      ;
      if ( fileTimestamp > latestTimeStamp ) {
        latestTimeStamp = fileTimestamp;
      }
    }
    return latestTimeStamp;
  } catch ( err ) {
    throw err;
  }
}
