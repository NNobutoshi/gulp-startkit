import gulp                                           from 'gulp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import plumber                                        from 'gulp-plumber';
import imageminPngquant                               from 'imagemin-pngquant';

import diff       from '../lib/diff_build.js';
import configFile from '../config.js';

const
  { src, dest, lastRun } = gulp
;
const
  config = configFile.img_min
  ,options = config.options
;

/*
 * one source → one destination なので diff build はGulp.lastRun と併用する。
 */
export default function img_min() {
  return src( config.src, { since : lastRun( img_min ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( imagemin( [
      mozjpeg( options.imageminMozjpeg ),
      imageminPngquant( options.imageminPngquant ),
      svgo( options.svgo ),
      optipng(),
      gifsicle(),
    ] ) )
    .pipe( dest( config.dist ) )
  ;
}
