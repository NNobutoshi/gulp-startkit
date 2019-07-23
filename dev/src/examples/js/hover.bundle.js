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
    ( e, instance ) =>  {
      $( instance.target ).addClass('js-hover');
    }
    ,( e, instance ) => {
      $( instance.target ).removeClass('js-hover');
    }
  )
;
