import { series, parallel } from 'gulp';

import * as tasks from './tasks/index.js';
import enableWatchForCommandLineTask from './lib/enable_watch_for.js';

export { main as default, html, img, css, js, watchForCommanLineTask };

/**
 * @module gulpkit/index
 * @requires gulp
 * @requires ./tasks/index.js
 * @requires ./lib/enable_watch_for.js
 */
/**
 * Gulp 実行時のdefault 用で全タスクを実行する。
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function main( done ) {
 *   series(
 *     tasks.clean,
 *     parallel(
 *       tasks.copy_to,
 *       series(
 *         tasks.img_min,
 *         tasks.html_pug,
 *         parallel(
 *           tasks.icon_font,
 *           tasks.img_sprite,
 *           tasks.img_sprite_svg
 *         ),
 *         tasks.css_lint_scss,
 *         tasks.css_sass,
 *         tasks.js_eslint,
 *         tasks.js_webpack,
 *       )
 *     ),
 *     tasks.init_browse,
 *     tasks.task_watch( Object.values( tasks ), tasks.reload_browse ),
 *   )( done );
 */
function main( done ) {
  series(
    tasks.clean,
    parallel(
      tasks.copy_to,
      series(
        tasks.img_min,
        tasks.html_pug,
        parallel(
          tasks.icon_font,
          tasks.img_sprite,
          tasks.img_sprite_svg
        ),
        tasks.css_lint_scss,
        tasks.css_sass,
        tasks.js_eslint,
        tasks.js_webpack,
      )
    ),
    tasks.init_browse,
    tasks.task_watch( Object.values( tasks ), tasks.reload_browse ),
  )( done );
}

/**
 * html 関連タスク用。
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function html( done ) {
 *   series(
 *     tasks.img_min,
 *     tasks.html_pug,
 *     tasks.init_browse,
 *     series(
 *       tasks.task_watch( [
 *         tasks.img_min,
 *         tasks.html_pug,
 *       ],
 *       tasks.reload_browse ),
 *     ),
 *   )( done );
 * }
 */
function html( done ) {
  series(
    tasks.img_min,
    tasks.html_pug,
    tasks.init_browse,
    series(
      tasks.task_watch( [
        tasks.img_min,
        tasks.html_pug,
      ],
      tasks.reload_browse ),
    ),
  )( done );
}

/**
 * img 関連タスク
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function img( done ) {
 *   series(
 *     tasks.css_lint_scss,
 *     tasks.img_min,
 *     tasks.img_sprite,
 *     tasks.img_sprite_svg,
 *     tasks.css_sass,
 *     tasks.init_browse,
 *     series(
 *       tasks.task_watch( [
 *         tasks.css_lint_scss,
 *         tasks.img_min,
 *         tasks.img_sprite,
 *         tasks.img_sprite_svg,
 *         tasks.css_sass,
 *       ],
 *       tasks.reload_browse ),
 *     ),
 *   )( done );
 + }
 */
function img( done ) {
  series(
    tasks.css_lint_scss,
    tasks.img_min,
    tasks.img_sprite,
    tasks.img_sprite_svg,
    tasks.css_sass,
    tasks.init_browse,
    series(
      tasks.task_watch( [
        tasks.css_lint_scss,
        tasks.img_min,
        tasks.img_sprite,
        tasks.img_sprite_svg,
        tasks.css_sass,
      ],
      tasks.reload_browse ),
    ),
  )( done );
}

/**
 * CSS 関連タスク
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function css( done ) {
 *   series(
 *     tasks.css_lint_scss,
 *     tasks.css_sass,
 *     tasks.init_browse,
 *     series(
 *       tasks.task_watch( [
 *         tasks.css_lint_scss,
 *         tasks.css_sass,
 *       ],
 *       tasks.reload_browse ),
 *     ),
 *   )( done );
 * }
 */
function css( done ) {
  series(
    tasks.css_lint_scss,
    tasks.css_sass,
    tasks.init_browse,
    series(
      tasks.task_watch( [
        tasks.css_lint_scss,
        tasks.css_sass,
      ],
      tasks.reload_browse ),
    ),
  )( done );
}

/**
 * JavaScript 関連タスク
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function js( done ) {
 *   series(
 *     tasks.js_eslint,
 *     tasks.js_webpack,
 *     tasks.init_browse,
 *     series(
 *       tasks.task_watch( [
 *         tasks.js_eslint,
 *         tasks.js_webpack,
 *       ],
 *       tasks.reload_browse ),
 *     ),
 *   )( done );
 * }
 */
function js( done ) {
  series(
    tasks.js_eslint,
    tasks.js_webpack,
    tasks.init_browse,
    series(
      tasks.task_watch( [
        tasks.js_eslint,
        tasks.js_webpack,
      ],
      tasks.reload_browse ),
    ),
  )( done );
}

/**
 * コマンドライン上 Gulp <task>
 * でタスクを個別に実行する際、watch や live reload も機能させる。
 * @param {Function} done - gulp タスク完了のコールバック
 */
function watchForCommanLineTask() {
  enableWatchForCommandLineTask( tasks );
}
