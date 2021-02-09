const
  { src, dest } = require( 'gulp' )
  ,plumber      = require( 'gulp-plumber' )
  ,sass         = require( 'gulp-sass' )
  ,grapher      = require( 'sass-graph' )
  ,postcss      = require( 'gulp-postcss' )
  ,cssMqpacker  = require( 'css-mqpacker' )
  ,through      = require( 'through2' )
  ,log          = require( 'fancy-log' )
  ,diff         = require( '../lib/diff_build.js' )
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
    srcOptions   = { sourcemaps : config.sourcemap }
    ,destOptions = { sourcemaps : config.sourcemap_dir }
  ;
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( diff(
      options.diff
      ,null
      ,_filter
    ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( _log() )
    .pipe( dest( config.dist, destOptions ) )
  ;
}

function _log() {
  const rendered = {
    files : []
  };
  return through.obj( ( file, enc, callBack ) => {
    rendered.files.push( file.path );
    callBack();
  }, ( callBack ) => {
    log( `${options.diff.hash}: rendered ${rendered.files.length } files` );
    callBack();
  } );
}

function _filter( filePath, _collection, destFiles ) {
  graph.visitAncestors( filePath, function( item ) {
    if ( !Object.keys( destFiles ).includes( item ) ) {
      destFiles[ item ] = 1;
    }
  } );
}
