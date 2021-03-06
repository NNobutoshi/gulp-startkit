const
  path = require( 'path' )
;
const
  { src }  = require( 'gulp' )
  ,plumber = require( 'gulp-plumber' )
  ,webpack = require( 'webpack' )
  ,log     = require( 'fancy-log' )
  ,through = require( 'through2' )
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
  ,groups = {
    splitChunks : {
      cacheGroups : {}
    }
  }
;

if ( webpackConfig.optimization ) {
  webpackConfig.optimization = mergeWith( {}, webpackConfig.optimization, groups  );
}

if ( webpackConfig.cache &&  webpackConfig.cache.type === 'filesystem' ) {
  webpackConfig.cache.cacheDirectory = config.cacheDirectory;
}

module.exports = js_webpack;

function js_webpack() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( _createEntries() )
    .pipe( _compile() )
  ;
}

function _createEntries() {
  let
    regexTarget = config.targetEntry
    ,regexShareFileConf = config.shareFileConf
  ;

  entries = {};
  groups = {};

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
    if ( compiler === null ||
      !isEqual( webpackConfig.entry, entries ) ||
      !isEqual( webpackConfig.optimization, groups )
    ) {
      webpackConfig.entry = entries;
      webpackConfig.output.filename = '[name].js';
      webpackConfig.output.path = path.resolve( process.cwd(), config.dist );
      webpackConfig.optimization = groups;
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
    this.resume();
    compiler.run( _webPackCall( callBack, this ) );
  }
}

function _webPackCall( callBack, stream ) {
  return ( error, stats ) => {
    let errorMessages = [];
    if ( stats.hasErrors && stats.hasErrors() ) {
      stats.toJson().errors.forEach( ( item ) => {
        errorMessages.push( item.message );
      } );
      stream.emit( 'error', new Error( errorMessages.join( '\n' ) ) );
    }
    if ( error ) {
      stream.emit( 'error', error );
    }
    if ( stats ) {
      log( stats.toString( {
        colors : true,
        chunks : false,
        assets : false,
        hash   : true,
        errors : false,
      } ) );
    }
    callBack();
  };
}

function _createSplitChunks( subConfContents ) {
  const
    subConfObj = JSON.parse( subConfContents )
    ,cacheGroups = subConfObj.splitChunks.cacheGroups
  ;
  for ( let o in cacheGroups ) {
    cacheGroups[ o ].test = new RegExp( cacheGroups[ o ].test.join( '|' ) );
  }
  groups = mergeWith( {}, groups, subConfObj );
}
