import gulp from 'gulp';
import clean from './gulpkit.js/tasks/clean.js';
import copy_to from  './gulpkit.js/tasks/copy_to.js';
import html_pug from './gulpkit.js/tasks/html_pug.js';
import watcher from './gulpkit.js/tasks/watcher.js';
import serve from './gulpkit.js/tasks/serve.js';
import img_min from './gulpkit.js/tasks/img_min.js';
import css_lint from './gulpkit.js/tasks/css_lint.js';
import icon_font from './gulpkit.js/tasks/icon_font.js';
import sprite from './gulpkit.js/tasks/sprite.js';
import css_sass from './gulpkit.js/tasks/css_sass.js';
import sprite_svg from './gulpkit.js/tasks/sprite_svg.js';
import js_eslint from './gulpkit.js/tasks/js_eslint.js';
import js_webpack from './gulpkit.js/tasks/js_webpack.js';

const { series, parallel } = gulp;

const
  serve_init    = serve.serve_init
  ,serve_reload = serve.serve_reload
;

const
  tasks = {
    clean      : clean,
    copy_to    : copy_to,
    img_min    : img_min,
    html_pug   : html_pug,
    icon_font  : icon_font,
    sprite     : sprite,
    sprite_svg : sprite_svg,
    css_lint   : css_lint,
    css_sass   : css_sass,
    js_eslint  : js_eslint,
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
    series(
      img_min,
      html_pug,
      parallel(
        icon_font,
        sprite,
        sprite_svg
      ),
      css_lint,
      css_sass,
      js_eslint,
      js_webpack,
    )
  ),
  serve_init,
  watcher( tasks, serve_reload ),
);

export {
  clean,
  copy_to,
  img_min,
  html_pug,
  icon_font,
  sprite,
  sprite_svg,
  css_lint,
  css_sass,
  js_eslint,
  js_webpack,
};
