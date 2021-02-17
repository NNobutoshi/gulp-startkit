const
  { watch, series } = require( 'gulp' )
;
const
  config   = require( '../config.js' )
  ,options = config.setup_watch.options.watch
;

module.exports = function( tasks, reload ) {
  return function watch_init( callBack ) {
    for ( const key in tasks ) {
      const taskItem = config[ key ];
      if ( taskItem && taskItem.watch === true && taskItem.src ) {
        if ( typeof reload === 'function' ) {
          watch( taskItem.src, options, series( tasks[ key ], reload ) );
        } else {
          watch( taskItem.src, options, tasks[ key ] );
        }
      }
    }
    if ( typeof callBack === 'function' ) {
      callBack();
    }
  };
};
