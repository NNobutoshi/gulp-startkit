const
  { src, lastRun } = require( 'gulp' )
  ,eslint  = require( 'gulp-eslint' )
  ,plumber = require( 'gulp-plumber' )
  ,diff    = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).js_eslint
;
const
  options = config.options
;

module.exports = js_eslint;

/*
 * 1 src → dist なし、なので diff build はGulp.lastRun と併用する。
 */
function js_eslint() {
  return src( config.src, { since : lastRun( js_eslint ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .pipe( eslint.failAfterError() )
  ;
}
