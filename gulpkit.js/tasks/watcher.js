import { watch, series } from 'gulp';

import { watcher as config } from '../config.js';

const
  watchOptions = config.options.watch
;

export default function watcher( tasks, reload ) {

  return function watch_init( cb ) {

    for ( const [ taskName, task ] of Object.entries( tasks ) ) {
      const
        taskConfig = config[ taskName ]
      ;
      if ( taskConfig && taskConfig.watch === true && taskConfig.src ) {
        if ( typeof reload === 'function' ) {
          watch( taskConfig.src, watchOptions, series( task, reload ) );
        } else {
          watch( taskConfig.src, watchOptions, task );
        }
      }
    } // for

    if ( typeof cb === 'function' ) {
      cb();
    }

  };
}
