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
    css_lint     : require( './tasks/css_lint' ),
    js_lint      : require( './tasks/js_lint' ),
    clean        : require( './tasks/clean' ),
  }
  ,setupWatch  = require( './setup_watch' )
  ,lastRunTime = require( './tasks/last_run_time' )
;
const
  args = process.argv.slice( 4 )
;

if ( args.length ) {
  for ( let i = 0; i < args.length; i++ ) {
    exports[ args[ i ] ] = tasks[ args[ i ] ];
  }
  tasks.serve_init();
  setupWatch( exports, tasks.serve_reload )();
}

process.lastRunTime = lastRunTime.get();

/* default tasks */
exports.default = series(
  // tasks.clean,
  parallel(
    tasks.html_pug,
    series(
      tasks.icon_font,
      tasks.img_min,
      tasks.sprite,
      tasks.css_sass,
      tasks.css_lint,
    ),
    tasks.js_webpack,
    tasks.js_lint,
  ),
  tasks.serve_init,
  setupWatch( tasks, tasks.serve_reload ),
);

process.on( 'SIGINT', function() {
  process.exit();
} );

process.on( 'exit', () => {
  console.info( 'exit' );
  lastRunTime.set();
} );
