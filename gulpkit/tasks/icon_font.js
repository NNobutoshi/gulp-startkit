import { cwd }            from 'node:process';
import { Buffer }         from 'node:buffer';
import { readFile, stat } from 'node:fs/promises';

import { src as gulpSrc, dest } from 'gulp';
import iconfont from 'gulp-iconfont';
import plumber  from 'gulp-plumber';
import gulpIf   from 'gulp-if';

import Handlebars from 'handlebars';
import through    from 'through2';
import Vinyl      from 'vinyl';

import lintSvg                from '../lib/lint_svg.js';
import assignTaskForEachGroup from '../lib/task_for_each.js';
import diff                   from '../lib/diff_build.js';
import logStreamData          from '../lib/log_stream_data.js';

import { config, options } from '../config/config_icon_font.js';

export { icon_font as default };

const
  CHARSET = 'utf-8'
  ,CWD = cwd()
  ,PLACEHOLDER = config.placeholder
  ,SCSS_FILE_REGEX = /\.scss$/
;

/**
 * @module tasks/icon_font
 * @requires node:process
 * @requires node:buffer
 * @requires node:fs/promises
 * @requires gulp
 * @requires gulp-iconfont
 * @requires gulp-plumber
 * @requires gulp-if
 * @requires handlebars
 * @requires through2
 * @requires vinyl
 * @requires ../lib/lint_svg.js
 * @requires ../lib/task_for_each.js
 * @requires ../lib/diff_build.js
 * @requires ../lib/log_stream_data.js
 * @requires ../config/config_icon_font.js
 */
/**
 * アイコンフォントとそのSCSS ファイルを作成するタスク。<br>
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
 * アイコンフォントの設定を行い作成する。<br>
 * アイコンフォント用のscss ファイルを作成する。
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
    ;
    const
      iconFontOptions = { ...options.iconfont,
        fontName : branchFontName,
        timestamp : await _getLatestTimestamp( branchSrc ),
      }
      ,templateData = { ...options.iconFontScss,
        fontName : branchFontName,
        scssDist : config.scssDist.replace( PLACEHOLDER, baseDir ),
      }
    ;
    const
      fontDist  = config.fontsDist.replace( PLACEHOLDER, baseDir )
      ,scssDist = templateData.scssDist
    ;
    return iconfont( branchSrc, iconFontOptions )
      .on( 'glyphs', _setGlyphsToTemplateData( templateData ) )
      .pipe( gulpIf( _isOptionalFontFile, dest( fontDist, { encoding : false } ) ) )
      .pipe( gulpIf( _isOptionalFontFile, logStreamData( options.logStreamData.iconFont ) ) )
      .pipe( _createScssFile( templateData, baseDir ) )
      .pipe( gulpIf( SCSS_FILE_REGEX, dest( scssDist ) ) )
      .pipe( gulpIf( SCSS_FILE_REGEX, logStreamData( options.logStreamData.scss ) ) )
    ;
  } catch ( err ) {
    trunkStream.emit( 'error', err );
    return;
  }
}

/**
 * SCSS ファイル作成の準備を行う。<br>
 * glypsh イベントのリスナー関数の引数からglypshs を受け取り、<br>
 * Handlebars 用のtemplateDataにglyphs データを代入。
 * @private
 * @param {Object} templateData - Handlebers 用のtemplateData
 * @returns glypshイベント用のリスナー関数を返す。
 */
function _setGlyphsToTemplateData( templateData ) {
  return ( glyphs ) => {
    glyphs.forEach( ( glyph ) => {
      // unicodeを16進数のcodepointに変換
      glyph.codepoint = glyph.unicode[ 0 ].codePointAt( 0 ).toString( 16 ).toUpperCase();
    } );
    templateData.glyphs = glyphs;
  };
}

/**
 * file （vinyl オブジェクト） のパスを参照し、<br>
 * オプションで指定のフォントフォーマットに該当するか否かを返す。
 * @private
 * @param {Object} file - vinyl オブジェクト
 * @returns {Boolean} Array.prototype.some の結果（真偽値）
 */
function _isOptionalFontFile( file ) {
  return options.iconfont.formats.some( element => file.path.endsWith( element ) );
}

/**
 * SCSSファイルを作成し、ストリームに流す。
 * @private
 * @param {Object} templateData - Handlebers 用のtemplateData
 * @returns {Promise<void>}
 */
function _createScssFile( templateData ) {
  return through.obj(
    function _noop( file, _enc, callback ) {
      callback( null, file );
    },
    async function _flush( callback ) {
      try {
        const
          content = await readFile( templateData.templatePath, CHARSET )
          ,sourceCode = Handlebars.compile( content )( templateData )
          ,file = new Vinyl( {
            cwd  : CWD,
            base : CWD,
            path : templateData.scssFileName,
            contents : Buffer.from( sourceCode ),
          } )
        ;
        this.push( file );
        callback();
      } catch ( err ) {
        callback( err );
      }
    },
  );
}

/**
 * ファイルのタイムスタンプ(stats.mtime)を取得し、最も新しいものを返す。<br>
 * タイムスタンプの違いでdist に差分が生じるのを防ぐ。
 * @private
 * @param {Array} filePaths - ファイルパスの配列
 * @returns {Number} - タイムスタンプ
 * @returns {Promise<void>}
 */
async function _getLatestTimestamp( filePaths ) {
  let
    latestTimestamp = Math.round( new Date( 0 ) / 1000 )
  ;
  for ( const filePath of filePaths ) {
    const
      stats = await stat( filePath )
      ,fileTimestamp = Math.round( stats.mtime / 1000 )
    ;
    if ( fileTimestamp > latestTimestamp ) {
      latestTimestamp = fileTimestamp;
    }
  }
  return latestTimestamp;
}
