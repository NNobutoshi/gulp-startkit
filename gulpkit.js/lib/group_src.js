const
  through = require( 'through2' )
  ,path    = require( 'path' )
;

module.exports = groupSrc;

function groupSrc( srcCollection, group, base ) {

  group = group.replace( /[/\\]/g, path.sep );

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    const
      splits = file.path.split( group )
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
    callBack();
  }

}
