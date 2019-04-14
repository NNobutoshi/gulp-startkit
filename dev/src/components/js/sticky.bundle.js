'use strict';

import '../../js/_modules/jqueryhub.js';
import ScrollManager from '../../js/_modules/scrollmanager.js';

const
  $ = window.jQuery
  ,mdls = {}
  ,$pointElement = $('.pl-nav')
  ,$wrapper = $('body')
  ,className = 'js-pl-nav-isFixed'
;

mdls.scrollManager = new ScrollManager();
mdls.scrollManager
  .on( ( props, instance ) => {
    const
      point = $pointElement.offset().top
    ;
    if ( instance.scTop >= point && props.flag === false ) {
      $wrapper.addClass( className );
      props.flag = true;
      instance.offsetTop = '.pl-nav_nav';
    } else if ( instance.scTop < point && props.flag === true ) {
      $wrapper.removeClass( className );
      props.flag = false;
      instance.offsetTop = 0;
    }
    return true;
  } )
;
