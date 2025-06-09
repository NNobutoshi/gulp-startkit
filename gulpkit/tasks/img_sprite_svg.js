import { src as gulpSrc, dest } from 'gulp';
import svgSprite from 'gulp-svg-sprite';
import plumber   from 'gulp-plumber';
import gulpIf    from 'gulp-if';

import diff                   from '../lib/diff_build.js';
import assignTaskForEachGroup from '../lib/task_for_each.js';
import lintSvg                from '../lib/lint_svg.js';
import logStreamData          from '../lib/log_stream_data.js';

import { config, options } from '../config/config_img_sprite_svg.js';

export { img_sprite_svg as default };

const
  SVG_FILE_REGEX   = /\.svg$/
  ,SCSS_FILE_REGEX = /\.scss$/
  ,HTML_FILE_REGEX = /\.html$/
;

/**
 * @module tasks/img_sprite_svg
 * @requires gulp
 * @requires gulp-svg-sprite
 * @requires gulp-plumber
 * @requires gulp-if
 * @requires ../lib/diff_build.js
 * @requires ../lib/task_for_each.js
 * @requires ../lib/lint_svg.js
 * @requires ../lib/log_stream_data.js
 * @requires ../config/config_img_sprite_svg.js
 */
/**
 * SVGスプライトを作成するタスク。<br>
 * default としてエクスポート。
 * @memberof module:tasks/img_sprite_svg
 * @returns {Stream} - Gulp ストリーム
 */
function img_sprite_svg() {
  return gulpSrc( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( lintSvg( options.lintSvg ) )
    .pipe( assignTaskForEachGroup( config.group, config.base, _branchTask ) )
  ;
}

/**
 * 任意に命名されたフォルダごとに、SVG スプライトを作成する。
 * @private
 * @param {Array} branchSrc - 基のストリームから分けられたグループごとのソース
 * @param {string} baseDir - 設定した任意のフォルダ名を末尾に持つパス
 * @returns {Stream} - Gulp ストリーム
 */
function _branchTask( branchSrc, baseDir ) {
  return gulpSrc( branchSrc )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( gulpIf( SVG_FILE_REGEX,  dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( SCSS_FILE_REGEX, dest( config.base + baseDir ) ) )
    .pipe( gulpIf( HTML_FILE_REGEX, dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( SVG_FILE_REGEX,  logStreamData( options.logStreamData.svg ) ) )
    .pipe( gulpIf( SCSS_FILE_REGEX, logStreamData( options.logStreamData.scss ) ) )
    .pipe( gulpIf( HTML_FILE_REGEX, logStreamData( options.logStreamData.html ) ) )
  ;
}
