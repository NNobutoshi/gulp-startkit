const
  { src }    = require( 'gulp' )
  ,through    = require( 'through2' )
  ,path      = require( 'path' )
  ,gulpIf    = require( 'gulp-if' )
;

module.exports = taskForEach;

async function taskForEach( settings, branchTask, cb ) {
  const
    mainSrc = settings.mainSrc
    ,point  = settings.point
    ,diff   = settings.diff
    ,base   = settings.base
  ;
  const
    srcCollection = await _createSrcCollection( mainSrc, point, diff, base )
    ,asyncArray = []
  ;
  for ( let key in srcCollection ) {
    asyncArray.push(
      branchTask(
        srcCollection[ key ].children.map( ( item ) => key + item )
        ,srcCollection[ key ].baseDir.replace( /[/\\]/g, '/' )
      )
    );
  }
  Promise.all( asyncArray ).then( () => cb() );
}


function _createSrcCollection( mainSrc, point, diff, base ) {
  const
    srcCollection = {}
  ;
  return new Promise( ( resolve ) => {
    src( mainSrc )
      .pipe( gulpIf( typeof diff === 'function', diff() )  )
      .pipe( _groupSrc( srcCollection, point, base ) )
      .on( 'finish', () => {
        resolve( srcCollection );
      } )
    ;
  } );
}

function _groupSrc( srcCollection, point, base ) {
  point = point.replace( /[/\\]/g, path.sep );

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    const
      splits = file.path.split( point )
      ,parent = splits[ 0 ] + point
      ,child  = splits[ 1 ]
    ;
    if ( !srcCollection[ parent ] ) {
      srcCollection[ parent ] = {
        children : [],
        baseDir : splits[ 0 ].replace( path.resolve( process.cwd(), base ), '' ),
      };
    }
    srcCollection[ parent ].children.push( child );
    callBack( null, file );
  }

  function _flush( callBack ) {
    callBack();
  }

}
