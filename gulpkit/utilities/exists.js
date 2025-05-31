import { access } from 'node:fs/promises';

export { exists as default };

/**
 * @module utilities/exists
 * @requires node:fs/promises
 */
/**
 * ファイルの存在を確認する。<br>
 * default としてエクスポート。
 * @param {String} filePath - ファイルの絶対パス
 * @returns {Boolean} ファイルが存在するか否か
 */
async function exists( filePath ) {
  try {
    await access( filePath );
    return true;
  } catch {
    return false;
  }
}
