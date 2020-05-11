'use strict';

// import $ from 'jquery';
import Toggle from '../../js/_modules/transitiontoggle.js';

const
  mdls = {}
  ,$ = window.jQuery
;

mdls.toggle = new Toggle( {
  selectorTrigger   : '.pl-list_btn',
  selectorTarget    : '.pl-list_inner',
  selectorIndicator : '.pl-list',
} );

mdls.toggle.on(
  ( e, inst ) => {
    const
      $target = $( inst.elemTarget )
    ;
    clearTimeout( inst.timeoutId );
    $target.css( {
      'height' : $target.find( '.pl-list_list' ).outerHeight( true ) + 'px'
    } );
    $( inst.elemIndicator ).addClass( 'js-list--isOpening' );
  },
  ( e, inst ) => {
    $( inst.elemTarget ).css( {
      'height' : ''
    } );
    inst.timeoutId = setTimeout( () => {
      $( inst.elemIndicator ).removeClass( 'js-list--isOpening' );
    },100 );
  },
  ( e, inst ) => {
    const
      $parent = $( inst.elemIndicator )
    ;
    if ( inst.isChanged === true ) {
      $parent.addClass( 'js-list--isOpen' );
    } else {
      $parent.removeClass( 'js-list--isOpen' );
    }
  },
)
;
