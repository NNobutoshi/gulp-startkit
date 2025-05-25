import { src as gulpSrc, dest } from 'gulp';
import spriteSmith from 'gulp.spritesmith';
import plumber     from 'gulp-plumber';
import gulpIf      from 'gulp-if';

import assignTaskForEachGroup from '../lib/task_for_each.js';
import diff                   from '../lib/diff_build.js';
import logStreamData          from '../lib/log_stream_data.js';

import { config, options } from '../config/config_img_sprite.js';

export { img_sprite as default };

const
  PLACEHOLDER = config.placeholder
  ,PNG_FILE_REGEX  = /\.png$/
  ,SCSS_FILE_REGEX = /\.scss$/
;

/**
 * @module tasks/img_sprite
 * @requires gulp
 * @requires gulp.spritesmith
 * @requires gulp-plumber
 * @requires gulp-if
 * @requires ../lib/task_for_each.js
 * @requires ../lib/diff_build.js
 * @requires ../lib/log_stream_data.js
 * @requires ../config/config_img_sprite.js
 */
/**
 * PNGスプライトを作成するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/img_sprite
 * @returns {Object} - Gulp stream
 */
function img_sprite() {
  return gulpSrc( config.src, { encoding : false } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( assignTaskForEachGroup( config.group, config.base, _branchTask ) )
  ;
}

/**
 * 任意の各フォルダ毎に、PNG スプライトを作成する。<br>
 * @private
 * @param {Array} branchSrc - 基のストリームから分けられたグループ毎のソース
 * @param {String} baseDir - 設定した任意のフォルダ名を末尾に持つパス
 * @returns {Stream} - Gulp stream
 */
function _branchTask( branchSrc, baseDir ) {
  const
    imgDist = config.imgDist.replace( PLACEHOLDER, baseDir )
    ,scssDist = config.scssDist.replace( PLACEHOLDER, baseDir )
  ;
  return gulpSrc( branchSrc, { encoding : false } )
    .pipe( spriteSmith( options.sprite ) )
    .pipe( gulpIf( PNG_FILE_REGEX, dest( imgDist, { encoding : false } ) ) )
    .pipe( gulpIf( SCSS_FILE_REGEX, dest( scssDist ) ) )
    .pipe( gulpIf( PNG_FILE_REGEX,  logStreamData( options.logStreamData.png ) ) )
    .pipe( gulpIf( SCSS_FILE_REGEX, logStreamData( options.logStreamData.scss ) ) )
  ;
}
