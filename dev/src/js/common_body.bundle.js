'use strict';

import OptimizedResize from './_modules/optimizedresize.js';
import Adaptivehover from './_modules/adaptivehover.js';
import ScrollManager from './_modules/scrollmanager.js';
import Toggle from './_modules/transitiontoggle.js';
import foo from './_modules/foo.js';
import jQuery from './_vendor/jquery-3.2.1.js';

const $ = window.jQuery = jQuery;
const mdls = {};

mdls.resize = new OptimizedResize();

foo('body');

mdls.resize
  .one( () => {
    console.info('one');
  }, '(min-width: 980px)' )
  .turn( () => {
    console.info( '(min-width: 980px)' );
  }, '(min-width: 980px)' )
  .turn( () => {
    console.info('(max-width: 979px)' );
  }, '(max-width: 979px)' )
  .on( () => {
    console.info('(max-width: 374px)' );
  }, '(max-width: 374px)' )
  .run()
;

mdls.hover = new Adaptivehover( {
  target : '.hoverTarget'
} );

mdls.hover
  .on(
    ( e, instance ) =>  {
      $( instance.target ).addClass('js-hover');
    }
    ,( e, instance ) => {
      $( instance.target ).removeClass('js-hover');
    }
  )
;

mdls.scroll = new ScrollManager();

( function() {
  const
    $pointElement = $('.siteGlobalNav')
    ,$wrapper = $('body')
    ,className = 'js-siteGlobalNavIsFixed'
  ;
  mdls.scroll
    .on( ( prop, scTop ) => {
      const
        point = $pointElement.offset().top
      ;
      if ( scTop >= point && prop.flag === false ) {
        $wrapper.addClass( className );
        prop.flag = true;
      } else if ( scTop < point && prop.flag === true ) {
        $wrapper.removeClass( className );
        prop.flag = false;
      }
      return true;
    } )
    .inview( '.bar',( prop, scTop ) => {

    } )
  ;
} )()
;

mdls.toggle = new Toggle( {
  trigger : '.toggleTarget_btn',
  target : '.toggleTarget_inner',
  toAddClass : '#page',
} );

mdls.toggle
  .on(
    ( e, instance ) => {
      console.info('open');
      const
        $target = $( instance.elemTarget )
        ,$parent = $( instance.elemToAddClass )
        ,height = $target.find( '.toggleTarget_list').outerHeight( true )
      ;
      $target.css( {
        'height' : height + 'px'
      } );
      $parent.addClass( 'js-toggleTargetIsOpening' );
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
        $parent.removeClass( 'js-toggleTargetIsOpening' );
      },100 );
    }
    ,( e, instance ) => {
      const
        $parent = $( instance.elemToAddClass )
      ;
      if( instance.isOpen === true ) {
        $parent.addClass( 'js-toggleTargetIsOpen' );
      } else {
        $parent.removeClass( 'js-toggleTargetIsOpen' );
      }
    }
  )
;
