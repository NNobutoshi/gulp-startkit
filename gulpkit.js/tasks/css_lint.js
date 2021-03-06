const
  { src, lastRun } = require( 'gulp' )
  ,plumber   = require( 'gulp-plumber' )
  ,stylelint = require( 'gulp-stylelint' )
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
  return src( config.src, { since : lastRun( css_lint ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( stylelint( options.stylelint ) )
  ;
}
