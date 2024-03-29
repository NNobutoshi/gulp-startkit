import gulp from 'gulp';
import * as tasks from './gulpkit.js/tasks/index.js';

const { series, parallel } = gulp;

/*
 * コマンドライン上 Gulp <task>
 * でタスクを個別に実行する際、watch や server も機能させる。
 */
( function _taskOnCommand() {
  const
    watchTasks = {}
    ,args = process.argv.slice( process.argv.indexOf( 'gulpkit.js' ) + 1 )
  ;
  if ( args.length === 0 ) {
    return;
  }
  args.forEach( ( taskName ) => {
    watchTasks[ taskName ] = tasks[ taskName ];
  } );
  process.on( 'beforeExit', () => {
    tasks.serve_init( tasks.watcher( watchTasks, tasks.serve_reload ) );
  } );
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
  tasks.serve_init,
  tasks.watcher( tasks, tasks.serve_reload ),
);

export * from './gulpkit.js/tasks/index.js';
