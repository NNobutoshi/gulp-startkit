import merge from 'lodash/mergeWith';
import closest from '../../js/_modules/utilities/closest';
import Events from './utilities/events';

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
    new Events( this, this.elemVideo );
    new Events( this, this.elemCover );
    this.elemVideo.on( 'canplay', this.handleForCanplay );
    this.elemVideo.on( 'play', this.handleForPlay );
    this.elemVideo.on( 'pause', this.handleForPause );
    this.elemVideo.on( 'ended', this.handleForEnded );
  }

  off() {
    this.elemVideo.off( 'canplay', this.handleForCanplay );
    this.elemVideo.off( 'play', this.handleForPlay );
    this.elemVideo.off( 'pause', this.handleForPause );
    this.elemVideo.off( 'ended', this.handleForEnded );
    this.elemCover.off( 'click touchend', this.handleForCoverClick );
  }

  handleForCanplay() {
    this.elemWrapper.classList.add( this.settings.classNameOfCanPlay );
    this.elemCover.on( 'click touchend', this.handleForCoverClick );
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
