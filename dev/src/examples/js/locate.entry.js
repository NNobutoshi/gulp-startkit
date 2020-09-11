'use strict';

import '../../js/common_body.entry.js';
import Locate from '../../js/_modules/locate.js';

const
  mdls = {}
  ,$ = window.jQuery
  ,TARGETSELECTOR = '.pl-nav_anchor'
;

mdls.locate = new Locate( {
  target : TARGETSELECTOR
} );

$( TARGETSELECTOR ).on( 'click', ( e ) => {
  history.pushState( null ,null, e.currentTarget.href );
  _run();
  e.preventDefault();
} );

$( window )
  .on( 'popstate.locate' , _run )
  .trigger( 'popstate.locate', _run )
;

function _run() {
  mdls.locate.currentItem = null;
  $( '.pl-nav_item' ).removeClass( 'js-current' );
  mdls.locate.run( inst => {
    if ( inst.currentItem ) {
      $( inst.currentItem ).parents( '.pl-nav_item' ).addClass( 'js-current' );
    }
  } );
}
