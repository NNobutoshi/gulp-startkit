/**
 * @module config/get_env_status
 * @requires ./constants.js
 */

export { getEnvStatus as default };

/**
 * 環境変数の値に応じた真偽値を返す。
 * @memberof module:config/get_env_status
 * @param {string} envStatus - 環境変数の数値の文字列。（例 '0'、'1'
 * @returns {boolean} - 環境変数の値に応じた真偽値。
 */
function getEnvStatus( envStatus ) {
  return !!Number( envStatus );
}
