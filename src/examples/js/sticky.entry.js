'use strict';

import ScrollManager from '../../js/_modules/libs/scrollmanager';

const
  mdls = {}
  ,pointElementSelector = '.pl-nav'
  ,elemWrapper = document.body
  ,className = 'js-pl-nav--isFixed'
;

mdls.scrollManager = new ScrollManager( {
  selectorOffsetTop: '.pl-nav_nav',
  catchPoint: 0,
} );

mdls.scrollManager
  .on(
    ( ovserved ) => {
      if ( ovserved.ratio >= 0 ) {
        elemWrapper.classList.add( className );
      } else {
        elemWrapper.classList.remove( className );
      }
    },
    document.querySelector( pointElementSelector ),
    { hookPoint: 0 },
  )
;
