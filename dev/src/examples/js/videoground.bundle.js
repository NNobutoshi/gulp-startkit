'use strict';

import '../../js/_modules/jqueryhub.js';
import VideoGround from '../../js/_modules/videoground.js';

const
  mdls = {}
;

mdls.videoground = new VideoGround( {
  src: '/examples/media/mainvisual.mp4',
  targetClassName: 'js-mainVisual_video',
  selectorVideoFrame: '.pl-mainVisual_body',
  classNamePlaying: 'js-mainVisual_video--isPlaying',
  classNameDestroyed: 'js-mainVisual_video--isDestroyed',
} );

mdls.videoground.run();
