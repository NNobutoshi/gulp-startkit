const
  { src, lastRun } = require( 'gulp' )
  ,plumber   = require( 'gulp-plumber' )
  ,stylelint = require( 'gulp-stylelint' )
  ,diff      = require( 'gulp-diff-build' )
;
const
  config = require( '../config.js' ).css_lint
;
const
  options = config.options
;

module.exports = css_lint;

function css_lint() {
  const srcOptions = {
    since : lastRun( css_lint ) || process.lastRunTime
  };
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( stylelint( options.stylelint ) )
  ;
}
