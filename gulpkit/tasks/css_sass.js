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
  options = config.options
  ,SOURCEMAPS_ENABLED = config.enabledSourcemaps
;

if ( config.enabledCssMqpack === true ) {
  options.postcss.plugins.push( mqpacker() );
}

/**
 * Sass を実行するタスク。
 * @returns {Stream} - Gulp stream
 */
export default function css_sass() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff, _collectImporterFiles, organizeSelectedFileMap ) )
    .pipe( gulpIf( ( SOURCEMAPS_ENABLED === true ), sourcemaps.init() ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf( SOURCEMAPS_ENABLED, sourcemaps.write( config.sourcemap_dir ) ) )
    .pipe( dest( config.dist ) )
    .pipe( gulpIf( /\.css$/, logStreamData( options.logStreamData.scss ) ) )
    .pipe( gulpIf( /\.map$/, logStreamData( options.logStreamData.sourceMaps ) ) )
  ;
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
 * @param {Map} collectedFiles
 */
function _collectImporterFiles( file, collectedFiles ) {
  const
    contents         = String( file.contents )
    ,importRuleRegEx = /^.*?@(use|forward)\s*['"]([^:\n]+)(\.?s?c?s?s?)['"]/mg
    ,matches         = contents.matchAll( importRuleRegEx )
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
      dependencyFilePath = resolve( file.dirname, srcPath )
      ,depFilePathBasename
    ;
    // 拡張子がない場合は .scss を追加。
    if ( !extension ) {
      dependencyFilePath += '.scss';
    }
    depFilePathBasename = basename( dependencyFilePath );
    // アンダースコアがない場合は補う。
    // 制作ルールとしてパーシャルファイルには必ずアンダースコアをつけるという前提！
    if ( depFilePathBasename.startsWith( '_' )  === false ) {
      dependencyFilePath = join(
        dirname( dependencyFilePath ),
        `_${ depFilePathBasename }`,
      );
    }
    if ( collectedFiles.has( dependencyFilePath ) === false ) {
      collectedFiles.set( dependencyFilePath, [] );
    }
    collectedFiles.get( dependencyFilePath )?.push( file.path );
  } // for
}
