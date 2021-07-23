import OptimizedResize from '../../js/_modules/libs/optimizedresize';

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
      document.querySelector( '.pl-test_text--on' )
        .textContent = `${inst.query} == ${++inst.counter}`;
    } )
  .turn( '(max-width: 979px)',
    ( inst ) => {
      if ( inst.counter === undefined ) {
        inst.counter = 0;
      }
      document.querySelector( '.pl-test_text--turn' )
        .textContent = `${inst.query} == ${++inst.counter}`;
    } )
  .cross( '(min-width: 980px)',
    ( inst ) => {
      if ( inst.counter === undefined ) {
        inst.counter = 0;
      }
      document.querySelector( '.pl-test_text--cross' )
        .textContent = `${inst.query} == ${++inst.counter}`;
    } )
  .one( '(max-width: 1200px)',
    ( inst ) => {
      if ( inst.counter === undefined ) {
        inst.counter = 0;
      }
      document.querySelector( '.pl-test_text--one' )
        .textContent = `${inst.query} == ${++inst.counter}`;
    } )
  .run()
;
