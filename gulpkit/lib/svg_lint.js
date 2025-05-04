import SVGLint from 'svglint';
import through from 'through2';

const
  defaultSettings = {
    debug : true,
    config : {},
  }
;

/**
 * svg をsrc にするタスク用。
 * エラーが拾いにくいため。
 * @returns {Object} - Gulp stream
 */
export default function svg_lint( options ) {
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
