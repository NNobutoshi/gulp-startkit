const
  { src, dest, lastRun } = require( 'gulp' )
  ,plumber     = require( 'gulp-plumber' )
  ,postcss     = require( 'gulp-postcss' )
  ,sass        = require( 'gulp-sass' )
  ,cssMqpacker = require( 'css-mqpacker' )
  ,grapher     = require( 'sass-graph' )
  ,diffBuild   = require( '../diff_build.js' )
;
const
  config = require( '../config.js' ).css_sass
;
const
  options = config.options
;
const
  graph = grapher.parseDir( config.base )
;

module.exports = css_sass;

function css_sass() {
  const
    srcOptions = { sourcemaps : config.sourcemap }
    ,destOptions = { sourcemaps : config.sourcemap_dir }
  ;
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( diffBuild(
      { since : lastRun( css_sass ) || process.lastRunTime }
      ,false
      ,_filter
    ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( dest( config.dist, destOptions ) )
  ;
}

function _filter( filePath, _deps, destFiles ) {
  graph.visitAncestors( filePath, function( item ) {
    if ( !Object.keys( destFiles ).includes( item ) ) {
      destFiles[ item ] = 1;
    }
  } );
}
