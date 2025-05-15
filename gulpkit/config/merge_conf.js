import merge from 'lodash/merge.js';

/**
 * production 用のオブジェクトは、development を基準にしてマージする
 * @param {String} env - 環境変数
 * @param {Object} devObj - depelopment 用のオブジェクト
 * @param {Object} devprod - production 用のオブジェクト
 * @returns {Object} - マージを行ったオブジェクト
 */
export default function mergeConfForEnv( env, devObj, prodObj ) {
  const result = {};
  switch ( env ) {
  case 'production':
    merge( result, devObj, prodObj );
    break;
  case 'development':
    merge( result, devObj );
    break;
  default:
  }
  return result;
}
