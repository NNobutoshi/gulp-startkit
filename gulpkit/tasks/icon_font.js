import { src, dest } from 'gulp';
import iconfont      from 'gulp-iconfont';
import iconfontCss   from 'gulp-iconfont-css';
import plumber       from 'gulp-plumber';
import gulpIf        from 'gulp-if';
import through       from 'through2';

import svgLint                 from '../lib/svg_lint.js';
import taskForEach             from '../lib/task_for_each.js';
import diff                    from '../lib/diff_build.js';
import { icon_font as config } from '../config.js';

const
  options = config.options
;

export default function icon_font() {
  return src( config.src )
    .pipe( diff( options.diff ) )
    .pipe( taskForEach( config.group, config.base, _branchTask ) )
  ;
}

function _branchTask( subSrc, baseDir ) {
  const
    optIconfont     = Object.create( options.iconfont )
    ,optIconfontCss = Object.create( options.iconfontCss )
  ;
  if ( baseDir ) {
    const fontSubName = baseDir.replace( /\//, '_' );
    optIconfont.fontName = optIconfont.fontName.replace( '[subdir]', fontSubName );
    optIconfontCss.fontName = optIconfontCss.fontName.replace( '[subdir]', fontSubName );
  } else {
    optIconfont.fontName = optIconfont.fontName.replace( '[subdir]', '' );
    optIconfontCss.fontName = optIconfontCss.fontName.replace( '[subdir]', '' );
  }
  return src( subSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( svgLint() )
    .pipe( _setTimestampOption( optIconfont ) )
    .pipe( iconfontCss( optIconfontCss ) )
    .pipe( iconfont( optIconfont ) )
    .pipe( gulpIf(
      ( file ) => {
        return optIconfont.formats.some(
          ( format ) => new RegExp( `\\.${ format }$` ).test( file.path )
        );
      }
      ,dest( config.fontsDist.replace( '[subdir]', baseDir ), { encoding: false } )
    ) )
    .pipe(
      gulpIf( /\.scss$/, dest( config.scssDist.replace( '[subdir]', baseDir ) ) )
    )
  ;
}

/*
 * タイムスタンプの違いでdist に差分が生じるのを防ぐ。
 */
function _setTimestampOption( optIconfont ) {
  let
    newer = new Date( 0 )
  ;
  return through.obj(
    ( file, enc, callBack ) => {
      if ( file.stat && file.stat.birthtime > newer ) {
        newer = Math.round( file.stat.birthtime / 1000 );
      }
      callBack( null, file );
    }
    ,( callBack ) => {
      optIconfont.timestamp = newer;
      callBack();
    }
  );
}
