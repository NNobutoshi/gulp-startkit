/**
 * @module config/get_env_status
 * @requires ./constants.js
 */

export { getEnvStatus as default };

/**
 * 環境変数の値に応じた真偽値を返す。<br>
 * 環境変数が設定されていない場合はnull を返す。
 * @memberof module:config/get_env_status
 * @param {string} envStatus - 環境変数の数値の文字列。（例 '0'、'1'
 * @returns {boolean|null} - 環境変数の値に応じた真偽値。環境変数が設定されていない場合はnull を返す
 */
function getEnvStatus( envStatus ) {
  return ( !envStatus ) ? null : !!Number( envStatus );
}
