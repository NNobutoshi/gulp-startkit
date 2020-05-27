const
  del = require( 'del' )
;
const
  config = require( '../config.js' ).clean
;

module.exports = clean;

function clean() {
  return del( config.dist, config.options );
}
