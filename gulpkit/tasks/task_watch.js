import { watch, series } from 'gulp';
import fancyLog          from 'fancy-log';
import chalk             from 'chalk';

import { config as watchConfig, options } from '../config/config_task_watch.js';
import * as taskConfigAll from '../config/index.js';

export { task_watch as default };

const watchOptions = options.watch;

let
  timeoutId = null
  ,taskSet = new Set()
;

/**
 * @module tasks/task_watch
 * @requires gulp
 * @requires fancy-log
 * @requires chalk
 * @requires ../config/config_task_watch.js
 * @requires ../config/index.js
 */
/**
 * gulp watch タスクを生成する。<br>
 * default としてエクスポート。
 * @memberof module:tasks/task_watch
 * @param {Array} tasks - タスクの配列
 * @param {Function} nextTask - 次に実行するタスク
 * @returns {Function} - gulp タスク
 */
function task_watch( tasks, nextTask ) {
  return function init_watch( done ) {
    let enabled = false;
    process.emit( watchConfig.watchInitEventName );
    for ( let i = 0, len = tasks.length; i < len; i++ ) {
      const
        task = tasks[ i ]
        ,taskName = tasks[ i ].name
        ,taskConfig = taskConfigAll[ taskName ]
      ;
      let
        watchSrc
      ;
      if ( !taskConfig ) {
        continue;
      }
      if ( taskConfig.src && taskConfig.subsrc ) {
        watchSrc = taskConfig.src.concat( taskConfig.subsrc );
      } else if ( taskConfig.src ) {
        watchSrc = taskConfig.src;
      } else {
        continue;
      }
      if ( taskConfig.enabledWatch === true && watchSrc ) {
        enabled = true;
        // Gulp Watch はいったんタスクのみを収集する。
        watch( watchSrc, watchOptions, _addTaskToSet( task, nextTask ) );
      }
    } //for
    if ( enabled === false ) {
      fancyLog( chalk.gray( 'no task to watch' ) );
    }
    done();
  };
}

/**
 * 一定時間内の連続実行は間引きし、一定時間後に集めたタスクを実行する。
 * @private
 * @param {Function} task - タスク
 * @param {Function} nextTask - 次に実行するタスク
 * @returns {Function} - gulp タスク
 */
function _addTaskToSet( task, nextTask ) {
  return function addWatchTask( done ) {
    taskSet.add( task );
    clearTimeout( timeoutId );
    timeoutId = setTimeout( _runChainedTasks( nextTask ), options.runChainedTsksDelayTime );
    done();
  };
}

/**
 * Gulp Watch で集めたタスクをGulp series でつなげて実行する。
 * @private
 * @param {Function} nextTask - 次に実行するタスク
 * @returns {Function}
 */
function _runChainedTasks( nextTask ) {
  return function() {
    clearTimeout( timeoutId );
    if ( nextTask ) {
      taskSet.add( nextTask );
    }
    series( ...taskSet, watchWaiting )();
    taskSet.clear();
  };
}

/**
 * watch タスクの完了を待つ。
 * @private
 * @param {Function} done - gulp タスクの完了コールバック
 */
function watchWaiting( done ) {
  process.emit( watchConfig.watchWaitingEventName );
  done();
}
