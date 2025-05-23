import main, { html, img, css, js } from './index.js';
import { argv  }    from 'node:process';


const taskName = argv.slice( 4 )[ 0 ];
let run;

/**
 * Git diff でブランチ間やコミット間の差分をdiff_build の対象とする場合、<br>
 * argvの5つ目の引数で実行するタスクを決定する。<br>
 * 省略された場合、タスクはmain を選択。<br>
 * 3つ目と4つ目の引数は、ブランチ間、コミット間が指定されている想定。
 * @module build_by_comparing_refs
 **/
switch ( taskName ) {
case 'main':
  run = main;
  break;
case 'html':
  run = html;
  break;
case 'img':
  run = img;
  break;
case 'css':
  run = css;
  break;
case 'js':
  run = js;
  break;
default:
  run = main;
}

run();
