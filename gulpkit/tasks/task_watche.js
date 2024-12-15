import { watch, series } from 'gulp';
import fancyLog          from 'fancy-log';
import chalk             from 'chalk';

import configFile from '../config.js';

const
  config        = configFile
  ,watchOptions = config.task_watche.options.watch
;

export default function task_watche( tasks, commonNextTask ) {

  return function watch_init( cb ) {

    let noWatchTask = true;

    for ( const [ taskName, task ] of Object.entries( tasks ) ) {
      const taskConfig = config[ taskName ];
      let watchSrc;

      if ( taskConfig && taskConfig.src && taskConfig.subSrc ) {
        watchSrc = [].concat( taskConfig.src, taskConfig.subSrc );
      } else if ( taskConfig && taskConfig.src ) {
        watchSrc = taskConfig.src;
      }
      if ( taskConfig && taskConfig.watch === true && taskConfig.src ) {
        noWatchTask = false;
        if ( typeof commonNextTask === 'function' ) {
          watch( watchSrc, watchOptions, series( task, commonNextTask ) );
        } else {
          watch( watchSrc, watchOptions, task );
        }
      }
    } // for

    if ( noWatchTask ) {
      fancyLog( chalk.gray( 'no task to watch' ) );
    }

    cb();

  };
}
