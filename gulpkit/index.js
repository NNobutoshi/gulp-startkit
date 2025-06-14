/**
 * @module gulpkit/index
 * @requires gulp
 * @requires ./tasks/index.js
 * @requires ./lib/enable_watch_for.js
 */

import { series, parallel } from 'gulp';

import * as tasks from './tasks/index.js';
import enableWatchForCommandLineTask from './lib/enable_watch_for.js';

export { main as default, html, img, css, js, icon, watchForCommanLineTask };

/**
 * Gulp 実行時のdefault 用で全タスクを実行する。
 * @memberof module:gulpkit/index
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
 *     tasks.task_watch(
 *       [
 *         tasks.copy_to,
 *         tasks.img_min,
 *         tasks.html_pug,
 *         tasks.icon_font,
 *         tasks.img_sprite,
 *         tasks.img_sprite_svg,
 *         tasks.css_lint_scss,
 *         tasks.css_sass,
 *         tasks.js_eslint,
 *         tasks.js_webpack,
 *       ],
 *       tasks.reload_browse,
 *     ),
 *   )( done );
 * }
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
    tasks.task_watch(
      [
        tasks.copy_to,
        tasks.img_min,
        tasks.html_pug,
        tasks.icon_font,
        tasks.img_sprite,
        tasks.img_sprite_svg,
        tasks.css_lint_scss,
        tasks.css_sass,
        tasks.js_eslint,
        tasks.js_webpack,
      ],
      tasks.reload_browse,
    ),
  )( done );
}

/**
 * html 関連タスク用。
 * @memberof module:gulpkit/index
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function html( done ) {
 *   const members = [
 *     tasks.img_min,
 *     tasks.html_pug,
 *   ];
 *   series(
 *     ...members,
 *     tasks.init_browse,
 *     tasks.task_watch(
 *       members,
 *       tasks.reload_browse,
 *     ),
 *   )( done );
 * }
 */
function html( done ) {
  const members = [
    tasks.img_min,
    tasks.html_pug,
  ];
  series(
    ...members,
    tasks.init_browse,
    tasks.task_watch(
      members,
      tasks.reload_browse,
    ),
  )( done );
}

/**
 * img 関連タスク
 * @memberof module:gulpkit/index
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function img( done ) {
 *   const members = [
 *     tasks.img_min,
 *     tasks.img_sprite,
 *     tasks.img_sprite_svg,
 *     tasks.css_lint_scss,
 *     tasks.css_sass,
 *   ];
 *   series(
 *     ...members,
 *     tasks.init_browse,
 *     tasks.task_watch(
 *       members,
 *       tasks.reload_browse,
 *     ),
 *   )( done );
 * }
 */
function img( done ) {
  const members = [
    tasks.img_min,
    tasks.img_sprite,
    tasks.img_sprite_svg,
    tasks.css_lint_scss,
    tasks.css_sass,
  ];
  series(
    ...members,
    tasks.init_browse,
    tasks.task_watch(
      members,
      tasks.reload_browse,
    ),
  )( done );
}

/**
 * CSS 関連タスク
 * @memberof module:gulpkit/index
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function css( done ) {
 *   const members = [
 *     tasks.css_lint_scss,
 *     tasks.css_sass,
 *   ];
 *   series(
 *     ...members,
 *     tasks.init_browse,
 *     tasks.task_watch(
 *       members,
 *       tasks.reload_browse,
 *     ),
 *   )( done );
 * }
 */
function css( done ) {
  const members = [
    tasks.css_lint_scss,
    tasks.css_sass,
  ];
  series(
    ...members,
    tasks.init_browse,
    tasks.task_watch(
      members,
      tasks.reload_browse,
    ),
  )( done );
}

/**
 * JavaScript 関連タスク
 * @memberof module:gulpkit/index
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function js( done ) {
 *   const members = [
 *     tasks.js_eslint,
 *     tasks.js_webpack,
 *   ];
 *   series(
 *     ...members,
 *     tasks.init_browse,
 *     tasks.task_watch(
 *       members,
 *       tasks.reload_browse,
 *     ),
 *   )( done );
 * }
 */
function js( done ) {
  const members = [
    tasks.js_eslint,
    tasks.js_webpack,
  ];
  series(
    ...members,
    tasks.init_browse,
    tasks.task_watch(
      members,
      tasks.reload_browse,
    ),
  )( done );
}

/**
 * アイコン 関連タスク
 * @memberof module:gulpkit/index
 * @param {Function} done - gulp タスク完了のコールバック
 * @example
 * function icon( done ) {
 *   const members = [
 *     tasks.icon_font,
 *     tasks.css_lint_scss,
 *     tasks.css_sass,
 *   ];
 *   series(
 *     ...members,
 *     tasks.init_browse,
 *     tasks.task_watch(
 *       members,
 *       tasks.reload_browse,
 *     ),
 *   )( done );
 * }
 */
function icon( done ) {
  const members = [
    tasks.icon_font,
    tasks.css_lint_scss,
    tasks.css_sass,
  ];
  series(
    ...members,
    tasks.init_browse,
    tasks.task_watch(
      members,
      tasks.reload_browse,
    ),
  )( done );
}

/**
 * コマンドライン上 Gulp <task>
 * でタスクを個別に実行する際、watch や live reload も機能させる。
 * @memberof gulpkit/index
 */
function watchForCommanLineTask() {
  enableWatchForCommandLineTask( tasks );
}
