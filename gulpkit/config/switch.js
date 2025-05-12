import merge from 'lodash/mergeWith.js';

// 'production'用の設定は、'development' を基準にしてマージする
export default function switchConfig( environment, devConfig, prodConfig ) {
  const config = {};
  switch ( environment ) {
  case 'production':
    merge( config, devConfig, prodConfig );
    break;
  case 'development':
    merge( config, devConfig );
  default:
  }
  return config;
}
