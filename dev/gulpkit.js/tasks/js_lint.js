const
  { src, lastRun }  = require( 'gulp' )
  ,eslint  = require( 'gulp-eslint' )
  ,plumber = require( 'gulp-plumber' )

  ,taskName = 'js_lint'

  ,config = require( '../config.js' ).config[ taskName ]
  ,watch = require( './watch.js' )

  ,options = config.options
;

function js_lint() {
  return src( config.src, { since: lastRun( js_lint ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( eslint( options.eslint ) )
    .pipe( eslint.format() )
    .pipe( eslint.failAfterError() )
  ;
}

watch( config, js_lint );
module.exports = js_lint;
