const
  { watch, series } = require( 'gulp' )
;
const
  config = require( './config.js' )
  ,options = config.setup_watch.options
;

module.exports = function( tasks, reload ) {
  return function setupWatch( done ) {
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
    if ( typeof done === 'function' ) {
      done();
    }
  };
};
