import path from 'node:path';

import { src as gulpSrc, dest } from 'gulp';
import * as dartSass from 'sass';
import gulpSass      from 'gulp-sass';
import gulpIf        from 'gulp-if';
import sourcemaps    from 'gulp-sourcemaps';
import plumber       from 'gulp-plumber';
import postcss       from 'gulp-postcss';

import diff, { organizeSelectedFileMap } from '../lib/diff_build.js';
import logStreamData                     from '../lib/log_stream_data.js';

import { config, options } from '../config/config_css_sass.js';

export { css_sass as default };

const sass = gulpSass( dartSass );

const
  SOURCEMAPS_ENABLED = config.enabledSourcemaps
;

/** @module tasks/css_sass */
/**
 * Sass を実行するタスク。<br>
 * default としてエクスポート。
 * @returns {Stream} - Gulp stream
 */
function css_sass() {
  return gulpSrc( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff, _collectImporterFiles, organizeSelectedFileMap ) )
    .pipe( gulpIf( ( SOURCEMAPS_ENABLED === true ), sourcemaps.init() ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf( ( SOURCEMAPS_ENABLED === true ), sourcemaps.write( config.sourcemaps_dir ) ) )
    .pipe( dest( config.dist ) )
    .pipe( gulpIf( /\.css$/, logStreamData( options.logStreamData.scss ) ) )
    .pipe( gulpIf( /\.map$/, logStreamData( options.logStreamData.sourceMaps ) ) )
  ;
}

/**
 * インポート元のファイルを収集してMap に追加する。<br>
 * through2 のtransformFunction の内部で実行。<br>
 * chunk のcontents から読み込んでいるパスを調べ、自身をインポーターとして収集。<br>
 * @example
 * collectedFiles
 * {
 *   '読み込んでいるパス': [
 *     'chunk自身のパス'
 *   ]
 * }
 * @param {Object} file - vinyl オブジェクト
 * @param {Map} collectedFiles - 依存関係を格納する Map
 */
function _collectImporterFiles( file, collectedFiles ) {
  const
    contents = String( file.contents )
    ,importRuleRegEx = /^.*?@(use|forward)\s*['"]([^:\n]+)(\.?s?c?s?s?)['"]/mg
    ,matches = contents.matchAll( importRuleRegEx )
  ;
  for ( const match of matches ) {
    const
      extension = match[ 3 ]
      ,srcPath  = match[ 2 ]
    ;
    if ( !srcPath ) {
      continue;
    }
    let
      dependencyFilePath = path.resolve( file.dirname, srcPath )
      ,depFilePathBasename
    ;
    // 拡張子がない場合は .scss を追加。
    if ( !extension ) {
      dependencyFilePath += '.scss';
    }
    depFilePathBasename = path.basename( dependencyFilePath );
    // アンダースコアがない場合は補う。
    // 制作ルールとしてパーシャルファイルには必ずアンダースコアをつけるという前提！
    if ( depFilePathBasename.startsWith( '_' )  === false ) {
      dependencyFilePath = path.join(
        path.dirname( dependencyFilePath ),
        `_${ depFilePathBasename }`,
      );
    }
    if ( collectedFiles.has( dependencyFilePath ) === false ) {
      collectedFiles.set( dependencyFilePath, [] );
    }
    collectedFiles.get( dependencyFilePath )?.push( file.path );
  } // for
}
