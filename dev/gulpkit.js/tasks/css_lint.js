const
  { src }    = require( 'gulp' )
  ,plumber   = require( 'gulp-plumber' )
  ,stylelint = require( 'gulp-stylelint' )
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
    .pipe( stylelint( options.stylelint ) )
  ;
}
