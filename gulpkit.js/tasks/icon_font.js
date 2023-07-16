import gulp        from 'gulp';
import iconfont    from 'gulp-iconfont';
import iconfontCss from 'gulp-iconfont-css';
import plumber     from 'gulp-plumber';
import through     from 'through2';

import svgLint     from '../lib/svg_lint.js';
import taskForEach from '../lib/task_for_each.js';
import diff        from '../lib/diff_build.js';
import configFile  from '../config.js';

const
  { src, dest } = gulp
;

const
  config = configFile.icon_font
  ,options = config.options
;

options.iconfont.timestamp = 0;

export default function icon_font() {
  return src( config.src )
    .pipe( diff( options.diff ) )
    .pipe( taskForEach( config.group, config.base, _branchTask ) )
  ;
}

function _branchTask( subSrc, baseDir ) {
  return src( subSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( svgLint() )
    .pipe( _setTimestampOption( options.iconfont.timestamp ) )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( dest( config.fontsDist.replace( '[subdir]', baseDir ) ) )
    .on( 'finish', () => {
      src( config.fontsCopyFrom.replace( '[subdir]', baseDir ) )
        .pipe( dest( config.fontsCopyTo.replace( '[subdir]', baseDir )  ) )
      ;
    } )
  ;
}

/*
 * タイムスタンプの違いでdist に差分が生じるのを防ぐ。
 */
function _setTimestampOption() {
  let newer = new Date( 0 );
  return through.obj( ( file, enc, callBack ) => {
    if ( file.stat && file.stat.birthtime > newer ) {
      newer = Date.parse( file.stat.birthtime ) / 1000;
    }
    callBack( null, file );
  }, ( callBack ) => {
    options.iconfont.timestamp = newer;
    callBack();
  } );
}
