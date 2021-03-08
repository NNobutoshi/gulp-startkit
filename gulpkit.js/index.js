const
  { parallel, series } = require( 'gulp' )
  ,tasks = {
    html_pug     : require( './tasks/html_pug' ),
    js_webpack   : require( './tasks/js_webpack' ),
    css_sass     : require( './tasks/css_sass' ),
    icon_font    : require( './tasks/icon_font' ),
    img_min      : require( './tasks/img_min' ),
    serve_init   : require( './tasks/serve' ).serve_init,
    serve_reload : require( './tasks/serve' ).serve_reload,
    sprite       : require( './tasks/sprite' ),
    sprite_svg   : require( './tasks/sprite_svg' ),
    css_lint     : require( './tasks/css_lint' ),
    js_eslint    : require( './tasks/js_eslint' ),
    clean        : require( './tasks/clean' ),
  }
  ,watcher = require( './tasks/watcher' )
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
  if ( !args.length ) {
    return;
  }
  args.forEach( ( taskName ) => {
    exports[ taskName ] = watchTasks[ taskName ] = tasks[ taskName ];
  } );
  process.on( 'beforeExit', () => {
    tasks.serve_init( watcher( watchTasks, tasks.serve_reload ) );
  } );
} )();

/*
 * default
 */
exports.default = series(
  tasks.clean,
  parallel(
    tasks.html_pug,
    tasks.img_min,
    series(
      parallel( tasks.icon_font, tasks.sprite, tasks.sprite_svg ),
      tasks.css_lint,
      tasks.css_sass,
    ),
    series( tasks.js_eslint, tasks.js_webpack )
  ),
  tasks.serve_init,
  watcher( tasks, tasks.serve_reload ),
);
