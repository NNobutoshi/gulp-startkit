import foo from './_modules/foo.js';
import imagesloaded from 'imagesloaded';

foo( () => {
  console.info( 'ok' );
} );

imagesloaded( document.querySelector( '#page' ), () => {
  console.info( 'image loaded' );
} );
