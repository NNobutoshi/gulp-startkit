import { commonConfig } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config };

// 開発環境用。
const devConfig = {
  command : `git clean -f ${ commonConfig.DIST }/`,
};
// 本番環境用。
// 開発環境と異なる設定を行う場合に、
// その異なるプロパティ部分だけの同一構造のオブジェクトを代入。
// 同一設定の場合はnull を明示的に代入。
const prodConfig = null;

// すべては開発環境用の設定をベースにする。
const mergedConf = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig );
