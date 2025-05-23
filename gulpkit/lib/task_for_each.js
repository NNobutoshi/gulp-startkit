import path from 'node:path';

import through     from 'through2';
import mergeStream from 'merge-stream';

export { assignTaskForEachGroup as default };

/**
 * @module lib/task_for_each
 * @description 任意に指定されたグループ名に従ってソースファイルを小分けし、そのグループ毎にcallback （Gulp タスク）を実行させるユーティリティ。
 */
/**
 * 指定のグループに従ってsource を小分けにする 。
 * @param {String} group - 任意のグループ名( 部分的ディレクトリ名)、例：'/fonts/icons/'
 * @param {String} base - ソースファイルのベースディレクトリ
 * @param {Function} branchTask - グループごと実行させるcallback
 */
function assignTaskForEachGroup( group, base, branchTask ) {
  const groupedSources = new Map();
  return _groupSrc( groupedSources, group, base, branchTask );
}

/**
 * 指定のグループに従ってsource を小分けにする 。
 * 実際に指定のグループ名に則してディレクトリが構成されていることが大前提。
 * @param {Map} groupedSources - グループごとに分けられたソースの格納用
 * @param {String} group - 任意のグループ名( 部分的ディレクトリ名)、例：'/fonts/icons/'
 * @param {String} base - ソースファイルのベースディレクトリ
 * @param {Function} branchTask - グループごと実行させるcallback
 * @returns {Stream} - 処理されたストリーム
 */
function _groupSrc( groupedSources, group, base, branchTask ) {
  group = group.replace( /\//g, path.sep );

  return through.obj( _transform, _flush );

  /**
   * file のパスを任意のグループ名で区切り、前者の方を親に、
   * 後者の方を子として親ディレクトリ毎にグループ分けする。
   * @param {Object} file - Vinyl オブジェクト
   * @param {String} enc - エンコードの種類
   * @param {Function} callback - 実行して処理の完了を伝える
   */
  function _transform( file, enc, callback ) {
    const
      splits  = file.path.split( group )
      ,parent = splits[ 0 ] + group
      ,child  = splits[ 1 ]
    ;
    if ( groupedSources.has( parent ) === false ) {
      groupedSources.set( parent, {
        children : [],
        baseDir  : splits[ 0 ].replace( path.resolve( process.cwd(), base ), '' ),
      } );
    }
    groupedSources.get( parent ).children.push( child );
    callback( null, file );
  }

  /**
   * callback は後の _forEach に渡し、全部の branchTask を実行後まで保留。
   * @param {Function} callback
   */
  function _flush( callback ) {
    _forEach.bind( this )( groupedSources, branchTask, callback );
  }

}

/**
 * コールバックのbranchTask には、グループ毎に必要な、
 * Gulp.src 用の新しいsource（配列） とdest 用のパス、
 * 更には基のstream を渡す。
 * @param {Map} groupedSources - 任意のディレクトリ毎に分たソースの格納用
 * @param {Function} branchTask - Callback で実行するGulp タスク
 * @param {Function} callback - through2 で処理終了を伝えるコールバック
 * @returns {Promise<void>}
 */
async function _forEach( groupedSources, branchTask, callback ) {
  const
    trunkStream = this
    ,branchStreams = []
  ;
  for ( let [ key ] of groupedSources ) {
    branchStreams.push(
      await branchTask(
        groupedSources.get( key ).children.map( ( item ) => key + item ),
        groupedSources.get( key ).baseDir.replace( /\\/g, '/' ),
        trunkStream,
      )
    );
  }
  // _groupSrc から渡された基のstream のcallback をここで実行。
  if ( branchStreams.length > 0 ) {
    mergeStream( ...branchStreams ).on( 'finish', callback );
  } else {
    callback();
  }

}
