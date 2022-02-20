import gulp from 'gulp';
import clean from './tasks/clean.js';
import copy_to from  './tasks/copy_to.js';
import html_pug from './tasks/html_pug.js';
import watcher from './tasks/watcher.js';
import serve from './tasks/serve.js';

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
    // copy_to      : require( './tasks/copy_to' ),
    // css_lint     : require( './tasks/css_lint' ),
    // css_sass     : require( './tasks/css_sass' ),
    // html_pug     : require( './tasks/html_pug' ),
    // icon_font    : require( './tasks/icon_font' ),
    // img_min      : require( './tasks/img_min' ),
    // js_eslint    : require( './tasks/js_eslint' ),
    // js_webpack   : require( './tasks/js_webpack' ),
    // serve_init   : require( './tasks/serve' ).serve_init,
    // serve_reload : require( './tasks/serve' ).serve_reload,
    // sprite       : require( './tasks/sprite' ),
    // sprite_svg   : require( './tasks/sprite_svg' ),
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
  ),
  // parallel(
  //   tasks.copy_to,
  //   tasks.html_pug,
  //   tasks.img_min,
  //   series(
  //     parallel( tasks.icon_font, tasks.sprite, tasks.sprite_svg ),
  //     tasks.css_lint,
  //     tasks.css_sass,
  //   ),
  //   series( tasks.js_eslint, tasks.js_webpack )
  // ),
  serve_init,
  watcher( tasks, tasks.serve_reload ),
);

export {
  clean,
  copy_to,
  html_pug,
};
