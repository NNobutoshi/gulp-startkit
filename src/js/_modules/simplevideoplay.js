import merge from 'lodash/mergeWith';
import './polyfills/closest';
import EM from './utilities/eventmanager';

export default class SimpleVideoPlay {

  constructor( options ) {
    this.defaultSettings = {
      name               : 'SimpleVideoPlay',
      selectorVideo      : '',
      selectorOuter      : '',
      classNameOfCover   : 'js-video_cover',
      classNameOfCanPlay : 'js-video--canPlay',
      classNameOfPlaying : 'js-video--isPlaying',
      classNameOfPaused  : 'js-video--isPaused',
      classNameOfEnded   : 'js-video--isEnded',
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.isPlaying = false;
    this.elemVideo = document.querySelector( this.settings.selectorVideo );
    this.elemWrapper = this.elemVideo.closest( this.settings.selectorOuter );
    this.elemCover = document.createElement( 'div' );
    this.src = this.elemVideo.src;
    this.evtVideo = new EM( this.elemVideo );
    this.evtCover = new EM( this.elemCover );
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
    this.evtVideo.on( `canplay.${this.id}`, () => {
      this.handleForCanplay();
    } );
    this.evtVideo.on( `play.${this.id}`,() => {
      this.handleForPlay();
    } );
    this.evtVideo.on( `pause.${this.id}`, () => {
      this.handleForPause();
    } );
    this.evtVideo.on( `ended.${this.id}`, () => {
      this.handleForEnded();
    } );
  }

  off() {
    this.evtVideo.off( `.${this.id}` );
    this.evtCover.off( `.${this.id}` );
  }

  handleForCanplay() {
    this.elemWrapper.classList.add( this.settings.classNameOfCanPlay );
    this.evtCover.on( `click.${this.id} touchend.${this.id}`, ( e ) => {
      this.handleForCoverClick( e );
    } );
  }

  handleForPlay() {
    this.elemWrapper.classList.add( this.settings.classNameOfPlaying );
    this.elemWrapper.classList.remove( this.settings.classNameOfPaused );
  }

  handleForPause() {
    this.elemWrapper.classList.add( this.settings.classNameOfPaused );
    this.elemWrapper.classList.remove( this.settings.classNameOfPlaying );
  }

  handleForEnded() {
    this.elemWrapper.classList.add( this.settings.classNameOfEnded );
    this.elemWrapper.classList.remove( this.settings.classNameOfPaused );
    this.elemWrapper.classList.remove( this.settings.classNameOfPlaying );
  }

  handleForCoverClick( e ) {
    e.preventDefault();
    if ( this.isPlaying === false ) {
      this.elemVideo.play();
    }
  }

}
