const
  { parallel, series } = require( 'gulp' )
  ,{ html_pug } = require( './tasks/html_pug' )
  ,icon_font = require( './tasks/icon_font' )
  ,img_min = require( './tasks/img_min' )
  ,sprite = require( './tasks/sprite' )
  ,css_sass = require( './tasks/css_sass' )
  ,css_lint = require( './tasks/css_lint' )
  ,time_stamp = require( './tasks//time_stamp' )
  ,js_lint = require( './tasks/js_lint' )
  ,{ js_webpack } = require( './tasks/js_webpack' )
;
exports.default = series(
  parallel(
    html_pug
    ,series( icon_font, img_min ,sprite, css_sass, css_lint )
    ,js_webpack
    ,js_lint
  )
  ,time_stamp
);
