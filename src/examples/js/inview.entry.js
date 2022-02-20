import ScrollManager from '../../js/_modules/libs/scrollmanager.js';

const mdls = {};

const
  elemInputCatch = document.querySelector( '.pl-input--catchPoint' )
;
let
  catchPoint = 0
;
mdls.scrollManager = new ScrollManager( {
  catchPoint           : '100%',
  selectorOffsetTop    : '.pl-offsetElement--start',
  selectorOffsetBottom : '.pl-offsetElement--end'
} );

mdls.scrollManager
  .on( _handle,
    document.querySelector( '.pl-inviewTarget--1' ),
    { hookPoint: 0 }
  )
  .on( _handle,
    document.querySelector( '.pl-inviewTarget--2' ),
    { hookPoint: 0 }
  )
  .runCallbacksAll()
;

function _handle( observed ) {
  const
    elemInputHook = observed.elemInput || observed.target.querySelector( '.pl-input--hookPoint' )
    ,hookPoint = parseInt( elemInputHook.value )
  ;
  observed.elemInput = elemInputHook;
  catchPoint = parseInt( elemInputCatch.value );
  catchPoint = ( typeof catchPoint === 'number' && catchPoint >= 0 ) ? catchPoint + '%' : '100%';
  observed.hookPoint = ( typeof hookPoint === 'number' && hookPoint >= 0 ) ? hookPoint + '%' : 0;
  this.catchPoint = catchPoint;
  if ( observed.catched === true ) {
    observed.target.classList.add( 'js-isInView' );
  } else {
    observed.target.classList.remove( 'js-isInView' );
  }
}
