import Locate from '../../js/_modules/locate';
import EM from '../../js/_modules/utilities/eventmanager';

const
  mdls = {}
  ,TARGETSELECTOR = '.pl-nav_anchor'
  ,elemTarget = document.querySelectorAll( TARGETSELECTOR )
  ,evtWindow = new EM( window )
  ,evtTarget = new EM( elemTarget )
;

mdls.locate = new Locate( {
  selectorTarget : TARGETSELECTOR,
  selectorParents : '.pl-nav_item',
} );

evtTarget.on( 'click', ( e ) => {
  e.preventDefault();
  history.pushState( null ,null, e.currentTarget.href );
  _run();
} );

evtWindow
  .on( 'popstate', _run )
  .trigger( 'popstate' )
;


function _run() {
  if ( mdls.locate.elemParents ) {
    for ( const elem of mdls.locate.elemParents ) {
      elem.classList.remove( 'js-current' );
    }
  }
  mdls.locate.run( inst => {
    if ( inst.elemParents ) {
      for ( const elem of inst.elemParents ) {
        elem.classList.add( 'js-current' );
      }
    }
  } );
}
