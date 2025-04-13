import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { stat }                       from 'node:fs';

import { src, dest } from 'gulp';
import iconfont      from 'gulp-iconfont';
import plumber       from 'gulp-plumber';
import Handlebars    from 'handlebars';

import svgLint       from '../lib/svg_lint.js';
import taskForEach   from '../lib/task_for_each.js';
import diff          from '../lib/diff_build.js';
import logStreamData from '../lib/log_stream_data.js';

import { icon_font as config } from '../config.js';

const
  options  = config.options
  ,logOptionsScss = {
    forEachFile: false
    ,onStream: false
  }
  ,CHARSET           = 'utf-8'
  ,LOG_TITLE_FONT    = '[icon_font]:'
  ,LOG_SUBTITLE_FONT = 'created'
  ,LOG_TITLE_SCSS    = '[icon_font:scss]:'
  ,LOG_SUBTITLE_SCSS = 'generated'
;

export default function icon_font() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( svgLint() )
    .pipe( taskForEach( config.group, config.base, _branchTask ) )
  ;
}

/*
 * iconfontの設定を行う。
 * @param {Object} subSrc - iconfontのソース
 * @param {String} baseDir - グループ名
 * @param {Object} trunkStream - エラーを伝えるストリーム
 * @returns {Object} - iconfontのストリーム
 */
function _branchTask( subSrc, baseDir, trunkStream ) {
  const
    optIconfont     = Object.create( options.iconfont )
    ,fontSubName    = ( baseDir ) ? baseDir.replace( /\//, '_' ) : ''
    ,templateData   = {
      fontName: optIconfont.fontName.replace( '[subdir]', fontSubName )
      ,cssClass: config.cssClass
      ,fontPath: config.fontPath
      ,templatePath: config.templatePath
      ,scssDist: config.scssDist.replace( '[subdir]', baseDir )
    }
  ;
  optIconfont.fontName = templateData.fontName;
  optIconfont.timestamp = _setTimestampOption( subSrc );
  return iconfont( subSrc, optIconfont )
    .on( 'glyphs', _createScssByGlyphs( templateData, trunkStream ) )
    .pipe( dest( config.fontsDist.replace( '[subdir]', baseDir ), { encoding: false } ) )
    .pipe( logStreamData( LOG_TITLE_FONT, LOG_SUBTITLE_FONT ) )
  ;
}

/*
  * SCSSファイルを作成する前準備。
  * onGlyphsイベントにリスナー関数を渡す。
  * glyphs オブジェクトのunicodeを 16進数のcodepoint に変換してglyphsに追加する。
  * 引数にエラーを伝えるためのストリームを渡す。
  * @param {Object} templateData - iconfontの設定情報
  * @param {Object} trunkStream - エラーを伝えるストリーム
  * @returns {Function} - glyphsを受け取る関数
  */
function _createScssByGlyphs( templateData, trunkStream ) {
  return function( glyphs ) {
    templateData.glyphs = glyphs;
    for ( let i = 0; i < glyphs.length; i++ ) {
      glyphs[ i ].codepoint = glyphs[ i ]
        .unicode[ 0 ]
        .codePointAt( 0 )
        .toString( 16 )
        .toUpperCase()
      ;
    }
    _createScssFile( templateData, trunkStream );
  };
}

/*
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
      ,filePath = data.scssDist + '/' + config.scssFileName
     ;
    await mkdir( data.scssDist, { recursive: true } );
    await writeFile( filePath, sourceCode, { encoding: CHARSET } );
    logStreamData( `${ LOG_TITLE_SCSS } ${ filePath }`, LOG_SUBTITLE_SCSS, logOptionsScss );
  } catch ( error ) {
    errorStream.emit( 'error', error );
  }
}

/*
 * タイムスタンプの違いでdist に差分が生じるのを防ぐ。
  * @param {Array} arryFilePath - ファイルパスの配列
  * @returns {Number} - タイムスタンプ
 */
function _setTimestampOption( arryFilePath ) {
  let newer = new Date( 0 );
  arryFilePath.forEach( ( filePath ) => {
    stat( filePath, ( error, stats ) => {
      if ( error ) {
        return;
      }
      if ( stats.birthtime > newer ) {
        newer = Math.round( stats.birthtime / 1000 );
      }
    } );
  } );
  return newer;
}
