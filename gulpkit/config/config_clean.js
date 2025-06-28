/**
 * @memberof module:config
 * @requires node:process
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

import { env } from 'node:process';

import { commonConfig } from './common.js';
import mergeByEnv       from './merge_by_env.js';

export { mergedConf as config };

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConcig:clean
 */
const devConfig = {
  command : `git clean -f ${ commonConfig.DIST }/`,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConcig:clean
 */
const prodConfig = null;

// すべては開発環境用の設定をベースにする。
const mergedConf = mergeByEnv( env.NODE_ENV, devConfig, prodConfig );
