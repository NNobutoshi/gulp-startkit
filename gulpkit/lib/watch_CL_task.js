/**
 * @module lib/watch_CL_task
 * @requires node:process
 * @requires gulp
 */

import process from 'node:process';

import { series } from 'gulp';

export { enableWatchForCommandLineTask as default };

/**
 * コマンドラインからGulp <task> として、特定のタスクを個別に実行する際に、<br>
 * watch や live reload も機能させる。<br>
 * default としてエクスポート。
 * @memberof module:lib/watch_CL_task
 * @param {object} tasks - Gulp タスク
 */
function enableWatchForCommandLineTask( tasks ) {
  const
    watchTasks = []
    ,args = process.argv.slice( 2 )
  ;
  if ( args.length === 0 ) {
    return;
  }
  for ( let i = 0, len = args.length; i < len; i++ ) {
    const taskName = args[ i ];
    if ( tasks[ taskName ] ) {
      watchTasks.push( tasks[ taskName ] );
    }
  }
  if ( watchTasks.length === 0 ) {
    return;
  }
  process.once( 'beforeExit',
    series(
      tasks.init_browsing,
      tasks.task_watch( watchTasks, tasks.reload_browsing ),
    )
  );
}
