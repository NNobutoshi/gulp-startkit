/**
 * @module tasks/img_min
 * @requires gulp
 * @requires gulp-imagemin
 * @requires gulp-plumber
 * @requires imagemin-pngquant
 * @requires ../lib/diff_build.js
 * @requires ../lib/watch_task.js
 * @requires ../config/config_img_min.js
 */

import { src as gulpSrc, dest } from 'gulp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import plumber                                        from 'gulp-plumber';
import imageminPngquant                               from 'imagemin-pngquant';

import diff          from '../lib/diff_build.js';
import watchTask     from '../lib/watch_task.js';

import { config, options } from '../config/config_img_min.js';

export { img_min as default };

/**
 * 画像を圧縮するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/img_min
 * @returns {Stream} - Gulp ストリーム
 */
function img_min() {
  if ( options.watch.enabled === true && !img_min.watchIsEnabled ) {
    img_min.watchIsEnabled = true;
  }
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

if ( options.watch.enabled === true ) {
  watchTask( config.src, options.watch, img_min );
}

