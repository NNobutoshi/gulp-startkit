import { commonConfig } from './common.js';
import switchConfig from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  watchInitEventName  : commonConfig.EVENT_NAME_WATCH_INIT,
  watchStartEventName : commonConfig.EVENT_NAME_WATCH_START,
  options : {
    watch : {
      usePolling : true,
    },
  },
};
const prodConfig = null;

const devOptions = {
  watch : {
    usePolling : true,
  },
};
const prodOptions = null;

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;

