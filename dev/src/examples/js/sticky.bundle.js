'use strict';

import $ from 'jquery';
import ScrollManager from '../../js/_modules/scrollmanager.js';

const
  mdls = {}
  ,$pointElement = $( '.pl-nav' )
  ,$wrapper = $( 'body' )
  ,className = 'js-pl-nav--isFixed'
;

mdls.scrollManager = new ScrollManager();
mdls.scrollManager
  .on( ( props, inst ) => {
    const
      point = $pointElement.offset().top
    ;
    if ( inst.scTop >= point && props.flag === false ) {
      $wrapper.addClass( className );
      props.flag = true;
      inst.offsetTop = '.pl-nav_nav';
    } else if ( inst.scTop < point && props.flag === true ) {
      $wrapper.removeClass( className );
      props.flag = false;
      inst.offsetTop = 0;
    }
    return true;
  } )
;
