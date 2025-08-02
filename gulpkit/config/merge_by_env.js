/**
 * @module config/merge_by_env
 * @requires lodash/merge.js
 * @requires ./constants.js
 */

import merge from 'lodash/merge.js';

import { PROD_ENV_NAME, DEV_ENV_NAME  } from './constants.js';

export { mergeByEnv as default };

/**
 * production 用のオブジェクトは、development を基準にしてマージする。<br>
 * @memberof module:config/merge_by_env
 * @param {string} env - 環境変数
 * @param {object} devObj - development 用のオブジェクト
 * @param {object} devprod - production 用のオブジェクト
 * @returns {object} - マージを行ったオブジェクト
 */
function mergeByEnv( env, baseObj, sourceObj ) {
  const result = {};
  switch ( env ) {
  case PROD_ENV_NAME:
    merge( result, baseObj, sourceObj );
    break;
  case  DEV_ENV_NAME:
    merge( result, baseObj );
    break;
  default:
  }
  return result;
}
