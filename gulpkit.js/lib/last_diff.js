const
  fs      = require( 'fs' )
  ,path   = require( 'path' )
  ,mkdirp = require( 'mkdirp' )
  ,del    = require( 'del' )
;
const
  FILEPATH  = path.resolve( __dirname, '../.last_diff_log/.diffmap' )
  ,DIRNAME  = path.dirname( FILEPATH )
  ,DATANAME = 'myProjectTasksLastDiff'
;
let
  envData = process.env[ DATANAME ]
;

module.exports.default = {
  get : _get,
  set : _set,
};
module.exports.get   = _get;
module.exports.set   = _set;
module.exports.write = _write;
module.exports.reset = _reset;

/*
 * 環境変数に格納されている差分ファイルリストを優先して取得。
 */
function _get() {
  if ( envData ) {
    return envData;
  } else if ( fs.existsSync( FILEPATH ) ) {
    return JSON.parse( fs.readFileSync( FILEPATH, 'utf-8' ) );
  }
  return {};
}

/*
 * 環境変数に格納する。
 */
function _set( map ) {
  envData = map;
}

/*
 * ファイルに書き鋳込み保存。
 */
function _write() {
  if ( !envData ) {
    return false;
  }
  if ( !fs.existsSync( DIRNAME ) ) {
    mkdirp.sync( DIRNAME );
  }
  fs.writeFileSync( FILEPATH, JSON.stringify( envData ), 'utf-8', ( error ) => {
    if ( error ) {
      throw error;
    }
  } );
}

/*
 * 保存のディレクトリごと削除。
 */
function _reset() {
  del( DIRNAME );
}
