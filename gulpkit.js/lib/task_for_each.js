const
  path        = require( 'path' )
;
const
  through      = require( 'through2' )
  ,mergeStream = require( 'merge-stream' )
;

module.exports = taskForEach;

function taskForEach( group, base, branchTask ) {
  const srcCollection = {};
  return _groupSrc( srcCollection, group, base, branchTask );
}

function _groupSrc( srcCollection, group, base, branchTask ) {

  group = group.replace( /[/\\]/g, path.sep );

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    const
      splits  = file.path.split( group )
      ,parent = splits[ 0 ] + group
      ,child  = splits[ 1 ]
    ;
    if ( !srcCollection[ parent ] ) {
      srcCollection[ parent ] = {
        children : [],
        baseDir  : splits[ 0 ].replace( path.resolve( process.cwd(), base ), '' ),
      };
    }
    srcCollection[ parent ].children.push( child );
    callBack( null, file );
  }

  function _flush( callBack ) {
    _forEach( srcCollection, branchTask, callBack );
  }

}

function _forEach( srcCollection, branchTask, callBack ) {
  const streams = [];
  for ( let key in srcCollection ) {
    streams.push(
      branchTask(
        srcCollection[ key ].children.map( ( item ) => key + item ),
        srcCollection[ key ].baseDir.replace( /[/\\]/g, '/' ),
      )
    );
  }
  if ( streams.length > 0 ) {
    mergeStream( ...streams ).on( 'finish', callBack );
  } else {
    callBack();
  }

}
