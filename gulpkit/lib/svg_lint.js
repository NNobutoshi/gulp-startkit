import SVGLint from 'svglint';
import through from 'through2';

/*
 * svg をsrc にするタスク用。
 * エラーが拾いにくいため。
 */
export default function svg_lint() {

  return through.obj( _transform );

  async function _transform( file, enc, callBack ) {
    const
      contents = String( file.contents )
      ,linting = await SVGLint.lintSource( contents, { debug: true, config: {} } )
    ;
    linting.on( 'done', () => {
      if ( linting.state === 'error' || linting.valid === false ) {
        return callBack( new Error( `Linting failed (${ linting.state })\n${ file.path }` ) );
      }
      callBack( null, file );
    } );
    linting.lint();
  }
}
