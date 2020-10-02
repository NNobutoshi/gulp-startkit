'use strict';

import Tab from '../../js/_modules/tab.js';
import Rescroll from '../../js/_modules/rescroll.js';

const
  mdls = {}
;

mdls.rescroll = new Rescroll( {
  offsetTop : '.pl-head'
} );
mdls.rescroll.on();

mdls.tab = new Tab( {
  wrapper : '.pl-sectionGroup',
  trigger : '.pl-tabmenu_anchor',
  target  : '.pl-section',
  onLoad  : ( prop ) => {
    setTimeout( () => {
      mdls.rescroll.scroll( prop.wrapper );
    }, 1 );
  }
} );
mdls.tab.on();
