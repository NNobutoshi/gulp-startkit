const
  { watch } = require( 'gulp' )
;
const
  config = require( './config.js' )
  ,options = config.setup_watch.options
;

module.exports = setupWatch;

function setupWatch( tasks ) {
  return function( done ) {
    for ( const key in tasks ) {
      const
        taskItem = config[ key ]
      ;
      if ( taskItem && taskItem.watch === true && taskItem.src ) {
        watch( taskItem.src, options, tasks[ key ] );
      }
    }
    if ( typeof done === 'function' ) {
      done();
    }
  };
}
