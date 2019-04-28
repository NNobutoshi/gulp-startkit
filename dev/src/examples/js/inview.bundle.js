'use strict';

import '../../js/_modules/jqueryhub.js';
import ScrollManager from '../../js/_modules/scrollmanager.js';

const
  $ = window.jQuery
  ,mdls = {}
;

mdls.scroll = new ScrollManager();
mdls.scroll
  .inview( document.querySelectorAll('.pl-inviewTarget')[0], ( props ) => {
    if ( props.inview === true ) {
      $( props.inviewTarget ).addClass('js-isInView');
    } else {
      $( props.inviewTarget ).removeClass('js-isInView');
    }
  } )
  .run()
;
