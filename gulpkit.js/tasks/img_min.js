import { src, dest }                                  from 'gulp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import plumber                                        from 'gulp-plumber';
import imageminPngquant                               from 'imagemin-pngquant';

import { diff_1on1 }         from '../lib/diff_build.js';
import { img_min as config } from '../config.js';

const
  options = config.options
;


export default function img_min() {
  return diff_1on1( src, config.src, mainTask, options.diff );
}

function mainTask( fixedSrc, resolve ) {
  return src( fixedSrc, options.src )
    .pipe( plumber( options.plumber ) )
    .pipe( imagemin( [
      mozjpeg( options.imageminMozjpeg ),
      imageminPngquant( options.imageminPngquant ),
      svgo( options.svgo ),
      optipng(),
      gifsicle(),
    ] ) )
    .pipe( dest( config.dist ) )
    .on( 'finish', resolve )
  ;
}
