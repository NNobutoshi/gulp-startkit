import Adaptivehover from '../../js/_modules/libs/adaptivehover';

const mdls = {};

mdls.hover = new Adaptivehover( {
  selectorTarget : '.pl-hoverTarget',
} );

mdls.hover
  .on( ( e, inst ) =>  {
    inst.elemTarget.classList.add( 'js-hover' );
  }
  ,( e, inst ) => {
    inst.elemTarget.classList.remove( 'js-hover' );
  } )
;
