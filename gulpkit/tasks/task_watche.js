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
      const
        taskConfig = config[ taskName ]
      ;
      if ( taskConfig && taskConfig.watch === true && taskConfig.src ) {
        noWatchTask = false;
        if ( typeof commonNextTask === 'function' ) {
          watch( taskConfig.src, watchOptions, series( task, commonNextTask ) );
        } else {
          watch( taskConfig.src, watchOptions, task );
        }
      }
    } // for

    if ( noWatchTask ) {
      fancyLog( chalk.gray( 'no task to watch' ) );
    }

    cb();

  };
}
