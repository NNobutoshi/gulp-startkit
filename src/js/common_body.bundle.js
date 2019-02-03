'use strict';

import OptimizedResize from './_modules/optimizedresize.js';
import foo from './_modules/foo.js';

const
  optResize = new OptimizedResize()
;

foo('body');

optResize.one( function() {
  console.info('one');
}, '(min-width: 980px)' );
optResize.turn( function() {
  console.info('turn');
}, '(min-width: 980px)' );