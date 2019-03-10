'use strict';

import OptimizedResize from './_modules/optimizedresize.js';
import Adaptivehover from './_modules/adaptivehover.js';
import ScrollManager from './_modules/scrollmanager.js';
import foo from './_modules/foo.js';
import $ from './_vendor/jquery-3.2.1.js';

const mdls = {};

mdls.resize = new OptimizedResize();
mdls.hover = new Adaptivehover( {
  target : '.hoverTarget'
} );
mdls.scroll = new ScrollManager();

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
  ;
} )();