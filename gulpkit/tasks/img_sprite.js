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
;

/** @module tasks/img_sprite */
/**
 * PNGスプライトを作成するタスク。<br>
 * default としてエクスポート。
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
 * @param {Array} branchSrc - 基のストリームから分けられたグループ毎のソース
 * @param {String} baseDir - 設定した任意のフォルダ名を末尾に持つパス
 * @returns {Stream} - Gulp stream
 */
function _branchTask( branchSrc, baseDir ) {
  return gulpSrc( branchSrc, { encoding : false } )
    .pipe( spriteSmith( options.sprite ) )
    .pipe( gulpIf( /\.png$/,  dest( config.imgDist.replace( PLACEHOLDER, baseDir ), { encoding : false } ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.scssDist.replace( PLACEHOLDER, baseDir ) ) ) )
    .pipe( gulpIf( /\.png$/,  logStreamData( options.logStreamData.png ) ) )
    .pipe( gulpIf( /\.scss$/, logStreamData( options.logStreamData.scss ) ) )
  ;
}
