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

/** @module tasks/img_sprite_svg */
/**
 * SVGスプライトを作成するタスク。<br>
 * default としてエクスポート。
 * @returns {Object} - Gulp stream
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
 * 任意に命名されたフォルダ毎に、SVG スプライトを作成する。
 * @param {Array} branchSrc - 基のストリームから分けられたグループ毎のソース
 * @param {String} baseDir - 設定した任意のフォルダ名を末尾に持つパス
 * @returns {Stream} - Gulp stream
 */
function _branchTask( branchSrc, baseDir ) {
  return gulpSrc( branchSrc )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( gulpIf( /\.svg$/,  dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.base + baseDir ) ) )
    .pipe( gulpIf( /\.html$/, dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( /\.svg$/,  logStreamData( options.logStreamData.svg ) ) )
    .pipe( gulpIf( /\.scss$/, logStreamData( options.logStreamData.scss ) ) )
    .pipe( gulpIf( /\.html$/, logStreamData( options.logStreamData.html ) ) )
  ;
}
