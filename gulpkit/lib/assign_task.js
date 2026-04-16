/**
 * 任意に指定されたグループ名に従ってソースファイルを小分けし、そのグループごとにcallback （Gulp タスク）を実行させる。
 * @module lib/assign_task
 * @requires node:process
 * @requires node:path
 * @requires through2
 * @requires merge-stream
 */

import { cwd } from 'node:process';
import path    from 'node:path';

import through     from 'through2';
import mergeStream from 'merge-stream';

export { assignTaskForGroup as default };

const
  CWD = cwd()
;

/**
 * 指定のグループ名（部分なサブディレクトリ名）に従ってグループ分けにしたsource をコールバックに引数として渡す。<br>
 * 設定（config）で指定されたグループ名に則してディレクトリが構成されていることが大前提。<br>
 * default としてエクスポート。
 * @param {string} groupSubdirName - 任意のグループ名(部分的なディレクトリ名)、例：'fonts/icons'
 * @param {string} base - ソースファイルのベースディレクトリ
 * @param {function} branchTask - グループごと実行させるcallback
 * @returns {Stream} - 処理されたストリーム
 */
function assignTaskForGroup( groupSubdirName, base, branchTask ) {
  const
    groupedSources = new Map()
  ;
  groupSubdirName = groupSubdirName.replace( /\//g, path.sep );
  return through.obj(
    function _transform( file, enc, callback ) {
      _setChildSourceToParentMap( file, groupedSources, groupSubdirName, base );
      callback( null, file );
    },
    function _flush( callback ) {
      _runTaskForEachGroup.bind( this )( groupedSources, branchTask, callback );
    },
  );
}

/**
 * file のパスを任意のグループ名で区切り、前者の方を親に、後者の方を子として親ディレクトリごとにグループ分けする。
 * @private
 * @param {object} file - Vinyl オブジェクト
 * @param {Map} groupedSources - グループごとに分けられたソースの格納用
 * @param {string} groupSubdirName - 任意のグループ名（部分的なディレクトリ名）、例：'fonts/icons'
 * @param {string} base - ソースファイルのベースディレクトリ
 */
function _setChildSourceToParentMap( file, groupedSources, groupSubdirName, base ) {
  const
    splits = file.path.split( groupSubdirName )
  ;
  const
    parent = splits[ 0 ] + groupSubdirName,
    child  = splits[ 1 ]
  ;
  if ( groupedSources.has( parent ) === false ) {
    groupedSources.set( parent, {
      children : [],
      baseDir  : splits[ 0 ].replace( path.resolve( CWD, base ), '' ),
    } );
  }
  groupedSources.get( parent ).children.push( child );
}

/**
 * branchTask には、グループごとに必要な Gulp.src 用の新しいsource（配列） とdest 用のパス、更には基のstream を渡す。
 * @prive
 * @param {Map} groupedSources - 任意のディレクトリごとに分たソースの格納用
 * @param {function} branchTask - コールバックで実行するGulp タスク
 * @param {function} callback - through2 で処理終了を伝えるコールバック
 * @returns {Promise<void>}
 */
async function _runTaskForEachGroup( groupedSources, branchTask, callback ) {
  try {
    const
      trunkStream   = this,
      branchStreams = []
   ;
    for ( const [ parentPath ,groupData ] of groupedSources ) {
      branchStreams.push(
        await branchTask(
          groupData.children.map( ( childPath ) => parentPath + childPath ),
          groupData.baseDir.replace( /\\/g, '/' ).replace( /\/$/, '' ),
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
  } catch ( err ) {
    callback( err );
  }

}
