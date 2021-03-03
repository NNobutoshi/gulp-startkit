const
  SVGLint = require( 'svglint' )
  ,through = require( 'through2' )
;

module.exports = svg_lint;

function svg_lint() {
  return through.obj( _transform, _flush );
  function _transform( file, enc, callBack ) {
    const
      that = this
      ,contents = String( file.contents )
      ,linting = SVGLint.lintSource( contents, { debug: true, config: {} } )
    ;
    linting.on( 'done', () => {
      if ( linting.state === linting.STATES.success ) {
        callBack( null, file );
      } else {
        that.emit( 'error', new Error( `Linting failed (${linting.state})\n${file.path}` ) );
        callBack();
      }
    } );
  }
  function _flush( callBack ) {
    callBack();
  }
}
