import { series, parallel } from 'gulp';

import * as tasks from './gulpkit/tasks/index.js';

/*
 * コマンドライン上 Gulp <task>
 * でタスクを個別に実行する際、watch や live reload も機能させる。
 */
( function _taskOnCommand() {
  const
    watchTasks = {}
    ,args = process.argv.slice( 2 )
  ;
  let enabled = true;
  if ( args.length === 0 ) {
    return;
  }
  args.forEach( ( taskName ) => {
    watchTasks[ taskName ] = tasks[ taskName ];
    if ( !tasks[ taskName ] ) {
      enabled = false;
      return;
    }
  } );
  if ( enabled === false ) {
    return;
  }
  process.on( 'beforeExit',
    series(
      tasks.init_browse,
      tasks.task_watche( watchTasks, tasks.reload_browse ),
    )
  );
} )();


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
export function html( cb ) {
  return series(
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
  )( cb );
}

/*
 * img 関連タスク
 */
export function img( cb ) {
  series(
    tasks.img_min,
    tasks.img_sprite,
    tasks.img_sprite_svg,
    tasks.init_browse,
    series(
      tasks.task_watche( {
        img_min: tasks.img_min,
        img_sprite: tasks.img_sprite,
        img_sprite_svg: tasks.img_sprite_svg,
      },
      tasks.reload_browse )
    ),
  )( cb );
}

/*
 * CSS 関連タスク
 */
export function css( cb ) {
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
  )( cb );
}

/*
 * JavaScript 関連タスク
 */
export function js( cb ) {
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
  )( cb );
}
