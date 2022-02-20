import Locate from '../../js/_modules/locate.js';
import EM from '../../js/_modules/libs/eventmanager.js';

const
  mdls = {}
  ,SELECTORTARGET = '.pl-nav_anchor'
  ,SELECTORPARENT = '.pl-nav_item'
  ,elemTarget = document.querySelectorAll( SELECTORTARGET )
  ,evtWindow = new EM( window )
  ,evtTarget = new EM( elemTarget )
;

mdls.locate = new Locate( {
  selectorTarget : SELECTORTARGET,
  selectorParent : SELECTORPARENT,
} );

evtTarget.on( 'click', ( e ) => {
  e.preventDefault();
  history.pushState( null ,null, e.currentTarget.href );
  _locate();
} );

evtWindow
  .on( 'popstate', _locate )
  .trigger( 'popstate' )
;

function _locate() {
  if ( mdls.locate.elemParentAll ) {
    for ( const elem of mdls.locate.elemParentAll ) {
      elem.classList.remove( 'js-current' );
    }
  }
  mdls.locate.run( inst => {
    if ( inst.elemParentAll ) {
      for ( const elem of inst.elemParentAll ) {
        elem.classList.add( 'js-current' );
      }
    }
  } );
}
