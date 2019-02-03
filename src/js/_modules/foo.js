import $ from '../_vendor/jquery-3.2.1.js';

export default function( selector ) {
  'use strict';
  console.info( $( selector ).length );
}
