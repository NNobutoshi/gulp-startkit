import merge from 'lodash/mergeWith.js';

// 'production'用の設定は、'development' を基準にしてマージする
export default function switchConfig( environment, devConfig, prodConfig ) {
  if ( !prodConfig ) {
    return devConfig;
  }
  switch ( environment ) {
  case 'production':
    return merge( devConfig, prodConfig );
  case 'development':
    return devConfig;
  default:
  }
  return devConfig;
}
