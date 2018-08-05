var
  $ = require( '../_vendor/jquery-3.2.1.js' )
;
module.exports = function( selector ) {
  'use strict';
  console.info( $( selector ).length );
};
