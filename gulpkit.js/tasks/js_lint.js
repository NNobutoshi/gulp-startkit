const
  { src }  = require( 'gulp' )
  ,eslint  = require( 'gulp-eslint' )
  ,plumber = require( 'gulp-plumber' )
  ,gulpIf  = require( 'gulp-if' )
  ,diff    = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).js_lint
;
const
  options = config.options
;

module.exports = js_lint;

function js_lint() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( gulpIf( options.diff, diff( options.diff ) ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .pipe( eslint.failAfterError() )
  ;
}
