'use strict';

import '../../js/_modules/jqueryhub.js';
import OptimizedResize from '../../js/_modules/optimizedresize.js';

const
  mdls = {}
;
mdls.resize = new OptimizedResize();
mdls.resize
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
