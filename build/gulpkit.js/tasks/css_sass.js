const
  { src, dest, lastRun, series } = require( 'gulp' )
  ,plumber     = require( 'gulp-plumber' )
  ,postcss     = require( 'gulp-postcss' )
  ,sass        = require( 'gulp-sass' )
  ,cssMqpacker = require( 'css-mqpacker' )
  ,grapher     = require( 'sass-graph' )
  ,through     = require( 'through2' )
  ,path        = require( 'path' )
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

module.exports = css_sass();

function css_sass() {
  let
    newSrc
  ;
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }

  return series( css_sass_diff, css_sass_build );

  function css_sass_diff() {
    const
      srcOptions = {
        since : lastRun( css_sass_diff ) || process.lastRunTime
      }
    ;
    return src( config.src, srcOptions )
      .pipe( _diff() )
    ;
  }

  function css_sass_build( cb ) {
    if ( !newSrc.length ) {
      return cb();
    }
    const
      srcOptions = { cwd : config.base, sourcemaps : config.sourcemap }
      ,destOptions = { sourcemaps : config.sourcemap_dir }
    ;
    return src( newSrc, srcOptions )
      .pipe( plumber( options.plumber ) )
      .pipe( sass( options.sass ) )
      .pipe( postcss( options.postcss.plugins ) )
      .pipe( dest( config.dist, destOptions ) )
    ;
  }

  function _diff() {
    const deps = {};

    return through.obj( _transform, _flush );

    function _transform( file, encoding, callback ) {
      deps[ file.path ] = 1;
      graph.visitAncestors( file.path, function( item ) {
        if ( !Object.keys( deps ).includes( item ) ) {
          deps[ item ] = 1;
        }
      } );
      callback();
    }

    function _flush( callback ) {
      newSrc = Object.keys( deps ).map( ( item ) => {
        return path.relative( path.join( process.cwd(), config.base ), item );
      } );
      callback();
    }

  }
}
