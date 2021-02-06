const
  { watch, series } = require( 'gulp' )
;
const
  config = require( '../config.js' )
  ,options = config.setup_watch.options.watch
;
module.exports = function( tasks, callBack ) {
  return function watch_init( done ) {
    for ( const key in tasks ) {
      const taskItem = config[ key ];
      if ( taskItem && taskItem.watch === true && taskItem.src ) {
        if ( typeof callBack === 'function' ) {
          watch( taskItem.src, options, series( tasks[ key ], callBack ) );
        } else {
          watch( taskItem.src, options, tasks[ key ] );
        }
      }
    }
    if ( typeof done === 'function' ) {
      done();
    }
  };
};
