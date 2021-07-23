import merge from 'lodash/mergeWith';
import './polyfills/closest';
import EM from './utilities/eventmanager';

const doc = document;

export default class SimpleVideoPlay {

  constructor( options ) {
    this.defaultSettings = {
      name          : 'SimpleVideoPlay',
      selectorVideo : '',
      selectorOuter : '',
      onBefore      : null,
      onPlayBefore  : null,
      onPlay        : null,
      onPause       : null,
      onEnd         : null,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.selectorVideo = this.settings.selectorVideo;
    this.selectorOuter = this.settings.selectorOuter;
    this.elemVideo = doc.querySelector( this.selectorVideo );
    this.elemWrapper = this.elemVideo.closest( this.selectorOuter );
    this.elemCover = doc.createElement( 'div' );
    this.evtNamecanPlay = `canplay.${this.id}`;
    this.evtNamePlay = `play.${this.id}`;
    this.evtNamePause = `pause.${this.id}`;
    this.evtNameEnded = `ended.${this.id}`;
    this.evtNameCoverClick = `click.${this.id} touchend.${this.id}`;
    this.src = this.elemVideo.src;
    this.isPlaying = false;
    this.evtVideo = new EM( this.elemVideo );
    this.evtCover = new EM( this.elemCover );
    this.init();
  }

  init() {
    this.eventCall( this.settings.onBefore );
    this.elemWrapper.appendChild( this.elemCover );
    if ( this.elemVideo.poster ) {
      this.elemCover.style.backgroundImage = `url(${this.elemVideo.poster})`;
    }
    this.on();
    this.elemVideo.load();
  }

  on() {
    this.evtVideo.on( this.evtNamecanPlay, this.handleCanplay.bind( this ) );
    this.evtVideo.on( this.evtNamePlay, this.handlePlay.bind( this ) );
    this.evtVideo.on( this.evtNamePause, this.handlePause.bind( this ) );
    this.evtVideo.on( this.evtNameEnded, this.handleEnded.bind( this ) );
  }

  off() {
    this.evtVideo.off( `.${this.id}` );
    this.evtCover.off( `.${this.id}` );
  }

  handleCanplay() {
    this.eventCall( this.settings.onPlayBefore );
    this.evtCover.on( this.evtNameCoverClick, this.handleCoverClick.bind( this ) );
  }

  handlePlay() {
    this.eventCall( this.settings.onPlay );
  }

  handlePause() {
    this.eventCall( this.settings.onPause );
  }

  handleEnded() {
    this.eventCall( this.settings.onEnd );
  }

  handleCoverClick( e ) {
    e.preventDefault();
    if ( this.isPlaying === false ) {
      this.elemVideo.play();
    }
  }

  eventCall( func ) {
    if ( typeof func === 'function' ) {
      func.call( this, this );
    }
  }

}
