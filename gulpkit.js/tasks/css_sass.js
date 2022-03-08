import fs          from 'fs';
import path        from 'path';
import gulp        from 'gulp';
import dartSass    from 'sass';
import gulpSass    from 'gulp-sass';
import plumber     from 'gulp-plumber';
import postcss     from 'gulp-postcss';
import cssMqpacker from 'css-mqpacker';

import diff                   from '../lib/diff_build.js';
import { selectTargetFiles  } from '../lib/diff_build.js';
import renderingLog           from '../lib/rendering_log.js';
import configFile             from '../config.js';

const
  { src, dest } = gulp
  ,sass         = gulpSass( dartSass )
;
const
  config = configFile.css_sass
  ,options = config.options
;
export default function css_sass() {
  const
    srcOptions   = { sourcemaps : config.sourcemap }
    ,destOptions = { sourcemaps : config.sourcemap_dir }
  ;
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff, _collectTargetFiles, selectTargetFiles ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( dest( config.dist, destOptions ) )
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
      ,_dependentFilePath
    ;
    dependentFilePath = path.resolve( file.dirname, match[ 2 ] );
    if ( !match[ 3 ] ) {
      dependentFilePath += '.scss';
    }
    if ( /^_/.test( path.basename( dependentFilePath ) ) === false ) {
      _dependentFilePath = path.join(
        path.dirname( dependentFilePath ),
        path.basename( dependentFilePath ).replace( /^/, '_' )
      );
      if ( fs.statSync( _dependentFilePath ) ) {
        dependentFilePath = _dependentFilePath;
      }
    }
    if ( !collection[ dependentFilePath ] ) {
      collection[ dependentFilePath ] = [];
    }
    collection[ dependentFilePath ].push( file.path );
  }
}
