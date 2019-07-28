'use strict';

import $ from 'jquery';
import ScrollManager from '../../js/_modules/scrollmanager.js';

const
  mdls = {}
;

mdls.scroll = new ScrollManager();
mdls.scroll
  .inview( document.querySelectorAll( '.pl-inviewTarget' )[ 0 ], ( props ) => {
    if ( props.inview === true ) {
      $( props.inviewTarget ).addClass( 'js-isInView' );
    } else {
      $( props.inviewTarget ).removeClass( 'js-isInView' );
    }
  } )
  .run()
;
