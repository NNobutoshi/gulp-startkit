'use strict';

import Adaptivehover from '../../js/_modules/adaptivehover.js';

const
  mdls = {}
;
mdls.hover = new Adaptivehover( {
  target : '.pl-hoverTarget',
} );
mdls.hover
  .on(
    ( e, inst ) =>  {
      inst.target.classList.add( 'js-hover' );
    }
    ,( e, inst ) => {
      inst.target.classList.remove( 'js-hover' );
    }
  )
;
