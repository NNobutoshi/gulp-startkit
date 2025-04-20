import { series } from 'gulp';

/**
 * コマンドライン上 Gulp <task>
 * でタスクを個別に実行する際、watch や live reload も機能させる。
 * @param {Object} tasks - Gulp タスク
 */
export default function _taskOnCommand( tasks ) {
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
  process.on( 'beforeExit',
    series(
      tasks.init_browse,
      tasks.task_watche( watchTasks, tasks.reload_browse ),
    )
  );
}
