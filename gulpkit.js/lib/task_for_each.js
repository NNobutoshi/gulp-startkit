
const
  through      = require( 'through2' )
  ,mergeStream = require( 'merge-stream' )
;

module.exports = taskForEach;

function taskForEach( srcCollection, branchTask ) {

  const streams = [];

  return through.obj( {}, null, _flush );

  function _flush( callBack ) {
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
}
