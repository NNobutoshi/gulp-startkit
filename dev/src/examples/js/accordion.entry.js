'use strict';

import '../../js/common_body.entry.js';
import Toggle from '../../js/_modules/transitiontoggle.js';

const
  mdls = {}
;
mdls.toggle = new Toggle( {
  selectorTrigger   : '.pl-list_btn',
  selectorTarget    : '.pl-list_inner',
  selectorIndicator : '.pl-list',
} );

mdls.toggle.on(
  ( e, inst ) => {
    const
      height = inst.elemTarget.querySelector( '.pl-list_list' ).getBoundingClientRect().height
    ;
    clearTimeout( inst.timeoutId );
    inst.elemTarget.style.height = height + 'px';
    inst.elemIndicator.classList.add( 'js-list--isOpening' );
  },
  ( e, inst ) => {
    inst.elemTarget.style.height = '';
    inst.timeoutId = setTimeout( () => {
      inst.elemIndicator.classList.remove( 'js-list--isOpening' );
    }, 100 );
  },
  ( e, inst ) => {
    if ( inst.isChanged === true ) {
      inst.elemIndicator.classList.add( 'js-list--isOpen' );
    } else {
      inst.elemIndicator.classList.remove( 'js-list--isOpen' );
    }
  },
)
;
