import merge        from 'lodash/mergeWith.js';

const
  NODE_ENV        = process.env.NODE_ENV
  ,BROWSE_ENV     = process.env.BROWSE_ENV
  ,IS_PRODUCTION  = ( NODE_ENV === 'production' )
  ,IS_DEVELOPMENT = ( NODE_ENV === 'development' )
  ,ENABLE_BROWSE  = ( BROWSE_ENV ) ? !!Number( BROWSE_ENV )  : IS_DEVELOPMENT || !IS_PRODUCTION
;
const
  config = {}
;
const
  config_dev = {
    'enable' : ENABLE_BROWSE,
    'options' : {
      'port'           : 9039,
      'browser'        : 'Chrome',
      'reloadThrottle' : 100,
      'proxy'          : 'localhost:8039'
    }
  }
  ,config_prod = {}
;

switch ( NODE_ENV ) {
case 'production':
  merge( config, config_dev, config_prod );
  break;
case 'development':
  merge( config, config_dev );
default:
}

export default config;
