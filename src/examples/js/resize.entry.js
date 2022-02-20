import OptimizedResize from '../../js/_modules/libs/optimizedresize.js';

const
  mdls = {}
;
mdls.resize = new OptimizedResize();
mdls.resize
  .on( '(max-width: 767px)',
    ( inst ) => {
      if ( inst.counter === undefined ) {
        inst.counter = 0;
      }
      document.querySelector( '.pl-test_span--on' )
        .textContent = ++inst.counter;
    } )
  .turn( '(max-width: 979px)',
    ( inst ) => {
      if ( inst.counter === undefined ) {
        inst.counter = 0;
      }
      document.querySelector( '.pl-test_span--turn' )
        .textContent = ++inst.counter;
    } )
  .cross( '(min-width: 980px)',
    ( inst ) => {
      if ( inst.counter === undefined ) {
        inst.counter = 0;
      }
      document.querySelector( '.pl-test_span--cross' )
        .textContent = ++inst.counter;
    } )
  .one( '(max-width: 1200px)',
    ( inst ) => {
      if ( inst.counter === undefined ) {
        inst.counter = 0;
      }
      document.querySelector( '.pl-test_span--one' )
        .textContent = ++inst.counter;
    } )
  .run()
;
