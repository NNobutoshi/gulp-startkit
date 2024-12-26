import { series, parallel } from 'gulp';

import * as tasks from './gulpkit/tasks/index.js';
import taskOnCommand from './gulpkit/lib/task_on_command.js';


/*
 * コマンドライン上 Gulp <task>
 * でタスクを個別に実行する際、watch や live reload も機能させる。
 */
taskOnCommand( tasks );

/*
 * default 全タスク
 */
export default series(
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
      tasks.css_scss_lint,
      tasks.css_sass,
      tasks.js_eslint,
      tasks.js_webpack,
    )
  ),
  tasks.init_browse,
  tasks.task_watche( tasks, tasks.reload_browse ),
);

export * from './gulpkit/tasks/index.js';

/*
 * html 関連タスク
 */
export function html( done ) {
  series(
    tasks.img_min,
    tasks.html_pug,
    tasks.init_browse,
    series(
      tasks.task_watche( {
        img_min: tasks.img_min,
        html_pug: tasks.html_pug,
      },
      tasks.reload_browse )
    ),
  )( done );
}

/*
 * img 関連タスク
 */
export function img( done ) {
  series(
    tasks.img_min,
    tasks.img_sprite,
    tasks.img_sprite_svg,
    tasks.css_scss_lint,
    tasks.css_sass,
    tasks.init_browse,
    series(
      tasks.task_watche( {
        img_min: tasks.img_min,
        img_sprite: tasks.img_sprite,
        img_sprite_svg: tasks.img_sprite_svg,
        css_scss_lint: tasks.css_scss_lint,
        css_sass: tasks.css_sass,
      },
      tasks.reload_browse )
    ),
  )( done );
}

/*
 * CSS 関連タスク
 */
export function css( done ) {
  series(
    tasks.css_scss_lint,
    tasks.css_sass,
    tasks.init_browse,
    series(
      tasks.task_watche( {
        css_scss_lint: tasks.css_scss_lint,
        css_sass: tasks.css_sass,
      },
      tasks.reload_browse )
    ),
  )( done );
}

/*
 * JavaScript 関連タスク
 */
export function js( done ) {
  series(
    tasks.js_eslint,
    tasks.js_webpack,
    tasks.init_browse,
    series(
      tasks.task_watche( {
        js_eslint: tasks.js_eslint,
        js_webpack: tasks.js_webpack,
      },
      tasks.reload_browse )
    ),
  )( done );
}
