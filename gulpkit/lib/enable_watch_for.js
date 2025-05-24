import { series } from 'gulp';

import { argv  } from 'node:process';

export { enableWatchForCommandLineTask as default };

/**
 * @module lib/enable_watch_for
 * @requires gulp
 * @requires node:process
 */
/**
 * コマンドラインからGulp <task> として、特定のタスクを個別に実行する際に、<br>
 * watch や live reload も機能させる。<br>
 * default としてエクスポート。
 * @memberof lib/enable_watch_for
 * @param {Object} tasks - Gulp タスク
 */
function enableWatchForCommandLineTask( tasks ) {
  const
    watchTasks = []
    ,args = argv.slice( 2 )
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
      tasks.init_browse,
      tasks.task_watch( watchTasks, tasks.reload_browse ),
    )
  );
}
