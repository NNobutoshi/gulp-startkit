const
  { src, dest } = require( 'gulp' )
  ,gulpIf       = require( 'gulp-if' )
  ,plumber      = require( 'gulp-plumber' )
  ,postcss      = require( 'gulp-postcss' )
  ,sass         = require( 'gulp-sass' )
  ,sourcemap    = require( 'gulp-sourcemaps' )
  ,cssMqpacker  = require( 'css-mqpacker' )
  ,del          = require( 'del' )
;
const
  config = require( '../config.js' ).css_sass
;
const
  options = config.options
;

function css_sass() {
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( gulpIf(
      config.sourcemap
      ,sourcemap.init( { loadMaps: true } )
    ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf(
      config.sourcemap
      ,sourcemap.write( './' )
    ) )
    .pipe( dest( config.dist ) )
  ;
}

function css_clean( done ) {
  if ( !config.sourcemap ) {
    return del( options.del.dist, options.del.options );
  } else {
    done();
  }
}

module.exports.css_sass = css_sass;
module.exports.css_clean = css_clean;
