const
  { src, dest, lastRun } = require( 'gulp' )
  ,plumber     = require( 'gulp-plumber' )
  ,postcss     = require( 'gulp-postcss' )
  ,sass        = require( 'gulp-sass' )
  ,cssMqpacker = require( 'css-mqpacker' )
  ,grapher     = require( 'sass-graph' )
  ,through     = require( 'through2' )
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
    .pipe( _diff_build() )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( dest( config.dist, destOptions ) )
  ;
}

function _diff_build() {
  const
    allFiles = {}
    ,destFiles = {}
    ,targets = []
    ,since = lastRun( css_sass ) || process.lastRunTime
  ;
  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    if ( !since || ( since && file.stat && file.stat.mtime >= since ) ) {
      targets.push( file.path );
    }
    allFiles[ file.path ] = file;
    callBack();
  }
  function _flush( callBack ) {
    const self = this;
    targets.forEach( ( filePath ) => {
      destFiles[ filePath ] = 1;
      graph.visitAncestors( filePath, function( item ) {
        if ( !Object.keys( destFiles ).includes( item ) ) {
          destFiles[ item ] = 1;
        }
      } );
    } );
    Object.keys( destFiles ).forEach( ( item ) => {
      self.push( allFiles[ item ] );
    } );
    callBack();
  }
}
