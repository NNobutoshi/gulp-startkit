import { commonConfig } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

const BROWSE_ENV = process.env.BROWSE_ENV;

// 開発環境用。
const devConfig = {
  'enabled' : ( BROWSE_ENV )
    ? !!Number( BROWSE_ENV )
    : commonConfig.IS_DEVELOPMENT || !commonConfig.IS_PRODUCTION
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
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
