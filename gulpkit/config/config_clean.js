import { config } from './common.js';
import switchConfig     from './switch.js';

const
  devConfig = {
    command : `git clean -f ${ config.DIST }/`,
  }
  ,prodConfig = {}
;

export default switchConfig( config.NODE_ENV,  devConfig, prodConfig );
