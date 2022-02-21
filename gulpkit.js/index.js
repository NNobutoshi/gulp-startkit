import gulp from 'gulp';
import clean from './tasks/clean.js';
import copy_to from  './tasks/copy_to.js';
import html_pug from './tasks/html_pug.js';
import watcher from './tasks/watcher.js';
import serve from './tasks/serve.js';
import img_min from './tasks/img_min.js';
import css_lint from './tasks/css_lint.js';
import icon_font from './tasks/icon_font.js';
import sprite from './tasks/sprite.js';
import css_sass from './tasks/css_sass.js';
import sprite_svg from './tasks/sprite_svg.js';
import js_eslint from './tasks/js_eslint.js';
import js_webpack from './tasks/js_webpack.js';

const { series, parallel } = gulp;

const
  serve_init = serve.serve_init
  ,serve_reload = serve.serve_reload
;

const
  tasks = {
    clean : clean,
    copy_to : copy_to,
    html_pug : html_pug,
    img_min : img_min,
    css_lint : css_lint,
    icon_font : icon_font,
    sprite : sprite,
    css_sass : css_sass,
    sprite_svg : sprite_svg,
    js_eslint : js_eslint,
    js_webpack : js_webpack,
  }
;

/*
 * コマンドライン上 Gulp <task>
 * でタスクを個別に実行する際、watch や server も機能させる。
 */
( function _taskOnCommand() {
  const
    watchTasks = {}
    ,args = process.argv.slice( process.argv.indexOf( 'gulpkit.js' ) + 1 )
  ;
  if ( args.length === 0 ) {
    return;
  }
  args.forEach( ( taskName ) => {
    watchTasks[ taskName ] = tasks[ taskName ];
  } );
  process.on( 'beforeExit', () => {
    serve_init( watcher( watchTasks, serve_reload ) );
  } );
} )();


/*
 * default
 */
export default series(
  clean,
  parallel(
    copy_to,
    html_pug,
    img_min,
    series(
      parallel( icon_font, sprite, sprite_svg ),
      css_lint,
      css_sass,
    ),
    series( js_eslint, js_webpack )
  ),
  serve_init,
  watcher( tasks, serve_reload ),
);

export {
  clean,
  copy_to,
  html_pug,
  img_min,
  css_lint,
  icon_font,
  sprite,
  sprite_svg,
  css_sass,
  js_eslint,
  js_webpack,
};
