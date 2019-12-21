'use strict';

// import $ from 'jquery';
import ScrollManager from '../../js/_modules/scrollmanager.js';

// const
//   mdls = {}
// ;

// mdls.scrollManager = new ScrollManager( {
//   throttle : 0
// } );

// mdls.scrollManager
//   .on( document.querySelector( '.pl-inviewTarget' ), ( ovserved ) => {
//     console.time( 'scroll' );
//     if ( ovserved.ratio > 0 && ovserved.ratio <= 1 ) {
//       ovserved.inView = true;
//       ovserved.target.classList.add( 'js-isInView' );
//     } else {
//       ovserved.target.classList.remove( 'js-isInView' );
//     }
//     console.timeEnd( 'scroll' );
//   } )
// ;


const
  options = {
    root: window.documentBody,
    rootMargin: '0px',
    threshold: 0,
  }
;

const
  ovserver = new IntersectionObserver( ( what ) => {
    console.info( what );
  }, options )
;

ovserver.observe( document.querySelector( '.pl-inviewTarget' ) );
