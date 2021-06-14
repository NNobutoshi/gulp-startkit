'use strict';

import Locate from '../../js/_modules/locate';
import parents from '../../js/_modules/utilities/parents';

const
  mdls = {}
  ,TARGETSELECTOR = '.pl-nav_anchor'
  ,elemTarget = document.querySelectorAll( TARGETSELECTOR )
;

mdls.locate = new Locate( {
  target : TARGETSELECTOR
} );

Array.prototype.forEach.call( elemTarget, ( elem ) => {
  elem.addEventListener( 'click', handleForAnchorClick );
} );

function handleForAnchorClick( e ) {
  e.preventDefault();
  history.pushState( null ,null, e.currentTarget.href );
  _run();
}

window.addEventListener( 'popstate',  _run );
_run();

function _run() {
  Array.prototype.forEach.call( document.querySelectorAll( '.pl-nav_item' ), ( elem ) => {
    elem.classList.remove( 'js-current' );
  } );
  mdls.locate.currentItem = null;
  mdls.locate.run( inst => {
    if ( inst.currentItem ) {
      parents( inst.currentItem, '.pl-nav_item', '.pl-nav' ).forEach( ( elem ) => {
        elem.classList.add( 'js-current' );
      } );
    }
  } );
}
