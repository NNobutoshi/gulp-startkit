import Accordion from '../../js/_modules/accordion.js';
import EM from '../../js/_modules/libs/eventmanager.js';

const evtController = new EM( document.querySelector( '.pl-controller' ) );

const accordion = new Accordion( {
  selectorParent  : '.pl-list_item',
  selectorTrigger : '.pl-list_heading',
  selectorTarget  : '.pl-list_body',
  toggleHeight    : true,
} )
  .on( {
    before: function() {
      this.elemParent.classList.add( 'js-pl-accordion--isOpening' );
    },
    after: function() {
      this.elemParent.classList.remove( 'js-pl-accordion--isOpening' );
    },
    finish: function( e ) {
      if ( this.isChanged === true ) {
        this.elemParent.classList.add( 'js-pl-accordion--isOpen' );
      } else {
        this.elemParent.classList.remove( 'js-pl-accordion--isOpen' );
      }
    }
  } )
;

evtController
  .on( 'click', '.pl-controller_button--open', () => {
    accordion.handleAllBefore();
  } )
  .on( 'click', '.pl-controller_button--close', () => {
    accordion.handleAllafter();
  } )
  .on( 'click', '.pl-controller_input--checkbox', ( e, target ) => {
    accordion.settings.otherClosing = target.checked;
  } )
;
