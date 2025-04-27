import { basename, dirname, resolve, join } from 'node:path';

import { src, dest } from 'gulp';
import * as dartSass from 'sass';
import gulpSass      from 'gulp-sass';
import gulpIf        from 'gulp-if';
import sourcemaps    from 'gulp-sourcemaps';
import plumber       from 'gulp-plumber';
import postcss       from 'gulp-postcss';
import mqpacker      from '@hail2u/css-mqpacker';

import diff, { organizeSelectedFileMap } from '../lib/diff_build.js';
import logStreamData                     from '../lib/log_stream_data.js';

import { css_sass as config } from '../config.js';

const sass = gulpSass( dartSass );

const
  LOG_TITLE_CSS     = '[css_sass]:'
  ,LOG_SUBTITLE_CSS = 'compiled'
  ,LOG_TITLE_MAP    = '[css_sass:map]:'
  ,LOG_SUBTITLE_MAP = 'created'
;

const
  options = config.options
  ,mapLogOptions = {
    forEachFile : false,
  }
  ,sourcemapsEnabled = config.sourcemapsEnabled
;

/**
 * Sass を実行するタスク。
 * @returns {Object} - Gulp stream
 */
export default function css_sass() {
  if (
    config.cssMqpackEnabled &&
    options.postcss.plugins.some( ( p ) => p.postcssPlugin === 'mqpacker' ) === false
  ) {
    options.postcss.plugins.push( mqpacker() );
  }
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff, _collectDependencyFiles, organizeSelectedFileMap ) )
    .pipe( gulpIf( ( sourcemapsEnabled === true ), sourcemaps.init() ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf( sourcemapsEnabled, sourcemaps.write( config.sourcemap_dir ) ) )
    .pipe( dest( config.dist ) )
    .pipe( gulpIf( /\.map$/, logStreamData( LOG_TITLE_MAP, LOG_SUBTITLE_MAP, mapLogOptions ) ) )
    .pipe( gulpIf( /\.css$/, logStreamData( LOG_TITLE_CSS, LOG_SUBTITLE_CSS ) ) )
  ;
}

/**
 * 依存関係を調べ、Objectにまとめる。
 * through2 のtransformFunctionの内部で実行。
 * chunk のcontents から読み込んでいるパスを調べる
 *
 * collectedFiles
 * {
 *   '読み込んでいるパス': [
 *     'chunk自身のパス'
 *    ]
 * }
 * @param {object} file
 * @param {object} collectedFiles
 */
function _collectDependencyFiles( file, collectedFiles ) {
  const
    contents = String( file.contents )
    ,regex   = /^.*?@(use|forward) *['"]([^:\n]+)(\.?s?c?s?s?)['"]/mg
    ,matches = contents.matchAll( regex )
  ;
  for ( const match of matches ) {
    let
      dependencyFilePath = resolve( file.dirname, match[ 2 ] )
      ,targets
      ,depFilePathBasename
    ;
    const
      extension = match[ 3 ]
    ;
    // 拡張子がない場合は .scss を追加。
    if ( !extension ) {
      dependencyFilePath += '.scss';
    }
    depFilePathBasename = basename( dependencyFilePath );
    // アンダースコアがない場合は補う。
    if ( depFilePathBasename.startsWith( '_' )  === false ) {
      dependencyFilePath = join(
        dirname( dependencyFilePath ),
        '_' + depFilePathBasename
      );
    }
    if ( collectedFiles.has( dependencyFilePath ) === false ) {
      collectedFiles.set( dependencyFilePath, [] );
    }
    targets = collectedFiles.get( dependencyFilePath );
    if ( targets.includes( dependencyFilePath ) === false ) {
      targets.push( file.path );
    }
  } // for
}
