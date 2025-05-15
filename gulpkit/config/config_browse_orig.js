import { commonConfig } from './common.js';
import mergeConfForEnv from './merge_conf.js';

export { mergedConf as config, mergedOptions as options };

const
  NODE_ENV    = process.env.NODE_ENV
  ,BROWSE_ENV = process.env.BROWSE_ENV
  ,IS_PRODUCTION  = ( NODE_ENV === 'production' )
  ,IS_DEVELOPMENT = ( NODE_ENV === 'development' )
;

// 開発環境用。
const devConfig = {
  'enabled' : ( BROWSE_ENV ) ? !!Number( BROWSE_ENV )  : IS_DEVELOPMENT || !IS_PRODUCTION
};
// 本番環境用。
// 開発環境と異なる設定を行う場合に、
// その異なるプロパティ部分だけの同一構造のオブジェクトを代入。
// 同一設定の場合はnull を明示的に代入。
const prodConfig = null;

// devConf に同じ。
const devOptions = {
  'port'           : 9039,
  'browser'        : 'Chrome',
  'reloadThrottle' : 100,
  'proxy'          : 'localhost:8039'
};
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeConfForEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeConfForEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
