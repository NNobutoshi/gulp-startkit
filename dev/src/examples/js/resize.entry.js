'use strict';

import OptimizedResize from '../../js/_modules/optimizedresize.js';

const
  mdls = {}
;
mdls.resize = new OptimizedResize();
mdls.resize
  .one( inst => {
    document.querySelector( '.pl-test_one' ).textContent = inst.query;
  }, '(min-width: 980px)' )
  .turn( inst => {
    if ( inst.counter === undefined ) {
      inst.counter = 0;
    }
    document.querySelector( '.pl-test_turn' ).textContent = `${inst.query} == ${inst.counter++}`;
  }, '(max-width: 979px)' )
  .on( inst => {
    if ( inst.counter === undefined ) {
      inst.counter = 0;
    }
    document.querySelector( '.pl-test_on' ).textContent = `${inst.query} == ${inst.counter++}`;
  }, '(max-width: 374px)' )
  .cross( inst => {
    if ( inst.counter === undefined ) {
      inst.counter = 0;
    }
    document.querySelector( '.pl-test_cross' ).textContent =
      `${inst.query} == ${inst.counter++}`;
  }, '(max-width: 1000px)' )
  .run()
;
