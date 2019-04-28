'use strict';

import '../../js/_modules/jqueryhub.js';
import Adaptivehover from '../../js/_modules/adaptivehover.js';

const
  $ = window.jQuery
  ,mdls = {}
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
