import Tab from '../../js/_modules/tab';
import Rescroll from '../../js/_modules/rescroll';

new Rescroll( {
  offsetTop : '.pl-head',
} )
  .on()
  .addShoulder( '.pl-sectionGroup' )
;
new Tab( {
  selectorWrapper : '.pl-sectionGroup',
  selectorTrigger : '.pl-tabmenu_anchor',
  selectorTarget  : '.pl-section',
} )
  .on()
;
