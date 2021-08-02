import SimpleVideoPlay from '../../js/_modules/simplevideoplay.js';

const
  CLASSNAME_COVER    = 'js-video_cover'
  ,CLASSNAME_CANPLAY = 'js-video--canPlay'
  ,CLASSNAME_PLAY    = 'js-video--isPlaying'
  ,CLASSNAME_PAUSED  = 'js-video--isPaused'
  ,CLASSNAME_ENDED   = 'js-video--isEnded'
;

new SimpleVideoPlay( {
  selectorWrapper : '.pl-videoPlayer_outer',
  selectorVideo   : '.pl-videoPlayer_video',
} ).on( {
  before : function() {
    this.elemCover.classList.add( CLASSNAME_COVER );
  },
  playBefore : function() {
    this.elemWrapper.classList.add( CLASSNAME_CANPLAY );
  },
  play : function() {
    this.elemWrapper.classList.add( CLASSNAME_PLAY );
    this.elemWrapper.classList.remove( CLASSNAME_PAUSED );
    this.elemWrapper.classList.remove( CLASSNAME_ENDED );
  },
  pause : function() {
    this.elemWrapper.classList.add( CLASSNAME_PAUSED );
    this.elemWrapper.classList.remove( CLASSNAME_PLAY );
  },
  end : function() {
    this.elemWrapper.classList.add( CLASSNAME_ENDED );
    this.elemWrapper.classList.remove( CLASSNAME_PLAY );
    this.elemWrapper.classList.remove( CLASSNAME_PAUSED );
  }
} );
