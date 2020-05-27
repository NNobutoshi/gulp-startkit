// import $ from 'jquery';
import merge from 'lodash/mergeWith';
import closest from '../../js/_modules/utilities/closest.js';

const
  $ = window.jQuery
;
export default class SimpleVideoPlay {

  constructor( options ) {
    this.defaultSettings = {
      name               : 'SimpleVideoPlay',
      videoSelector      : '',
      outerSelector      : '',
      classNameOfCover   : 'js-video_cover',
      classNameOfCanPlay : 'js-video--canPlay',
      classNameOfPlaying : 'js-video--isPlaying',
      classNameOfPaused  : 'js-video--isPaused',
      classNameOfEnded   : 'js-video--isEnded',
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.elemVideo = document.querySelector( this.settings.videoSelector );
    this.elemWrapper = closest( this.elemVideo, this.settings.outerSelector );
    this.id = this.settings.name;
    this.isPlaying = false;
    this.src = this.elemVideo.src;
    this.elemCover = document.createElement( 'div' );
    this.init();
  }

  init() {
    this.elemCover.classList.add( this.settings.classNameOfCover );
    this.elemWrapper.appendChild( this.elemCover );
    if ( this.elemVideo.poster ) {
      this.elemCover.style.backgroundImage = `url(${this.elemVideo.poster})`;
    }
    this.on();
    this.elemVideo.load();
  }

  on() {

    $( this.elemVideo ).on( `canplay.${this.id}`, () => {
      this.elemWrapper.classList.add( this.settings.classNameOfCanPlay );
      $( this.elemCover ).on( `click.${this.id} touchend.${this.id}`, ( e ) => {
        e.preventDefault();
        if ( this.isPlaying === false ) {
          this.elemVideo.play();
        }
      } );
    } );

    $( this.elemVideo ).on( `play.${this.id}`, () => {
      this.elemWrapper.classList.add( this.settings.classNameOfPlaying );
      this.elemWrapper.classList.remove( this.settings.classNameOfPaused );
    } );

    $( this.elemVideo ).on( `pause.${this.id}`, () => {
      this.elemWrapper.classList.add( this.settings.classNameOfPaused );
      this.elemWrapper.classList.remove( this.settings.classNameOfPlaying );
    } );

    $( this.elemVideo ).on( `ended.${this.id}`, () => {
      this.elemWrapper.classList.add( this.settings.classNameOfEnded );
      this.elemWrapper.classList.remove( this.settings.classNameOfPaused );
      this.elemWrapper.classList.remove( this.settings.classNameOfPlaying );
    } );
  }

}
