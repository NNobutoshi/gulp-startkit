'use strict';

import OptimizedResize from '../../js/_modules/optimizedresize.js';

const
  mdls = {}
;
mdls.resize = new OptimizedResize();
mdls.counter = 0;
mdls.resize
  .one( ( inst ) => {
    document.querySelector( '.pl-test_one' ).textContent = inst.query;
  }, '(min-width: 980px)' )
  .turn( ( inst ) => {
    document.querySelector( '.pl-test_turn' ).textContent = inst.query;
  }, '(min-width: 980px)', 'foo' )
  .turn( ( inst ) => {
    document.querySelector( '.pl-test_turn' ).textContent = inst.query;
  }, '(max-width: 979px)' )
  .on( ( inst ) => {
    document.querySelector( '.pl-test_on' ).textContent = `${inst.query} == ${mdls.counter++}`;
  }, '(max-width: 374px)' )
  .run()
;
