'use strict';

import Tab from '../../js/_modules/tab';
import Rescroll from '../../js/_modules/rescroll';

const
  mdls = {}
;

mdls.rescroll = new Rescroll( {
  offsetTop : '.pl-head'
} );
mdls.rescroll.on();

mdls.tab = new Tab( {
  selectorWrapper : '.pl-sectionGroup',
  selectorTrigger : '.pl-tabmenu_anchor',
  selectorTarget  : '.pl-section',
  onLoad  : ( prop ) => {
    setTimeout( () => {
      mdls.rescroll.scroll( prop.wrapper );
    }, 200 );
  }
} );
mdls.tab.on();
