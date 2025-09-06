/**
 * @module utilities/exists
 * @requires node:fs/promises
 */

import { access } from 'node:fs/promises';

export { exists as default };

/**
 * ファイルの存在を確認する。<br>
 * default としてエクスポート。
 * @param {string} filePath - ファイルの絶対パス
 * @returns {Promise<boolean>} - ファイルが存在するか否か
 */
async function exists( filePath ) {
  try {
    await access( filePath );
    return true;
  } catch {
    return false;
  }
}
