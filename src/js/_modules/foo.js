import imagesloaded from 'imagesloaded';
export default function( callback ) {
  if ( typeof callback === 'function' ) {
    callback();
  }
  imagesloaded( document.getElementById( 'page' ) , ( e ) => {
    console.info( e );
  } );
}
