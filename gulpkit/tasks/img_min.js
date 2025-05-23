import { src as gulpSrc, dest } from 'gulp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import plumber                                        from 'gulp-plumber';
import imageminPngquant from 'imagemin-pngquant';

import diff from '../lib/diff_build.js';

import { config, options } from '../config/config_img_min.js';

export { img_min as default };

/** @module tasks/img_min */
/**
 * 画像を圧縮するタスク。
 * default としてエクスポート。
 * @returns {Stream} - Gulp stream
 */
function img_min() {
  return gulpSrc( config.src, options.gulpSrc )
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

