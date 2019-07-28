'use strict';

import $ from 'jquery';
import Adaptivehover from '../../js/_modules/adaptivehover.js';

const
  mdls = {}
;

mdls.hover = new Adaptivehover( {
  target : '.pl-hoverTarget'
} );
mdls.hover
  .on(
    ( e, inst ) =>  {
      $( inst.target ).addClass( 'js-hover' );
    }
    ,( e, inst ) => {
      $( inst.target ).removeClass( 'js-hover' );
    }
  )
;
