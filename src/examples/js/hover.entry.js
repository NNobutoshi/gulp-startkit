import Adaptivehover from '../../js/_modules/libs/adaptivehover';

const mdls = {};

mdls.hover = new Adaptivehover( {
  selectorTarget : '.pl-hoverTarget',
} );

mdls.hover
  .on(
    ( e, _inst, target ) => {
      target.classList.add( 'js-hover' );
    }
    ,( e, _inst, target ) => {
      target.classList.remove( 'js-hover' );
    }
  )
;
