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
  if ( args.length === 0 ) {
    return;
  }
  args.forEach( ( taskName ) => {
    watchTasks[ taskName ] = tasks[ taskName ];
  } );
  process.on( 'beforeExit',
    series(
      tasks.init_browse,
      tasks.watcher( watchTasks, tasks.reload_browse ),
    )
  );
} )();


/*
 * default
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
        tasks.sprite,
        tasks.sprite_svg
      ),
      tasks.css_lint,
      tasks.css_sass,
      tasks.js_eslint,
      tasks.js_webpack,
    )
  ),
  tasks.init_browse,
  tasks.watcher( tasks, tasks.reload_browse ),
);

export * from './gulpkit/tasks/index.js';
