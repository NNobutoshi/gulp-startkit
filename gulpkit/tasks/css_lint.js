const
  { src }    = require( 'gulp' )
  ,plumber   = require( 'gulp-plumber' )
  ,stylelint = require( 'gulp-stylelint' )
  ,gulpIf    = require( 'gulp-if' )
  ,diff      = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).css_lint
;
const
  options = config.options
;

module.exports = css_lint;

function css_lint() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( gulpIf( options.diff, diff( options.diff ) ) )
    .pipe( stylelint( options.stylelint ) )
  ;
}
