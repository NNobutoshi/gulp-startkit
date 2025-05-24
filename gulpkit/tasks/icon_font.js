import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';

import { src as gulpSrc, dest } from 'gulp';
import iconfont from 'gulp-iconfont';
import plumber  from 'gulp-plumber';

import Handlebars from 'handlebars';

import lintSvg                from '../lib/lint_svg.js';
import assignTaskForEachGroup from '../lib/task_for_each.js';
import diff                   from '../lib/diff_build.js';
import logStreamData          from '../lib/log_stream_data.js';

import { config, options } from '../config/config_icon_font.js';

export { icon_font as default };

const
  CHARSET = 'utf-8'
  ,PLACEHOLDER = config.placeholder
;

/**
 * @module tasks/icon_font
 * @requires node:fs/promises
 * @requires gulp
 * @requires gulp-iconfont
 * @requires gulp-plumber
 * @requires handlebars
 * @requires ../lib/lint_svg.js
 * @requires ../lib/task_for_each.js
 * @requires ../lib/diff_build.js
 * @requires ../lib/log_stream_data.js
 * @requires ../config/config_icon_font.js
 */
/**
 * アイコンフォントを作成するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/icon_font
 * @returns {Stream} - Gulp stream
 */
function icon_font() {
  return gulpSrc( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( lintSvg( options.lintSvg ) )
    .pipe( assignTaskForEachGroup( config.group, config.base, _branchTask ) )
  ;
}

/**
 * iconfontの設定を行い、アイコンフォントの作成を行う。
 * @private
 * @param {Array} branchSrc - 基のストリームから分けられたグループ毎のソース
 * @param {String} baseDir - 設定した任意のフォルダ名を末尾に持つパス
 * @param {Stream} trunkStream - エラーを伝えるストリーム
 * @returns {Stream} - iconfontのストリーム
 */
async function _branchTask( branchSrc, baseDir, trunkStream ) {
  try {
    const
      branchFontName = options.iconfont.fontName.replace( PLACEHOLDER, baseDir.replace( /\//, '_' ) )
      ,iconFontOptions = { ...options.iconfont,
        fontName : branchFontName,
        timestamp : await _getTimestamp( branchSrc ),
      }
      ,templateData = { ...options.iconFontScss,
        fontName : branchFontName,
        scssDist : config.scssDist.replace( PLACEHOLDER, baseDir ),
      }
    ;
    return iconfont( branchSrc, iconFontOptions )
      .on( 'glyphs', _createScssFromGlyphs( templateData, trunkStream ) )
      .pipe( dest( config.fontsDist.replace( PLACEHOLDER, baseDir ), { encoding : false } ) )
      .pipe( logStreamData( options.logStreamData.iconFont ) )
    ;
  } catch ( err ) {
    trunkStream.emit( 'error', err );
    return;
  }
}

/**
 * SCSS ファイル作成の準備を行う。<br>
 * 引数にエラーを伝えるためのストリームを渡す。
 * @private
 * @param {Object} templateData - iconfontの設定情報
 * @param {Object} trunkStream - エラーを伝えるために必要
 * @returns {Function} - glyphsを受け取る関数
 */
function _createScssFromGlyphs( templateData, trunkStream ) {
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
 * @private
 * @param {Object} data - iconfontの設定情報
 * @param {Object} errorStream - エラーを伝えるストリーム
 * @returns {Promise<void>}
 */
async function _createScssFile( templateData, errorStream ) {
  try {
    const
      content     = await readFile( templateData.templatePath, CHARSET )
      ,sourceCode = Handlebars.compile( content )( templateData )
      ,filePath   = `${ templateData.scssDist }/${ templateData.scssFileName }`
      ,logOptions = { ...options.logStreamData.scss }
     ;
    await mkdir( templateData.scssDist, { recursive : true } );
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
 * @private
 * @param {Array} filePaths - ファイルパスの配列
 * @returns {Number} - タイムスタンプ
 * @returns {Promise<void>}
 */
async function _getTimestamp( filePaths ) {
  let
    latestTimeStamp = Math.round( new Date( 0 ) / 1000 )
  ;
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
}
