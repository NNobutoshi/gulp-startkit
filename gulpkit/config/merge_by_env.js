import merge from 'lodash/merge.js';
import { PRODUCTION_ENV, DEVELOPMENT_ENV  } from './env_type.js';

export { mergeByEnv as default };

/**
 * @module config/merge_by_env
 * @requires lodash/merge.js
 * @requires ./env_type.js
 */
/**
 * production 用のオブジェクトは、development を基準にしてマージする。<br>
 * @memberof module:config/merge_by_env
 * @param {String} env - 環境変数
 * @param {Object} devObj - depelopment 用のオブジェクト
 * @param {Object} devprod - production 用のオブジェクト
 * @returns {Object} - マージを行ったオブジェクト
 */
function mergeByEnv( env, baseObj, sourceObj ) {
  const result = {};
  switch ( env ) {
  case PRODUCTION_ENV:
    merge( result, baseObj, sourceObj );
    break;
  case DEVELOPMENT_ENV:
    merge( result, baseObj );
    break;
  default:
  }
  return result;
}
