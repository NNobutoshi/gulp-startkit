const
  { src }       = require( 'gulp' )
  ,webpack      = require( 'webpack' )
  ,path         = require( 'path' )
  ,log          = require( 'fancy-log' )
  ,through      = require( 'through2' )
  ,{ isRegExp, isEqual, mergeWith } = require( 'lodash' )
;
const
  config         = require( '../config.js' ).js_webpack
  ,options       = config.options
  ,webpackConfig = config.webpackConfig
;
let
  compiler = null
  ,entries
;

module.exports = js_webpack;

function js_webpack() {
  return src( config.src )
    .pipe( _createEntries() )
    .pipe( _initWebpack() )
    .pipe( _compile() )
  ;
}

function _createEntries() {
  let targetSuffix;

  entries = {};

  if ( config.target && typeof config.target === 'string' ) {
    targetSuffix = new RegExp( config.target.replace( /\./g, '\\.' ) + '$' );
  } else if ( isRegExp( config.target ) ) {
    targetSuffix = config.target;
  }

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    const targetMatch = file.path.match( targetSuffix );
    let key, val;
    if ( targetMatch ) {
      if ( targetMatch[ 0 ] === '.split.json' ) {
        _createSplitChunks( file.contents );
      } else {
        key = path.relative( config.base, file.path ).replace( targetSuffix, '' ).replace( /\\/g, '/' );
        val = path.relative( process.cwd(), file.path ).replace( /\\/g , '/' );
        val =  /^\.?\.\//.test( val ) ? val : './' + val;
        entries[ key ] = val;
      }
    }
    callBack( null, file );
  }

  function _flush( callBack ) {
    callBack();
  }

}

function _initWebpack() {
  return through.obj( _transform, _flush );
  function _transform( file, enc, callBack ) {
    callBack( null, file );
  }
  function _flush( callBack ) {
    if ( compiler === null || !isEqual( webpackConfig.entry, entries ) ) {
      webpackConfig.entry = entries;
      webpackConfig.output.filename = '[name].js';
      webpackConfig.output.path = path.resolve( process.cwd(), config.dist );
      compiler = webpack( webpackConfig );
    }
    callBack();
  }
}

function _compile() {
  return through.obj( _transform, _flush );
  function _transform( file, enc, callBack ) {
    callBack( null, file );
  }
  function _flush( callBack ) {
    compiler.run( _webPackCall( callBack ) );
  }
}

function _webPackCall( callBack ) {
  return ( error, stats ) => {
    let chunks;
    if ( stats.hasErrors && stats.hasErrors() ) {
      log( 'webpack: has error' );
    }
    if ( error ) {
      options.errorHandler( error );
    }
    chunks = stats.compilation.chunks;
    for ( let item of chunks ) {
      if ( item.rendered === true ) {
        log( `webpack:${item.id}` );
      }
    }
    callBack();
  };
}

function _createSplitChunks( subConfContents ) {
  const
    subConfData = JSON.parse( subConfContents )
    ,cacheGroups = subConfData.optimization.splitChunks.cacheGroups
  ;
  for ( let o in cacheGroups ) {
    cacheGroups[ o ].test = new RegExp( cacheGroups[ o ].test.join( '|' ) );
  }
  if ( webpackConfig.optimization ) {
    webpackConfig.optimization = mergeWith(
      {}, webpackConfig.optimization, subConfData.optimization
    );
  } else {
    webpackConfig.optimization = subConfData.optimization;
  }
}
