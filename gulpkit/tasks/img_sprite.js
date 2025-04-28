import { src, dest } from 'gulp';
import spriteSmith   from 'gulp.spritesmith';
import plumber       from 'gulp-plumber';
import gulpIf        from 'gulp-if';

import handleTaskForEachGroup from '../lib/task_for_each.js';
import diff                   from '../lib/diff_build.js';
import logStreamData          from '../lib/log_stream_data.js';

import { img_sprite as config } from '../config.js';

const
  LOG_TITLE_PNG      = '[img_sprite:png]:'
  ,LOG_SUBTITLE_PNG  = 'created'
  ,LOG_TITLE_SCSS    = '[img_sprite:scss]:'
  ,LOG_SUBTITLE_SCSS = 'generated'
;
const
  options = config.options
  ,logOptions = {
    forEachFile : false,
  }
;

/**
 * PNGスプライトを作成するタスク。
 * @returns {Object} - Gulp stream
 */
export default function img_sprite() {
  return src( config.src, { encoding: false } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( handleTaskForEachGroup( config.group, config.base, _branchTask ) )
  ;
}

/**
 * 任意の各フォルダ毎に、PNGスプライトを作成する。
 * @param {Array} subSrc - PNGスプライトのソース
 * @param {String} baseDir - グループ名
 * @returns {Object} - Gulp stream
 */
function _branchTask( subSrc, baseDir ) {
  return src( subSrc, { encoding : false } )
    .pipe( spriteSmith( options.sprite ) )
    .pipe( gulpIf( /\.png$/ ,  dest( config.imgDist.replace( '[subdir]', baseDir ), { encoding :false } ) ) )
    .pipe( gulpIf( /\.png$/,  logStreamData( LOG_TITLE_PNG, LOG_SUBTITLE_PNG, logOptions ) ) )
    .pipe( gulpIf( /\.scss$/ , dest( config.scssDist.replace( '[subdir]', baseDir ) ) ) )
    .pipe( gulpIf( /\.scss$/,  logStreamData( LOG_TITLE_SCSS, LOG_SUBTITLE_SCSS, logOptions ) ) )
  ;
}
