import { src, dest } from 'gulp';
import svgSprite     from 'gulp-svg-sprite';
import plumber       from 'gulp-plumber';
import gulpIf        from 'gulp-if';

import diff        from '../lib/diff_build.js';
import taskForEach from '../lib/task_for_each.js';
import svgLint     from '../lib/svg_lint.js';
import logStreamData from '../lib/log_stream_data.js';

import { img_sprite_svg as config } from '../config.js';

const
  LOG_TITLE_SVG      = '[img_sprite_svg]:'
  ,LOG_SUBTITLE_SVG  = 'created'
  ,LOG_TITLE_SCSS    = '[img_sprite_svg:scss]:'
  ,LOG_SUBTITLE_SCSS = 'generated'
  ,LOG_TITLE_HTML    = '[img_sprite_svg:html]:'
  ,LOG_SUBTITLE_HTML = 'created'
;
const
  options = config.options
  ,logOptions = {
    forEachFile : false,
  }
;
export default function img_sprite_svg() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( svgLint() )
    .pipe( taskForEach( config.group, config.base, _branchTask ) )
  ;
}

function _branchTask( subSrc, baseDir ) {
  return src( subSrc )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( gulpIf( /\.svg$/,  dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( /\.svg$/,  logStreamData( LOG_TITLE_SVG, LOG_SUBTITLE_SVG, logOptions ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.base + baseDir ) ) )
    .pipe( gulpIf( /\.scss$/, logStreamData( LOG_TITLE_SCSS, LOG_SUBTITLE_SCSS, logOptions ) ) )
    .pipe( gulpIf( /\.html$/, dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( /\.html$/, logStreamData( LOG_TITLE_HTML, LOG_SUBTITLE_HTML, logOptions ) ) )
  ;
}
