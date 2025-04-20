import SVGLint from 'svglint';
import through from 'through2';

/**
 * svg をsrc にするタスク用。
 * エラーが拾いにくいため。
 * @returns {Object} - Gulp stream
 */
export default function svg_lint() {

  return through.obj( _transform );

  async function _transform( file, enc, callback ) {
    const
      contents = String( file.contents )
      ,linting = await SVGLint.lintSource( contents, { debug: true, config: {} } )
    ;
    linting.on( 'done', () => {
      if ( linting.state === 'error' || linting.valid === false ) {
        return callback( new Error( `Linting failed (${ linting.state })\n${ file.path }` ) );
      }
      callback( null, file );
    } );
    linting.lint();
  }
}
