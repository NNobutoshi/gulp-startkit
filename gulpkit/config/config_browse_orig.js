import { commonConfig } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

const BROWSE_ENV = process.env.BROWSE_ENV;

/**
 * @module config_browse_orig
 * @description live reload 機能は作業者各々でポート等の設定を自由に行えるようにする意図。<br>
 * 機能を利用する場合は、このファイルをconfig_browse_orig.js -> config_browse.js とリネームする。
 * @requires ./common.js
 * @requires ./merge_by_env.js
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

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config_browse_orig
 */
const devConfig = {
  'enabled' : ( BROWSE_ENV )
    ? !!Number( BROWSE_ENV )
    : commonConfig.IS_DEVELOPMENT || !commonConfig.IS_PRODUCTION
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_browse_orig
 */
const prodConfig = null;


/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config_browse_orig
 */
const devOptions = {
  'port'           : 3000,
  'browser'        : 'Chrome',
  'reloadThrottle' : 100,
  'server' : './dist/development/html',
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_browse_orig
 */
const prodOptions = {
  'port'           : 3001,
  'server' : './dist/production/html',
};

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
