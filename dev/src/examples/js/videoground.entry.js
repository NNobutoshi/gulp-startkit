'use strict';

import ScrollManager from '../../js/_modules/scrollmanager.js';
import Optimizedresize from '../../js/_modules/optimizedresize.js';
import VideoGround from '../../js/_modules/videoground.js';

const
  mdls = {
    scrollManager: new ScrollManager(),
    optimizedresize: new Optimizedresize(),
    videoground : new VideoGround( {
      src                : '/examples/media/mainvisual.mp4',
      targetClassName    : 'js-mainVisual_video',
      selectorVideoFrame : '.pl-mainVisual_body',
      classNamePlaying   : 'js-mainVisual_video--isPlaying',
      classNameDestroyed : 'js-mainVisual_video--isDestroyed',
      aspectRatio: 1080 / 2048,
      onLoad: () => {
        _assist();
      }
    } ),
  }
;

mdls.videoground.run();

function _assist() {
  const
    elemOffsetItem = document.querySelector( '.page_head' )
    ,elemVideoWrapper = document.querySelector( '.pl-mainVisual' )
    ,elemVideoFrame = elemVideoWrapper.querySelector( '.pl-mainVisual_body' )
  ;
  let
    height = 0
    ,parentHeight = 0
  ;
  mdls.scrollManager.on( () => {
    _run();
  } );
  mdls.optimizedresize.on( () => {
    _run();
  } )
  ;
  _run();
  function _run() {
    height = elemOffsetItem.offsetHeight;
    parentHeight = window.innerHeight - height;
    elemVideoWrapper.style.marginTop = height + 'px';
    elemVideoFrame.style.marginTop = height + 'px';
    elemVideoWrapper.style.height = parentHeight + 'px';
    elemVideoFrame.style.height = parentHeight + 'px';
    mdls.videoground.resize();
  }
}
