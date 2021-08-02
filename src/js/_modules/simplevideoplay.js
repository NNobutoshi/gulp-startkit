import merge from 'lodash/mergeWith';
import './polyfills/closest';
import EM from './utilities/eventmanager';

const d = document;

export default class SimpleVideoPlay {

  constructor( options ) {
    const defaultSettings = this.defaultSettings = {
        name                : 'SimpleVideoPlay',
        selectorVideo       : '',
        selectorWrapper     : '',
        elemVideo           : null,
        elemWrapper         : null,
        eventNameCanPlay    : 'canplay.{name}',
        eventNamePlay       : 'play.{name}',
        eventNamePause      : 'pause.{name}',
        eventNameEnded      : 'ended.{name}',
        eventNameCoverClick : 'click.{name} touchend.{name}',
        onBefore            : null,
        onPlayBefore        : null,
        onPlay              : null,
        onPause             : null,
        onEnd               : null,
      },
      settings = this.settings = merge( {}, defaultSettings, options )
    ;
    this.id = settings.name;
    this.selectorVideo = settings.selectorVideo;
    this.selectorWrapper = settings.selectorWrapper;
    this.elemVideo = settings.elemVideo || d.querySelector( this.selectorVideo );
    this.elemWrapper = settings.elemWrapper || this.elemVideo.closest( this.selectorWrapper );
    this.elemCover = d.createElement( 'div' );
    this.eventNameCanPlay = settings.eventNameCanPlay.replaceAll( '{name}', this.id );
    this.eventNamePlay = settings.eventNamePlay.replaceAll( '{name}', this.id );
    this.eventNamePause = settings.eventNamePause.replaceAll( '{name}', this.id );
    this.eventNameEnded = settings.eventNameEnded.replaceAll( '{name}', this.id );
    this.eventNameCoverClick = settings.eventNameCoverClick.replaceAll( '{name}', this.id );
    this.src = this.elemVideo.src;
    this.isPlaying = false;
    this.eventVideo = null;
    this.eventCover = null;
    this.init();
  }

  init() {
    this.elemWrapper.appendChild( this.elemCover );
    if ( this.elemVideo.poster ) {
      this.elemCover.style.backgroundImage = `url(${this.elemVideo.poster})`;
    }
    this.elemVideo.load();
  }

  on( callbacks ) {
    this.eventVideo = new EM( this.elemVideo );
    this.eventCover = new EM( this.elemCover );
    this.callbackBefore     = callbacks.before.bind( this );
    this.callbackPlayBefore = callbacks.playBefore.bind( this );
    this.callbackPlay       = callbacks.play.bind( this );
    this.callbackPause      = callbacks.pause.bind( this );
    this.callbackEnd        = callbacks.end.bind( this );
    this.eventCall( this.callbackBefore );
    this.eventVideo
      .on( this.eventNameCanPlay, this.handleCanplay.bind( this ) )
      .on( this.eventNamePlay, this.handlePlay.bind( this ) )
      .on( this.eventNamePause, this.handlePause.bind( this ) )
      .on( this.eventNameEnded, this.handleEnded.bind( this ) )
    ;
  }

  off() {
    this.eventVideo.off( `.${this.id}` );
    this.eventCover.off( `.${this.id}` );
  }

  handleCanplay( e ) {
    this.eventCall( this.callbackPlayBefore, e );
    this.eventCover.on( this.eventNameCoverClick, this.handleCoverClick.bind( this ) );
  }

  handlePlay( e ) {
    this.isPlaying = true;
    this.eventCall( this.callbackPlay, e );
  }

  handlePause( e ) {
    this.isPlaying = false;
    this.eventCall( this.callbackPause, e );
  }

  handleEnded( e ) {
    this.isPlaying = false;
    this.eventCall( this.callbackEnd, e );

    /**
     * IE 11 で確認。
     * 再生終了後にvideo.load() しておかないと再度のvideo.play()を許してくれない。
     */
    this.elemVideo.load();
  }

  handleCoverClick( e ) {
    e.preventDefault();
    if ( this.isPlaying === false ) {
      this.elemVideo.play();
    }
  }

  eventCall( func, e ) {
    if ( typeof func === 'function' ) {
      func.call( this, e, this );
    }
  }

}
