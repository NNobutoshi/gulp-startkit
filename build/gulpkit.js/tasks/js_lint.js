const
  { src, lastRun }  = require( 'gulp' )
  ,eslint  = require( 'gulp-eslint' )
  ,plumber = require( 'gulp-plumber' )
;
const
  config = require( '../config.js' ).js_lint
;
const
  options = config.options
;

module.exports = js_lint;

function js_lint() {
  const srcOptions = {
    since : lastRun( js_lint ) || process.lastRunTime
  };
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .pipe( eslint.failAfterError() )
  ;
}