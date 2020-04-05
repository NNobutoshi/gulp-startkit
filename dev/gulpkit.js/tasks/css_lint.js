const
  { src }       = require( 'gulp' )
  ,plumber   = require( 'gulp-plumber' )
  ,stylelint = require( 'gulp-stylelint' )

  ,taskName = 'css_lint'

  ,config = require( '../config.js' ).config[ taskName ]
  ,watch = require( './watch.js' )

  ,options = config.options
;

function css_lint() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( stylelint( options.stylelint ) )
  ;
}

watch( config, css_lint );
module.exports = css_lint;
