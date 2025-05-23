import SVGLint from 'svglint';
import through from 'through2';

export { lint_svg as default };

const
  defaultSettings = {
    debug : true,
    config : {},
  }
;

/**
 * @module lib/lint_svg
 * @requires svglint
 * @requires through2
 */
/**
 * svg をsrc にするタスク用。<br>
 * 各プラグインでエラーが拾いにくいため。<br>
 * default としてエクスポート。
 * @returns {Stream} - 処理されたストリーム
 */
function lint_svg( options ) {
  const settings = { ...defaultSettings, ...options };
  return through.obj(
    async function _transform( file, enc, callback ) {
      try {
        const
          contents = String( file.contents )
          ,linting = await SVGLint.lintSource( contents, settings )
        ;
        linting.on( 'done', () => {
          if ( linting.state === 'error' || linting.valid === false ) {
            return callback( new Error( `Linting failed (${ linting.state })\n${ file.path }` ) );
          }
          callback( null, file );
        } );
        linting.lint();
      } catch ( err ) {
        callback( err );
      }
    }
  );
}
