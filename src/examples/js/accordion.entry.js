'use strict';

import Toggle from '../../js/_modules/libs/transitiontoggle.js';

const
  mdls = {}
;
mdls.toggle = new Toggle( {
  selectorParent  : '.pl-list',
  selectorTrigger : '.pl-list_btn',
  selectorTarget  : '.pl-list_inner',
} );

mdls.toggle.on(
  ( e, inst ) => {
    const
      height = inst.elemTarget.querySelector( '.pl-list_list' ).getBoundingClientRect().height
    ;
    clearTimeout( inst.timeoutId );
    inst.elemTarget.style.height = height + 'px';
    inst.elemParent.classList.add( 'js-list--isOpening' );
  },
  ( e, inst ) => {
    inst.elemTarget.style.height = '';
    inst.timeoutId = setTimeout( () => {
      inst.elemParent.classList.remove( 'js-list--isOpening' );
    }, 100 );
  },
  ( e, inst ) => {
    console.info( 'ischanged', inst.isChanged );
    if ( inst.isChanged === true ) {
      inst.elemParent.classList.add( 'js-list--isOpen' );
    } else {
      inst.elemParent.classList.remove( 'js-list--isOpen' );
    }
  },
)
;
