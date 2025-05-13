import { commonConfig } from './common.js';
import switchConfig     from './switch.js';

export { switchedConf as config };

const devConfig = {
  command : `git clean -f ${ commonConfig.DIST }/`,
};

const prodConfig = null;

const switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig );
