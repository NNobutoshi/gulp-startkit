const
  { parallel, series, watch }         = require( 'gulp' )
  ,{ html_pug, html_pug_partial }     = require( './tasks/html_pug' )
  ,{ js_webpack, js_webpack_partial } = require( './tasks/js_webpack' )
  ,{ css_sass, css_clean }            = require( './tasks/css_sass' )
  ,time_stamp = require( './tasks/time_stamp' )
  ,icon_font  = require( './tasks/icon_font' )
  ,img_min    = require( './tasks/img_min' )
  ,sprite     = require( './tasks/sprite' )
  ,css_lint   = require( './tasks/css_lint' )
  ,js_lint    = require( './tasks/js_lint' )
;
const
  config = require( './config.js' )
;

exports.html_pug           = html_pug;
exports.html_pug_partial   = html_pug_partial;
exports.js_webpack         = js_webpack;
exports.js_webpack_partial = js_webpack_partial;
exports.icon_font          = icon_font;
exports.img_min            = img_min;
exports.sprite             = sprite;
exports.css_sass           = css_sass;
exports.css_lint           = css_lint;
exports.js_lint            = js_lint;

exports.default = series(
  parallel(
    html_pug
    ,series( icon_font, img_min ,sprite, css_clean, css_sass, css_lint )
    ,js_webpack
    ,js_lint
  )
  ,time_stamp
  ,_setupWatch
);

function _setupWatch( done ) {
  Object
    .keys( config )
    .forEach( key => {
      let targets;
      const item = config[ key ];
      if ( Array.isArray( item.watch ) ) {
        targets = item.watch;
      } else if ( item.watch === true ) {
        targets = item.src;
      }
      if ( targets ) {
        watch( targets, config.watch.options, exports[ key ] );
      }
    } )
  ;
  done();
}
