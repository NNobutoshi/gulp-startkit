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

/*
 * cache 機能や差分ビルド機能は、Webpack の備えているものを。
 * watch はGulpのものを使用。
 * entry や splitChunks は、Gulp.src() 後,chumk が通ってくる毎、作成し。
 * 既存の webpackConfigと 比較し差異があれば再代入する。
 */

/*
 * WebpackConfig。既存の設定を上書きしないようにマージ
 */
if ( webpackConfig.optimization ) {
  webpackConfig.optimization = mergeWith( {}, webpackConfig.optimization, groups );
}

/*
 * config.js 側で'filesystem' の指定があれば、cacheDirectory はここで指定。
 * 'memory' が指定されているとcacheDirectory をそのままにしておけないため。
 */
if ( webpackConfig.cache && webpackConfig.cache.type === 'filesystem' ) {
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
    regexTarget = config.targetEntry // /\.entry\.js$/
    ,regexShareFileConf = config.shareFileConf // /\.split\.json$/
  ;

  /*
   * pipe のたび初期化。
   */
  entries = {};
  groups = {};

  return through.obj( _transform, _flush );

  /*
   * chunkのpath やconfig.js の設定からentry や splitChunks を作る。
   */
  function _transform( file, enc, callBack ) {
    let key, val;

    /*
     * chunk のPath が、splitChunks用のJSON Data であれば、
     * chunk のコンテンツを webpackConfig で使用可能なデータの形にする。
     */
    if ( regexShareFileConf && regexShareFileConf.test( file.path ) ) {
      _createSplitChunks( file.contents );
    }

    /*
     * entry であれば、WebpackConfig で有効な形にする。
     */
    if ( regexTarget.test( file.path ) ) {
      key = path.relative( config.base, file.path ).replace( regexTarget, '' ).replace( /\\/g, '/' );
      val = path.relative( process.cwd(), file.path ).replace( /\\/g , '/' );
      val =  /^\.?\.\//.test( val ) ? val : './' + val;
      entries[ key ] = val;
    }
    callBack( null, file );
  }

  /*
   * compiler がまだ無いか、
   * 新たに作ったentreis や splitChunks が直近のWebpackConfig と内容に相違があれば、
   * compoler を用意する。
   */
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

/*
 * 主にvendorのscript など、ディレクトリで共通で使用するモジュールなどは、
 * そのディレクトリ毎で設定が行えるようにする。
 * そのためのJSON data をwebpackConfig で使用可能な状態にする
 */
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
