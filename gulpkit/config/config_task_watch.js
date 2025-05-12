import { config }   from './common.js';
import switchConfig from './switch.js';

const
  devConfig = {
    watchInitEventName  : config.EVENT_NAME_WATCH_INIT,
    watchStartEventName : config.EVENT_NAME_WATCH_START,
    options : {
      watch : {
        usePolling : true,
      },
    },
  }
  ,prodConfig = {}
;

export default switchConfig( config.NODE_ENV, devConfig, prodConfig );
