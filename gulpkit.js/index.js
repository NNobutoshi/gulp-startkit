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

const
  args = process.argv.slice( 4 )
;

( function _taskOnCommand() {
  const watchTasks = [];
  if ( !args.length ) {
    return;
  }
  tasks.serve_init();
  for ( let i = 0; i < args.length; i++ ) {
    const taskName = args[ i ];
    watchTasks[ taskName ] = tasks[ taskName ];
    exports[ taskName ] = tasks[ taskName ];
    if ( tasks.serve_reload ) {
      exports[ taskName ] = () => {
        let task = tasks[ taskName ];
        return task().on( 'end', tasks.serve_reload );
      };
    } else {
      exports[ taskName ] = tasks[ taskName ];
    }
  }
  watcher( watchTasks, tasks.serve_reload )();
} )();


/* default tasks */
exports.default = series(
  // tasks.clean,
  parallel(
    tasks.html_pug,
    series(
      tasks.icon_font,
      tasks.img_min,
      parallel( tasks.sprite, tasks.sprite_svg ),
      tasks.css_lint,
      tasks.css_sass,
    ),
    series( tasks.js_eslint, tasks.js_webpack )
  ),
  tasks.serve_init,
  watcher( tasks, tasks.serve_reload ),
);
// process.on( 'SIGINT', () => {
//   process.exit();
// } );
// process.on( 'exit', () => {
//   console.info( 'exit' );
// } );
