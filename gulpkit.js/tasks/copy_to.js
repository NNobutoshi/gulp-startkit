const
  { src, dest, lastRun } = require( 'gulp' )
  ,plumber = require( 'gulp-plumber' )
  ,diff    = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).copy_to
;
const
  options = config.options
;

module.exports = copy_to;

/*
 * diff build はGulp.lastRun と併用する。
 */
function copy_to() {
  return src( config.src, { since : lastRun( copy_to ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( dest( config.dist ) )
  ;
}
