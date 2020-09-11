'use strict';

import '../../js/common_body.entry.js';
import ScrollManager from '../../js/_modules/scrollmanager.js';

const
  mdls = {}
  ,pointElementSelector = '.pl-nav'
  ,wrapperElem = document.body
  ,className = 'js-pl-nav--isFixed'
;

mdls.scrollManager = new ScrollManager( {
  topOffsetsSelector: '.pl-nav_nav',
  catchPoint: 0,
} );

mdls.scrollManager
  .on( ( ovserved ) => {
    if ( ovserved.ratio >= 0 ) {
      wrapperElem.classList.add( className );
    } else {
      wrapperElem.classList.remove( className );
    }
  }, document.querySelector( pointElementSelector ),{
    hookPoint: 0
  } )
;
