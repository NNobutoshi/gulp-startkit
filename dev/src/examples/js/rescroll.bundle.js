'use strict';
// import $ from 'jquery';
import Rescroll from '../../js/_modules/rescroll.js';

const
  mdls = {}
  ,$ = window.jQuery
;
mdls.rescroll = new Rescroll( {
  offsetTop : '.pl-localNav'
} );

mdls.rescroll.on();


$( '.pl-localNav_testLink' ).on( 'click', ( e ) => {
  e.preventDefault();
  e.stopPropagation();
  window.scrollTo( 0, 1000 );
} );
