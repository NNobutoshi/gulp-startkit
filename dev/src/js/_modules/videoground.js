import $ from 'jquery';
export default class VideoGround {

  constructor( options ) {
    this.defaultSettings = {
      name: 'videoGround',
      src: '',
      selectorVideoFrame: '',
      waitTime : 10000,
      aspectRatio: 720 / 1280,
      actualHeightRatio: 1 / 1,
      targetClassName: 'js--video',
      classNamePlaying: 'js--isPlaying',
      classNameDestroyed: 'js--isDestroyed',
      onDestroy: null,
      onPlay: null,
      onBefore: null
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.elemVideo = null;
    this.elemVideoFrame = null;
    this.id = this.settings.name;
    this.isPlaying = false;
    this.destroyTimerId = null;
    this.resizeRafId = null;
  }

  run() {
    const
      settings = this.settings
      ,elemVideo = this.elemVideo = _createVideo( [ 'muted', 'playsinline', 'loop' ] )
      ,elemVideoFrame = this.elemVideoFrame = document.querySelector( settings.selectorVideoFrame )
    ;

    if ( elemVideoFrame === null ) return this;

    this.autoDestroy();
    this.on();

    _eventCall( settings.onBefore );

    ( async () => {
      if ( await this.testPlay() === false ) return this.destroy();
      elemVideo.src = settings.src;
      elemVideo.classList.add( settings.targetClassName );
      elemVideoFrame.appendChild( elemVideo );
      elemVideo.load();
    } )();
    return this;
  }

  testPlay() {
    return new Promise( ( resolve ) => {
      const
        retries = 3
        ,testVideo = _createVideo( [ 'muted', 'playsinline' ] )
      ;
      let
        timeoutId = null
        ,currentTry = 0
      ;
      testVideo.play();
      ( function _try() {
        currentTry = currentTry + 1;
        clearTimeout( timeoutId );
        timeoutId = null;
        if ( testVideo.paused === false || currentTry > retries ) {
          resolve( !testVideo.paused );
          return;
        }
        timeoutId = setTimeout( () => {
          _try();
        }, 160 );
      } )();
    } );
  }

  on() {
    const
      settings = this.settings
      ,elemVideo = this.elemVideo
      ,elemBody = document.querySelector('body')
    ;
    $( elemVideo ).on( `play.${this.id}`, () => {
      clearTimeout( this.destroyTimerId );
      this.destroyTimerId = null;
      this.isPlaying = true;
      elemBody.classList.add( settings.classNamePlaying );
      _eventCall( settings.onPlay );
    } );
    $( elemVideo ).on( `canplay.${this.id}`, () => {
      elemVideo.play();
    } );
    $( window )
      .on( `resize.${this.id} orientationchange.${this.id}`, () => {
        this.resize();
      } )
      .trigger( `resize.${this.id}` )
    ;
    return this;
  }

  destroy() {
    const
      settings = this.settings
      ,elemBody = document.querySelector('body')
    ;
    clearTimeout( this.destroyTimerId );
    elemBody.classList.remove( settings.classNamePlaying );
    elemBody.classList.add( settings.classNameDestroyed );
    if ( this.elemVideoFrame.querySelector( settings.targetClassName ) !== null ) {
      this.elemVideoFrame.removeChild( this.elemVideo );
    }
    _eventCall( this.settings.onDestroy );
    return this;
  }

  autoDestroy() {
    this.destroyTimerId = setTimeout( () => {
      clearTimeout( this.destroyTimerId );
      this.destroyTimerId = null;
      this.destroy();
    }, this.settings.waitTime );
  }

  resize() {
    const
      settings = this.settings
    ;
    cancelAnimationFrame( this.resizeRafId );
    this.resizeRafId = requestAnimationFrame( () => {
      const
        frameWidth = this.elemVideoFrame.offsetWidth
        ,frameHeight = this.elemVideoFrame.offsetHeight
        ,frameAspectRatio = frameHeight / frameWidth
      ;
      if ( frameAspectRatio > settings.aspectRatio ) {
        this.elemVideo.style.width = 'auto';
        this.elemVideo.style.height = frameHeight * settings.actualHeightRatio + 'px';
      } else {
        this.elemVideo.style.width = 100 + '%';
        this.elemVideo.style.height = 'auto';
      }
    } );
  }

}

function _eventCall( f ) {
  if ( typeof f === 'function' ) {
    f.call( this );
  }
}

function _createVideo( props ) {
  const elemVideo = document.createElement('video');
  for ( let i = 0, len = props.length; i < len; i ++ ) {
    elemVideo.setAttribute( props[i], '' );
    elemVideo[ props[ i ] ] = true;
  }
  return elemVideo;
}
