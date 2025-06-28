/**
 * @module tasks/task_watch
 * @requires node:process
 * @requires gulp
 * @requires fancy-log
 * @requires chalk
 * @requires ../config/config_task_watch.js
 * @requires ../config/index.js
 */

import process from 'node:process';

import { watch, series } from 'gulp';
import fancyLog          from 'fancy-log';
import chalk             from 'chalk';

import { config as watchConfig, options } from '../config/config_task_watch.js';
import * as taskConfigAll from '../config/index.js';

export { task_watch as default };

const
  gulpWatchOptions = options.gulpWatch
;

let
  timeoutId = null
  ,taskSet = new Set()
;

/**
 * gulp watch タスクを生成する。<br>
 * default としてエクスポート。
 * @memberof module:tasks/task_watch
 * @param {Array} tasks - タスクの配列
 * @param {Function} finish - 最後に実行する関数
 * @returns {Function} - gulp タスク
 */
function task_watch( tasks, finish ) {
  return function init_watch( done ) {
    if ( options.enabled === false ) {
      fancyLog( chalk.gray( 'no task to watch' ) );
      return done();
    }
    process.emit( watchConfig.watchInitEventName );
    for ( let i = 0, len = tasks.length; i < len; i++ ) {
      const
        task = tasks[ i ]
        ,taskName = tasks[ i ].name
      ;
      const
        taskConfig = taskConfigAll[ taskName ]
      ;
      let
        watchSrc
      ;
      if ( !taskConfig ) {
        const errMsg = `Configuration for task "${ taskName }" was not found.`;
        fancyLog.error( chalk.red( errMsg ) );
        throw new Error( errMsg );
      }
      if ( taskConfig.src && taskConfig.subsrc ) {
        watchSrc = taskConfig.src.concat( taskConfig.subsrc );
      } else if ( taskConfig.src ) {
        watchSrc = taskConfig.src;
      } else {
        continue;
      }
      // Gulp Watch はいったんタスクのみを収集する。
      watch( watchSrc, gulpWatchOptions, _addTaskToSet( task, finish ) );
    } //for
    return done();
  };
}

/**
 * 一定時間内の連続実行は間引きし、一定時間後に集めたタスクを実行する。
 * @private
 * @param {Function} task - タスク
 * @param {Function} finish - 最後に実行する関数
 * @returns {Function} - gulp タスク
 */
function _addTaskToSet( task, finish ) {
  return function addWatchTask( done ) {
    taskSet.add( task );
    clearTimeout( timeoutId );
    timeoutId = setTimeout( _runChainedTasks( finish ), options.runChainedTasksDelayTime );
    done();
  };
}

/**
 * Gulp Watch で集めたタスクをGulp series でつなげて実行する。
 * @private
 * @param {Function} finish - 最後に実行する関数
 * @returns {Function}
 */
function _runChainedTasks( finish ) {
  return function() {
    clearTimeout( timeoutId );
    series( ...taskSet, watchWaiting )( () => finish?.() );
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
