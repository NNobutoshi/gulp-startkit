import ScrollManager from '../../js/_modules/libs/scrollmanager';

const
  mdls = {}
  ,elemPointer1 = document.querySelector( '.pl-nav_outer--1' )
  ,elemPointer2 = document.querySelector( '.pl-nav_outer--2' )
  ,elemPointer3 = document.querySelector( '.pl-nav_outer--3' )
  ,elemFloatNav1 = document.querySelector( '.pl-nav--1' )
  ,elemFloatNav2 = document.querySelector( '.pl-nav--2' )
  ,elemFloatNav3 = document.querySelector( '.pl-nav--3' )
  ,className = 'js-pl-nav--isFixed'
;

mdls.scrollManager = new ScrollManager( {
  catchPoint: 0,
} );

mdls.scrollManager
  .on(
    ( observed ) => {
      if ( observed.ratio >= 0 ) {
        elemPointer1.classList.add( className );
      } else {
        elemPointer1.classList.remove( className );
      }
    },
    elemPointer1,
    { hookPoint: 0 },
  )
  .on(
    ( observed ) => {
      if ( observed.ratio >= 0 ) {
        elemPointer2.classList.add( className );
        elemFloatNav2.style.top = elemFloatNav1.clientHeight + 'px';
      } else {
        elemPointer2.classList.remove( className );
        elemFloatNav2.style.top = 0;
      }
    },
    elemPointer2,
    {
      hookPoint: 0,
      selectorOffsetTop: '.pl-nav'
    },
  )
  .on(
    ( observed ) => {
      if ( observed.ratio >= 0 ) {
        elemPointer3.classList.add( className );
        elemFloatNav3.style.top = elemFloatNav2.clientHeight + elemFloatNav3.clientHeight + 'px';
      } else {
        elemPointer3.classList.remove( className );
        elemFloatNav3.style.top = 0;
      }
    },
    elemPointer3,
    {
      hookPoint: 0,
      selectorOffsetTop: '.pl-nav'
    },
  )
;
