import { src, dest } from 'gulp';
import svgSprite     from 'gulp-svg-sprite';
import plumber       from 'gulp-plumber';
import gulpIf        from 'gulp-if';

import diff                     from '../lib/diff_build.js';
import taskForEach              from '../lib/task_for_each.js';
import svgLint                  from '../lib/svg_lint.js';
import { sprite_svg as config } from '../config.js';

const
  options = config.options
;

export default function sprite_svg() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( svgLint() )
    .pipe( diff( options.diff ) )
    .pipe( taskForEach( config.group, config.base, _branchTask ) )
  ;
}

function _branchTask( subSrc, baseDir ) {
  return src( subSrc )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( gulpIf( /\.svg$/,  dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.base + baseDir ) ) )
    .pipe( gulpIf( /\.html$/, dest( config.dist + baseDir ) ) )
  ;
}
