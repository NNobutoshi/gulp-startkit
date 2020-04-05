const
  { parallel, series } = require( 'gulp' )
  ,css_sass = require( './tasks/css_sass' )
  ,css_lint = require( './tasks/css_lint' )
  ,time_stamp = require( './tasks//time_stamp' )
  ,{ html_pug } = require( './tasks/html_pug' )
  ,icon_font = require( './tasks/icon_font' )
  ,img_min = require( './tasks/img_min' )
  ,js_lint = require( './tasks/js_lint' )
  ,sprite = require( './tasks/sprite' )
  ,{ js_webpack } = require( './tasks/js_webpack' )
  // ,requireDir = require( 'require-dir' )
  // ,config = require( './config.js' ).config
;

// requireDir( './tasks' );

// gulp.task( 'default', gulp.series(
//   Object
//     .keys( config )
//     .filter( function( key ) {
//       return config[ key ].default === true;
//     } ) )
// )
// ;

exports.default = series(
  parallel(
    html_pug
    ,series( icon_font, img_min ,sprite, css_sass, css_lint )
    ,js_webpack
    ,js_lint
  )
  ,time_stamp
  ,_do
);

function _do() {
  console.info( 'done' );
}
