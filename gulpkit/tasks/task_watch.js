import { watch, series } from 'gulp';
import fancyLog          from 'fancy-log';
import chalk             from 'chalk';

import { config as watchConfig, options } from '../config/config_task_watch.js';
import * as taskConfigAll from '../config/index.js';

const watchOptions = options.watch;

let
  timeoutId = null
  ,taskSet = new Set()
;

/**
 * gulp watch タスクを生成する関数
 * @param {Array} tasks - タスクの配列
 * @param {Function} nextTask - 次に実行するタスク
 * @returns {Function} - gulp タスク
 */
export default function task_watch( tasks, nextTask ) {
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
   * @param {Function} done - gulp タスクの完了コールバック
   */
function watchWaiting( done ) {
  process.emit( watchConfig.watchWaitingEventName );
  done();
}
