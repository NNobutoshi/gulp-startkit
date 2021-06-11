'use strict';

import Rescroll from '../../js/_modules/rescroll.js';

const
  mdls = {}
;
mdls.rescroll = new Rescroll( {
  offsetTop : '.pl-localNav'
} );

mdls.rescroll.on();
