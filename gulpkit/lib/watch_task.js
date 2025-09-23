/**
 * @module tasks/task_watch
 * @requires gulp
 * @requires ../config/constants.js
 * @requires ../utilities/event_emitter.js
 */

import { watch, series } from 'gulp';

import { WATCH_INIT_EVENT_NAME, RAN_WATCH_TASK_EVENT_NAME } from '../config/constants.js';
import { eventEmitter } from '../utilities/event_emitter.js';

export { watch_task as default, init_watch };

const
  taskSet = new Set()
  ,taskMap = new Map()
;
let
  timeoutId = null
;

/**
 * gulp watch タスクを生成する。<br>
 * default としてエクスポート。
 * @memberof module:tasks/task_watch
 * @param {array} watchSrc - 監視するファイルパス（glob ）の配列
 * @param {object} options - オプション
 * @param {function} task - Gulp タスク
 */
function watch_task( watchSrc, options, task ) {
  _addTaskToMap( watchSrc, options, task );
}


/**
 * Map でタスクを収集する。
 * @param {array} watchSrc - 監視するファイルパス（glob ）の配列
 * @param {object} options - オプション
 * @param {function} task - Gulp タスク
 */
function _addTaskToMap( watchSrc, options, task ) {
  taskMap.set( task, { watchSrc : watchSrc, options : options } );
}

/**
 * タスクの数だけGulp watch に登録するが、タスクはまだ実行されない。
 * @param {function} done - gulp タスク完了のコールバック
 */
function init_watch( done ) {
  for ( const [ task, value ] of taskMap ) {
    // Gulp Watch はいったんタスクのみを収集する。
    watch( value.watchSrc, value.options.gulpWatch, _addTaskToSet( task, value.options ) );
  }
  eventEmitter.emit( WATCH_INIT_EVENT_NAME );
  done();
}

/**
 * 一定時間内の連続実行は間引きし、一定時間後に集めたタスクを実行する。<br>
 * 同一ソースファイルを監視するタスクが複数登録されている場合に同じタスクが複数回実行されることを防ぐ。
 * @private
 * @param {function} task - タスク
 * @param {object} options - オプション
 * @returns {function} - gulp タスク
 */
function _addTaskToSet( task, options ) {
  return function addWatchTask( done ) {
    taskSet.add( task );
    clearTimeout( timeoutId );
    timeoutId = setTimeout( _runChainedTasks(), options.runChainedTasksDelayTime );
    done();
  };
}

/**
 * Gulp Watch で集めたタスクをGulp series でつなげて実行する。<br>
 * タスク実行後にイベントを発行する。
 * @private
 * @returns {function}
 */
function _runChainedTasks() {
  return function() {
    clearTimeout( timeoutId );
    series( ...taskSet )( () => {
      eventEmitter.emit( RAN_WATCH_TASK_EVENT_NAME );
    } );
    taskSet.clear();
  };
}

