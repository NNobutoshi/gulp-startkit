import main, { html, img, css, js } from './index.js';
import { argv  }    from 'node:process';


const taskName = argv.slice( 4 )[ 0 ];
let run;

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
