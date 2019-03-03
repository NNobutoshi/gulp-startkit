'use strict';

import OptimizedResize from './_modules/optimizedresize.js';
import foo from './_modules/foo.js';

const
  optResize = new OptimizedResize()
;

foo('body');

optResize
  .one( () => {
    console.info('one');
  }, '(min-width: 980px)' )
  .turn( () => {
    console.info( '(min-width: 980px)' );
  }, '(min-width: 980px)' )
  .turn( () => {
    console.info('(max-width: 979px)' );
  }, '(max-width: 979px)' )
  .on( () => {
    console.info('(max-width: 374px)' );
  }, '(max-width: 374px)' )
  .run()
;
