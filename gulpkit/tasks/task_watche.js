import { watch, series } from 'gulp';
import fancyLog          from 'fancy-log';
import chalk             from 'chalk';

import configFile from '../config.js';

const
  config        = configFile
  ,watchOptions = config.task_watche.options.watch
;

/**
 * gulp watch タスクを生成する関数
 * @param {Array} tasks タスク名の配列
 * @param {Function} commonNextTask 共通の次のタスク
 * @returns {Function} watch タスク
 */
export default function task_watche( tasks, commonNextTask ) {

  return function init_watch( done ) {
    let enabled = false;

    process.emit( 'myWatchStart' );
    for ( let i = 0, len = tasks.length; i < len; i++ ) {
      const
        task = tasks[ i ]
        ,taskName = tasks[ i ].name
        ,taskConfig = config[ taskName ]
      ;
      let
        watchSrc
      ;

      if ( taskConfig?.src && taskConfig?.subSrc ) {
        watchSrc = [].concat( taskConfig.src, taskConfig.subSrc );
      } else if ( taskConfig?.src ) {
        watchSrc = taskConfig.src;
      }

      if ( taskConfig?.enabledWatch === true && watchSrc ) {
        enabled = true;
        watch(
          watchSrc,
          watchOptions,
          ( typeof commonNextTask === 'function' )
            ? series( task, commonNextTask, finishWatch )
            : task
        );
      }
    } //for

    if ( enabled === false ) {
      fancyLog( chalk.gray( 'no task to watch' ) );
    }

    done();

  };
  function finishWatch( done ) {
    process.emit( 'myWatchFinish' );
    done();
  }
}
