/**
 * @module config_browse_orig
 * @description <strong style="color:#b00">live reload 機能を利用する際はこのファイルを複製し、config_browse.js とリネームする。</strong><br>
 * 作業者各々でポート等の設定を自由に行えるようにする意図。<br>
 * config_browes.js はGit igonre でコミットから除外。
 * @requires node:process
 * @requires ./merge_by_env.js
 * @requires ./get_env_status.js
 * @example
 * // 開発環境用設定例
 * const devOptions = {
 *   'port'           : 3000,
 *   'browser'        : 'Chrome',
 *   'reloadThrottle' : 100,
 *   'server' : './dist/development/html',
 * };
 * // 本番環境用設定例
 * // 上書きさせたい設定だけ
 * const prodOptions = {
 *   'port'           : 3001,
 *   'server' : './dist/production/html',
 * };
 */

import { env } from 'node:process';

import mergeByEnv   from './merge_by_env.js';
import getEnvStatus from './get_env_status.js';

export { mergedConfig as config, mergedOptions as options };

const
  BROWSING_STATUS = getEnvStatus( env.BROWSING_ENABLED )
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config_browse_orig
 */
const devConfig = {
  enabled : BROWSING_STATUS ?? true,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_browse_orig
 */
const prodConfig = {
  enabled : BROWSING_STATUS ?? false,
};

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config_browse_orig
 */
const devOptions = {
  port    : 3000,
  browser : 'Chrome',
  server  : './dist/development/html',
  reloadThrottle : 100,
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_browse_orig
 */
const prodOptions = {
  port   : 3001,
  server : './dist/production/html',
};

// 開発環境用の設定をベースにマージする。
const
  mergedConfig   = mergeByEnv( env.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( env.NODE_ENV, devOptions, prodOptions )
;
