const
  { parallel, series, watch }         = require( 'gulp' )
  ,{ html_pug, html_pug_partial }     = require( './tasks/html_pug' )
  ,js_webpack = require( './tasks/js_webpack' )
  ,css_sass   = require( './tasks/css_sass' )
  ,time_stamp = require( './tasks/time_stamp' )
  ,icon_font  = require( './tasks/icon_font' )
  ,img_min    = require( './tasks/img_min' )
  ,sprite     = require( './tasks/sprite' )
  ,css_lint   = require( './tasks/css_lint' )
  ,js_lint    = require( './tasks/js_lint' )
  ,clean      = require( './tasks/clean' )
;
const
  config = require( './config.js' )
;

exports.html_pug           = html_pug;
exports.html_pug_partial   = html_pug_partial;
exports.js_webpack         = js_webpack;
exports.icon_font          = icon_font;
exports.img_min            = img_min;
exports.sprite             = sprite;
exports.css_sass           = css_sass;
exports.css_lint           = css_lint;
exports.js_lint            = js_lint;
exports.clean              = clean;

/* default tasks */
exports.default = series(
  clean,
  parallel(
    html_pug,
    series( icon_font, img_min ,sprite, css_sass, css_lint ),
    js_webpack,
    js_lint,
  ),
  time_stamp,
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
      watch( item.src, watch_options, exports[ key ] );
    } else if ( Array.isArray( item.watch ) ) {
      watch(  item.watch, watch_options, exports[ key ] );
    }
  }
  done();
}
