'use strict';

// import $ from 'jquery';
import ScrollManager from '../../js/_modules/scrollmanager.js';

const
  mdls = {}
;

mdls.scrollManager = new ScrollManager( {
  throttle : 0
} );

mdls.scrollManager
  .on(
    ( ovserved ) => {
      if ( ovserved.ratio > 0 && ovserved.ratio <= 1 ) {
        ovserved.inView = true;
        ovserved.target.classList.add( 'js-isInView' );
      } else {
        ovserved.target.classList.remove( 'js-isInView' );
      }
    }
    ,document.querySelector( '.pl-inviewTarget' ),
    {
      hookPoint: 0
    }
  )
;
