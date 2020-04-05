const
  { watch } = require( 'gulp' )
  ,taskName = 'watch'

  ,config = require( '../config.js' ).config
  ,options = config[ taskName ].options
;

module.exports = function( conf, func ) {
  let
    targets
  ;
  if ( Array.isArray( conf.watch ) ) {
    targets = conf.watch;
  } else if ( conf.watch === true ) {
    targets = conf.src;
  }
  if ( targets ) {
    watch( targets, options, func );
  }
  return false;
};
