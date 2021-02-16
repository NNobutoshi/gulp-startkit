const
  { watch } = require( 'gulp' )
;
const
  config   = require( '../config.js' )
  ,options = config.setup_watch.options.watch
;

module.exports = function( tasks ) {
  return function watch_init( callBack ) {
    for ( const key in tasks ) {
      const taskItem = config[ key ];
      if ( taskItem && taskItem.watch === true && taskItem.src ) {
        watch( taskItem.src, options, tasks[ key ] );
      }
    }
    if ( typeof callBack === 'function' ) {
      callBack();
    }
  };
};
