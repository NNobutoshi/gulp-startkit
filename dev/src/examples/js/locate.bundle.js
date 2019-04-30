'use strict';

import '../../js/_modules/jqueryhub.js';
import Locate from '../../js/_modules/locate.js';

const
  $ = window.jQuery
  ,mdls = {}
  ,TARGETSELECTOR = '.pl-nav_anchor'
;

mdls.locate = new Locate( {
  target : TARGETSELECTOR
} );

$( TARGETSELECTOR ).on( 'click', ( e ) => {
  history.pushState( null ,null, e.currentTarget.href );
  $( '.pl-nav_item' ).removeClass('js-current');
  $( mdls.locate.run().currentItem ).parents('.pl-nav_item').addClass('js-current');
  e.preventDefault();
} );



