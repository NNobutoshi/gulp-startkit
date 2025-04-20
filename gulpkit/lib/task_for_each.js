import { resolve, sep } from 'node:path';

import through     from 'through2';
import mergeStream from 'merge-stream';

export default function taskForEach( group, base, branchTask ) {
  const groupedSources = new Map();
  return _groupSrc( groupedSources, group, base, branchTask );
}

/**
 * 指定のグループに従ってsource を小分けする。
 * @param {Map} groupedSources
 * @param {string} group
 * @param {string} base
 * @param {function} branchTask
 * @returns {stream}
 */
function _groupSrc( groupedSources, group, base, branchTask ) {

  group = group.replace( /[/\\]/g, sep );

  return through.obj( _transform, _flush );

  function _transform( file, enc, callback ) {
    const
      splits  = file.path.split( group )
      ,parent = splits[ 0 ] + group
      ,child  = splits[ 1 ]
    ;
    if ( groupedSources.has( parent ) === false ) {
      groupedSources.set( parent, {
        children : [],
        baseDir  : splits[ 0 ].replace( resolve( process.cwd(), base ), '' ),
      } );
    }
    groupedSources.get( parent ).children.push( child );
    callback( null, file );
  }

  /*
   * callback は後の _forEach に渡し、全部の branchTask を実行後まで保留。
   * @param {function} callback
   */
  function _flush( callback ) {
    _forEach.bind( this )( groupedSources, branchTask, callback );
  }

}

/**
 * branchTask は、小分けしたグループ毎、Gulp.src 用の新しいsourceとdest 用のパスを渡し、
 * Gulp のストリームを受け取る。
 * @param {Map} groupedSources
 * @param {function} branchTask
 * @param {function} callback
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
        groupedSources.get( key ).baseDir.replace( /[/\\]/g, '/' ),
        trunkStream,
      )
    );
  }

  /*
   * _groupSrc から渡された基のstream のcallback をここで実行。
   */
  if ( branchStreams.length > 0 ) {
    mergeStream( ...branchStreams ).on( 'finish', callback );
  } else {
    callback();
  }

}
