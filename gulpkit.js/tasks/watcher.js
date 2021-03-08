const
  { watch, series } = require( 'gulp' )
;
const
  config        = require( '../config.js' )
  ,watchOptions = config.watcher.options.watch
;

module.exports = function( tasks, reload ) {
  return function watch_init( cb ) {
    for ( const key in tasks ) {
      const
        taskConfig = config[ key ]
        ,task      = tasks[ key ]
      ;
      if ( taskConfig && taskConfig.watch === true && taskConfig.src ) {
        if ( typeof reload === 'function' ) {
          watch( taskConfig.src, watchOptions, series( task, reload ) );
        } else {
          watch( taskConfig.src, watchOptions, task );
        }
      }
    }
    if ( typeof cb === 'function' ) {
      cb();
    }
  };
};
