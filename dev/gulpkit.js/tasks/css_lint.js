const
  { src }    = require( 'gulp' )
  ,plumber   = require( 'gulp-plumber' )
  ,stylelint = require( 'gulp-stylelint' )
;
const
  config = require( '../config.js' ).css_lint
  ,watch = require( './watch.js' )
;
const
  options = config.options
;

function css_lint() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( stylelint( options.stylelint ) )
  ;
}

watch( config, css_lint );
module.exports = css_lint;
