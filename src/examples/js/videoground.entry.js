import ScrollManager from '../../js/_modules/libs/scrollmanager';
import OptimizedResize from '../../js/_modules/libs/optimizedresize';
import VideoGround from '../../js/_modules/videoground';

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
    onPlay : function() {
      this.elemParent.classList.add( CLASSNAME_PLAYING );
    },
    onPlayBefore : function() {
      this.elemVideo.classList.add( CLASSNAME_VIDEO );
    },
    onLoad : _fitPosAndSize,
    onDestroy :function() {
      this.elemParent.classList.remove( CLASSNAME_PLAYING );
      this.elemParnet.classList.add( CLASSNAME_DESTROYED );
    },
  } )
;

videoground.run();

function _fitPosAndSize() {
  const
    that = this
    ,elemOffsetItem = document.querySelector( '.page_head' )
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
