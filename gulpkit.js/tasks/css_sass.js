import path from 'node:path';

import { src, dest } from 'gulp';
import * as dartSass from 'sass';
import gulpSass      from 'gulp-sass';
import gulpIf        from 'gulp-if';
import sourcemaps    from 'gulp-sourcemaps';
import plumber       from 'gulp-plumber';
import postcss       from 'gulp-postcss';
import cssMqpacker   from 'css-mqpacker';

import diff, { selectTargetFiles } from '../lib/diff_build.js';
import renderingLog                from '../lib/rendering_log.js';
import { css_sass as config }      from '../config.js';

const sass = gulpSass( dartSass );

const
  options = config.options
;

export default function css_sass() {
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff, _collectTargetFiles, selectTargetFiles ) )
    .pipe( gulpIf( config.sourcemap, sourcemaps.init() ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf( config.sourcemap, sourcemaps.write( config.sourcemap_dir ) ) )
    .pipe( dest( config.dist ) )
    .pipe( renderingLog( '[css_sass]:' ) )
  ;
}

/*
 * 依存関係を調べ、Objectにまとめる。
 * through2 のtransformFunction 中で実行。
 * chunk のcontents から読み込んでいるパスを調べる
 *
 * collection
 * {
 *   '読み込んでいるパス': [
 *     'chunk自身のパス'
 *    ]
 * }
 */
function _collectTargetFiles( file, collection ) {
  const
    contents = String( file.contents )
    ,regex = /^.*?@(use|forward) *['"]([^:\n]+)(\.?s?c?s?s?)['"]/mg
    ,matches = contents.matchAll( regex )
  ;
  for ( const match of matches ) {
    let
      dependentFilePath
    ;
    dependentFilePath = path.resolve( file.dirname, match[ 2 ] );
    if ( !match[ 3 ] ) {
      dependentFilePath += '.scss';
    }
    if ( /^_/.test( path.basename( dependentFilePath ) ) === false ) {
      dependentFilePath = path.join(
        path.dirname( dependentFilePath ),
        path.basename( dependentFilePath ).replace( /^/, '_' )
      );
    }
    if ( !collection[ dependentFilePath ] ) {
      collection[ dependentFilePath ] = [];
    }
    collection[ dependentFilePath ].push( file.path );
  } // for
}
