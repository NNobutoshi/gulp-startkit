const
  { src }       = require( 'gulp' )
  ,webpack      = require( 'webpack' )
  ,path         = require( 'path' )
  ,log          = require( 'fancy-log' )
  ,through      = require( 'through2' )
  ,{ isEqual, mergeWith } = require( 'lodash' )
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
  let
    regexTarget = config.targetEntry
    ,regexShareFileConf = config.shareFileConf
  ;
  entries = {};

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    let key, val;
    if ( regexShareFileConf && regexShareFileConf.test( file.path ) ) {
      _createSplitChunks( file.contents );
    }
    if ( regexTarget.test( file.path ) ) {
      key = path.relative( config.base, file.path ).replace( regexTarget, '' ).replace( /\\/g, '/' );
      val = path.relative( process.cwd(), file.path ).replace( /\\/g , '/' );
      val =  /^\.?\.\//.test( val ) ? val : './' + val;
      entries[ key ] = val;
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
    subConfObj = JSON.parse( subConfContents )
    ,cacheGroups = subConfObj.optimization.splitChunks.cacheGroups
  ;
  for ( let o in cacheGroups ) {
    cacheGroups[ o ].test = new RegExp( cacheGroups[ o ].test.join( '|' ) );
  }
  if ( webpackConfig.optimization ) {
    webpackConfig.optimization = mergeWith(
      {}, webpackConfig.optimization, subConfObj.optimization
    );
  } else {
    webpackConfig.optimization = subConfObj.optimization;
  }
}
