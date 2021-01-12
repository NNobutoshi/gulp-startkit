const
  { parallel, series, watch } = require( 'gulp' )
  ,tasks = {
    html_pug_partial : require( './tasks/html_pug' ).html_pug_partial,
    html_pug         : require( './tasks/html_pug' ).html_pug,
    js_webpack       : require( './tasks/js_webpack' ),
    css_sass         : require( './tasks/css_sass' ),
    icon_font        : require( './tasks/icon_font' ),
    img_min          : require( './tasks/img_min' ),
    sprite           : require( './tasks/sprite' ),
    css_lint         : require( './tasks/css_lint' ),
    js_lint          : require( './tasks/js_lint' ),
    clean            : require( './tasks/clean' ),
  }
  ,lastRunTime = require( './tasks/last_run_time.js' )
  ,config = require( './config.js' )
;
const
  directTaskName = process.argv[ 4 ]
;

if ( directTaskName && directTaskName in tasks ) {
  exports[ directTaskName ] = tasks[ directTaskName ];
}

process.lastRunTime = lastRunTime.get();

/* default tasks */
exports.default = series(
  // tasks.clean,
  parallel(
    tasks.html_pug,
    series( tasks.icon_font, tasks.img_min, tasks.sprite, tasks.css_sass, tasks.css_lint ),
    tasks.js_webpack,
    tasks.js_lint,
  ),
  _setupWatch,
);

function _setupWatch( done ) {
  const
    watch_options = config.watch.options
  ;
  for ( const key in config ) {
    const
      item = config[ key ]
    ;
    if ( item.watch === true && item.src ) {
      watch( item.src, watch_options, tasks[ key ] );
    } else if ( Array.isArray( item.watch ) ) {
      watch(  item.watch, watch_options, tasks[ key ] );
    }
  }
  done();
}

process.on( 'SIGINT', function() {
  process.exit();
} );

process.on( 'exit', () => {
  console.info( 'exit' );
  lastRunTime.set();
} );
