/**
 * @module gulpkit/index
 * @requires node:process
 * @requires gulp
 * @requires ./tasks/index.js
 * @requires ./config/constants.js
 * @requires ./utilities/event_emitter.js
 * @requires ./lib/watch_task.js
 * @requires ./tasks/browse.js
 */

import process from 'node:process';

import { series, parallel } from 'gulp';

import * as tasks from './tasks/index.js';
import { BEFORE_EXIT_EVENT_NAME, RAN_WATCH_TASK_EVENT_NAME } from './config/constants.js';
import { eventEmitter }                                      from './utilities/event_emitter.js';
import { init_watch }                                        from './lib/watch_task.js';
import { init_browsing, reload_browsing }                    from './tasks/browse.js';

export { main as default, html, img, css, js, icon };

/**
 * Gulp 実行時のdefault 用で全タスクを実行する。
 * @memberof module:gulpkit/index
 * @param {function} done - gulp タスク完了のコールバック
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
  )( done );
}

/**
 * html 関連タスク用。
 * @memberof module:gulpkit/index
 * @param {function} done - gulp タスク完了のコールバック
 * @example
 * function html( done ) {
 *   series(
 *     tasks.img_min,
 *     tasks.html_pug,
 *   )( done );
 * }
 */ function html( done ) {
  series(
    tasks.img_min,
    tasks.html_pug,
  )( done );
}

/**
 * img 関連タスク
 * @memberof module:gulpkit/index
 * @param {function} done - gulp タスク完了のコールバック
 * @example
 * function img( done ) {
 *   series(
 *     tasks.img_min,
 *     tasks.img_sprite,
 *     tasks.img_sprite_svg,
 *     tasks.css_lint_scss,
 *     tasks.css_sass,
 *   )( done );
 * }
 */
function img( done ) {
  series(
    tasks.img_min,
    tasks.img_sprite,
    tasks.img_sprite_svg,
    tasks.css_lint_scss,
    tasks.css_sass,
  )( done );
}

/**
 * CSS 関連タスク
 * @memberof module:gulpkit/index
 * @param {function} done - gulp タスク完了のコールバック
 * @example
 * function css( done ) {
 *   series(
 *     tasks.css_lint_scss,
 *     tasks.css_sass,
 *   )( done );
 * }
 */
function css( done ) {
  series(
    tasks.css_lint_scss,
    tasks.css_sass,
  )( done );
}

/**
 * JavaScript 関連タスク
 * @memberof module:gulpkit/index
 * @param {function} done - gulp タスク完了のコールバック
 * @example
 * function js( done ) {
 *   series(
 *     tasks.js_eslint,
 *     tasks.js_webpack,
 *     ),
 *   )( done );
 * }
 */
function js( done ) {
  series(
    tasks.js_eslint,
    tasks.js_webpack,
  )( done );
}

/**
 * アイコン 関連タスク
 * @memberof module:gulpkit/index
 * @param {function} done - gulp タスク完了のコールバック
 * @example
 * function icon( done ) {
 *   series(
 *     tasks.icon_font,
 *     tasks.css_lint_scss,
 *     tasks.css_sass,
 *   )( done );
 * }
 */
function icon( done ) {
  series(
    tasks.icon_font,
    tasks.css_lint_scss,
    tasks.css_sass,
  )( done );
}

/**
 * プロセス終了直前にイベントを発行する。
 */
process.once( BEFORE_EXIT_EVENT_NAME, () => eventEmitter.emit( BEFORE_EXIT_EVENT_NAME ) );

/**
 * プロセス終了直前に発行されるイベントにwatch タスクを登録する。
 */
eventEmitter.once( BEFORE_EXIT_EVENT_NAME, init_watch );

/**
 * プロセス終了直前にブラウザリロードの初期化用タスクを登録する。
 */
eventEmitter.once( BEFORE_EXIT_EVENT_NAME, init_browsing );

/**
 * watch されているタスクの実行後に発行されるイベントにブラウザリロードを登録する。
 */
eventEmitter.on( RAN_WATCH_TASK_EVENT_NAME, reload_browsing );
