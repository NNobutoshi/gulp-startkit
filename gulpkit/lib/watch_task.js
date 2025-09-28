/**
 * @module tasks/task_watch
 * @requires gulp
 * @requires fancy-log
 * @requires chalk
 * @requires ../utilities/event_emitter.js
 */

import { watch, series } from 'gulp';

import fancyLog from 'fancy-log';
import chalk    from 'chalk';

import { eventEmitter } from '../utilities/event_emitter.js';

export { watch_task as default, init_watch };

const
  selectionTasks   = new Set()
  ,selectionEvents = new Set()
  ,collectionTasks = new Map()
  ,TEXT_COLOR_HEX = '#0000EE'
  ,defaultSettings = {
    enabled : false,
    runTasksDelayTime : 300,
    ranTaskEventName : '',
    gulpWatch : {
      usePolling : true,
    },
  }
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
  const
    settings = { ...defaultSettings, ...options }
  ;
  settings.gulpWatch = { ...defaultSettings.gulpWatch, ...options?.gulpWatch };
  _collectTaskOnMap( watchSrc, settings, task );
}

/**
 * タスクの数だけGulp watch に登録するが、タスクはまだ実行されない。
 */
function init_watch() {
  if ( collectionTasks.size === 0 ) {
    return;
  } else {
    fancyLog( chalk.hex( TEXT_COLOR_HEX )( '[watch_task]: Watching files...' ) );
  }
  for ( const [ task, value ] of collectionTasks ) {
    // Gulp Watch はいったんタスクのみを収集する。
    watch(
      value.watchSrc,
      value.settings.gulpWatch,
      _addTaskAndEventToSet( task, value.settings )
    );
  }
}

/**
 * Map でタスクを収集する。
 * @param {array} watchSrc - 監視するファイルパス（glob ）の配列
 * @param {object} settings - 設定オブジェクト
 * @param {function} task - Gulp タスク
 */
function _collectTaskOnMap( watchSrc, settings, task ) {
  collectionTasks.set( task, { watchSrc : watchSrc, settings : settings } );
}

/**
 * 一定時間内の連続実行は間引きし、一定時間後に集めたタスクを実行する。<br>
 * 同一ソースファイルを監視するタスクが複数登録されている場合に同じタスクが複数回実行されることを防ぐ。
 * @private
 * @param {function} task - タスク
 * @param {object} settings - 設定オブジェクト
 * @returns {function} - gulp タスク
 */
function _addTaskAndEventToSet( task, settings ) {
  const
    ranTaskEventName = settings.ranTaskEventName
  ;
  return function addWatchTask( done ) {
    selectionTasks.add( task );
    if ( ranTaskEventName ) {
      selectionEvents.add( ranTaskEventName );
    }
    clearTimeout( timeoutId );
    timeoutId = setTimeout( _runselectionTasksAll(), settings.runTasksDelayTime );
    done();
  };
}

/**
 * Gulp Watch で集めたタスクをGulp series でつなげて実行する。<br>
 * タスク実行後にイベントを発行する。
 * @private
 * @returns {function}
 */
function _runselectionTasksAll() {
  return function() {
    clearTimeout( timeoutId );
    series( ...selectionTasks )( () => {
      for ( const eventName of selectionEvents ) {
        eventEmitter.emit( eventName );
      }
      selectionTasks.clear();
      selectionEvents.clear();
      clearTimeout( timeoutId );
    } );
  };
}

