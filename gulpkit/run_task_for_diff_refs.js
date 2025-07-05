/**
 * Git diff でブランチ間やコミット間の差分をdiff_build の対象とする場合、<br>
 * argvの5つ目の引数で実行するタスクを決定する。<br>
 * 省略された場合、タスクはmain を選択。<br>
 * 3つ目と4つ目の引数は、ブランチ間、コミット間が指定されている想定。
 * @module run_task_for_diff_refs
 * @requires node:process
 * @requires gulpkit/tasks/index.js
 * @example
 * // コマンドライン
 * // master ブランチと develop ブランチとの差分ファイルを対象として、html タスクを実行する。
 * npm run one_refs master develop html
 **/

import { argv  } from 'node:process';

import fancyLog from 'fancy-log';

import main, { html, img, css, js } from './index.js';

runTaskByName( argv[ 4 ] );

fancyLog( `Running task: ${ argv[ 4 ] || 'main' }` );
fancyLog( `Comparing refs: ${ argv[ 2 ] }...${ argv[ 3 ] }` );

/**
 * argvの5つ目の引数に応じてタスクを実行。
 * @param {string} taskName - argvの5つ目の引数
 */
function runTaskByName( taskName ) {
  switch ( taskName ) {
  case 'main':
    main();
    break;
  case 'html':
    html();
    break;
  case 'img':
    img();
    break;
  case 'css':
    css();
    break;
  case 'js':
    js();
    break;
  default:
    main();
  }
}
