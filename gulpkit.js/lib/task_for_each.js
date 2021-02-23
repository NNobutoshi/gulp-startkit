module.exports = taskForEach;

async function taskForEach( mainTask, branchTask, cb ) {
  const
    srcCollection = await mainTask()
    ,asyncArray = []
  ;
  for ( let key in srcCollection ) {
    asyncArray.push(
      branchTask(
        srcCollection[ key ].children.map( ( item ) => key + item ),
        srcCollection[ key ].baseDir.replace( /[/\\]/g, '/' ),
      )
    );
  }
  return Promise.all( asyncArray ).then( () => {
    if ( typeof cb === 'function' ) {
      cb();
    }
    return;
  } );
}
