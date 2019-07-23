'use strict';

import $ from 'jquery';
import Toggle from '../../js/_modules/transitiontoggle.js';

const
  mdls = {}
;

mdls.toggle = new Toggle( {
  trigger : '.pl-list_btn',
  target : '.pl-list_inner',
  toAddClass : '#page',
} );

mdls.toggle
  .on(
    ( e, instance ) => {
      console.info('open');
      const
        $target = $( instance.elemTarget )
        ,$parent = $( instance.elemToAddClass )
        ,height = $target.find( '.pl-list_list').outerHeight( true )
      ;
      $target.css( {
        'height' : height + 'px'
      } );
      $parent.addClass( 'js-pl-list-isOpening' );
    }
    ,( e, instance ) => {
      console.info('close');
      const
        $target = $( instance.elemTarget )
        ,$parent = $( instance.elemToAddClass )
      ;
      $target.css( {
        'height' : ''
      } );
      setTimeout( () => {
        $parent.removeClass( 'js-pl-list-isOpening' );
      },100 );
    }
    ,( e, instance ) => {
      const
        $parent = $( instance.elemToAddClass )
      ;
      if( instance.isOpen === true ) {
        $parent.addClass( 'js-pl-list-isOpen' );
      } else {
        $parent.removeClass( 'js-pl-list-isOpen' );
      }
    }
  )
;
