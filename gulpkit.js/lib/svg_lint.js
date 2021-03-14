const
  svgLint  = require( 'svglint' )
  ,through = require( 'through2' )
;

module.exports = svg_lint;

/*
 * svg をsrc にするタスク用。
 * エラーが拾いにくいため。
 */
function svg_lint() {

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    const
      stream = this
      ,contents = String( file.contents )
      ,linting = svgLint.lintSource( contents, { debug: true, config: {} } )
    ;
    linting.on( 'done', () => {
      if ( linting.state === linting.STATES.success ) {
        callBack( null, file );
      } else {
        stream.emit( 'error', new Error( `Linting failed (${linting.state})\n${file.path}` ) );
        callBack();
      }
    } );
  }

  function _flush( callBack ) {
    callBack();
  }

}
