const
  { src, dest } = require( 'gulp' )
  ,gulpIf       = require( 'gulp-if' )
  ,plumber      = require( 'gulp-plumber' )
  ,postcss      = require( 'gulp-postcss' )
  ,sass         = require( 'gulp-sass' )
  ,sourcemap    = require( 'gulp-sourcemaps' )
  ,diff         = require( 'gulp-diff-build' )
  ,cssMqpacker  = require( 'css-mqpacker' )
;
const
  config = require( '../config.js' ).css_sass
;
const
  options = config.options
;

module.exports = css_sass;

function css_sass() {
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( gulpIf(
      options.diff,
      diff( options.diff )
    ) )
    .pipe( gulpIf(
      config.sourcemap,
      sourcemap.init( { loadMaps: true } ),
    ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf(
      config.sourcemap,
      sourcemap.write( config.sourcemap_dir ),
    ) )
    .pipe( dest( config.dist ) )
  ;
}
