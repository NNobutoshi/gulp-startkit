/**
 * @module config/merge_by_env
 * @requires lodash/merge.js
 * @requires ./constants.js
 */

import merge from 'lodash/merge.js';

import { NODE_ENV_PROD, NODE_ENV_DEV  } from './constants.js';

export { mergeByEnv as default };

/**
 * production 用のオブジェクトは、development を基準にしてマージする。<br>
 * @memberof module:config/merge_by_env
 * @param {string} env - 環境変数
 * @param {object} baseObj - マージのベースにするオブジェクト
 * @param {object} sourceObj - マージする差分のオブジェクト
 * @returns {object} - マージを行ったオブジェクト
 */
function mergeByEnv( env, baseObj, sourceObj ) {
  switch ( env ) {
  case NODE_ENV_PROD:
    return merge( {}, baseObj, sourceObj );
  case NODE_ENV_DEV:
    return baseObj;
  default:
    throw new Error( `Invalid environment name: ${ env }` );
  }
}
