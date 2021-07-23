import SimpleVideoPlay from '../../js/_modules/simplevideoplay.js';

const
  CLASSNAME_COVER    = 'js-video_cover'
  ,CLASSNAME_CANPLAY = 'js-video--canPlay'
  ,CLASSNAME_PLAY    = 'js-video--isPlaying'
  ,CLASSNAME_PAUSED  = 'js-video--isPaused'
  ,CLASSNAME_ENDED   = 'js-video--isEnded'
;

new SimpleVideoPlay( {
  selectorOuter : '.pl-videoPlayer_outer',
  selectorVideo : '.pl-videoPlayer_video',
  onBefore : function() {
    this.elemCover.classList.add( CLASSNAME_COVER );
  },
  onPlayBefore : function() {
    this.elemWrapper.classList.add( CLASSNAME_CANPLAY );
  },
  onPlay : function() {
    this.elemWrapper.classList.add( CLASSNAME_PLAY );
    this.elemWrapper.classList.remove( CLASSNAME_PAUSED );
    this.elemWrapper.classList.remove( CLASSNAME_ENDED );
  },
  onPause : function() {
    this.elemWrapper.classList.add( CLASSNAME_PAUSED );
    this.elemWrapper.classList.remove( CLASSNAME_PLAY );
  },
  onEnd : function() {
    this.elemWrapper.classList.add( CLASSNAME_ENDED );
    this.elemWrapper.classList.remove( CLASSNAME_PLAY );
    this.elemWrapper.classList.remove( CLASSNAME_PAUSED );
  }
} );
