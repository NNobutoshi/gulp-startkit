import { watch, series } from 'gulp';
import fancyLog          from 'fancy-log';
import chalk             from 'chalk';

import configFile from '../config.js';

const
  config        = configFile
  ,watchOptions = config.watcher.options.watch
;

export default function watcher( tasks, commonNextTask ) {

  return function watch_init( cb ) {

    let taskCounter = 0;

    for ( const [ taskName, task ] of Object.entries( tasks ) ) {
      const
        taskConfig = config[ taskName ]
      ;
      if ( taskConfig && taskConfig.watch === true && taskConfig.src ) {
        taskCounter = taskCounter + 1;
        if ( typeof commonNextTask === 'function' ) {
          watch( taskConfig.src, watchOptions, series( task, commonNextTask ) );
        } else {
          watch( taskConfig.src, watchOptions, task );
        }
      }
    } // for

    if ( taskCounter === 0 ) {
      fancyLog( chalk.gray( 'no task to watch' ) );
    }

    cb();

  };
}
