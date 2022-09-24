import ScrollManager from '../../js/_modules/libs/scrollmanager.js';
import OptimizedResize from '../../js/_modules/libs/optimizedresize.js';
import VideoGround from '../../js/_modules/videoground.js';

const
  CLASSNAME_VIDEO = 'js-pl-mainVisual_video'
  ,CLASSNAME_PLAYING = 'js-pl-mainVisual_video--isPlaying'
  ,CLASSNAME_DESTROYED = 'js-pl-mainVisual_video--isDestroyed'
  ,scrollManager   = new ScrollManager()
  ,optimizedresize = new OptimizedResize()
  ,videoground     = new VideoGround( {
    src                : '/examples/media/mainvisual.mp4',
    selectorVideoFrame : '.pl-mainVisual_body',
    aspectRatio        : 1080 / 1920,
  } )
;

videoground
  .run()
  .on( {
    play : function() {
      this.elemParent.classList.add( CLASSNAME_PLAYING );
      this.elemVideo.classList.add( CLASSNAME_VIDEO );
    },
    load : _fitPosAndSize,
    destroy :function() {
      this.elemParent.classList.remove( CLASSNAME_PLAYING );
      this.elemParent.classList.add( CLASSNAME_DESTROYED );
    },
  } )
;

function _fitPosAndSize() {
  const
    that = this
    ,elemOffsetItem = document.querySelector( '.sg-page_head' )
  ;
  let
    height = 0
    ,parentHeight = 0
  ;
  scrollManager.on( _fit );
  optimizedresize.on( _fit ).run();
  function _fit() {
    height = elemOffsetItem.offsetHeight;
    parentHeight = window.innerHeight - height;
    that.elemParent.style.marginTop = height + 'px';
    that.elemVideoFrame.style.marginTop = height + 'px';
    that.elemParent.style.height = parentHeight + 'px';
    that.elemVideoFrame.style.height = parentHeight + 'px';
    that.resize();
  }
}
