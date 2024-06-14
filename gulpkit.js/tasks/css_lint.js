import { src }   from 'gulp';
import through   from 'through2';
import plumber   from 'gulp-plumber';
import stylelint from 'stylelint';

import { diff_1on1 } from '../lib/diff_build.js';
import configFile    from '../config.js';

const
  config = configFile.css_lint
  ,options = config.options
;

export default function css_lint() {
  return diff_1on1( src, config.src, mainTask, options.diff );
}

function mainTask( fixedSrc, resolve ) {
  const targetFiles = [];
  return src( fixedSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( through.obj(
      function( file, enc, callBack ) {
        targetFiles.push( file.path );
        callBack( null, file );
      }
    ) )
    .on( 'finish', function() {
      stylelint.lint( {
        files: targetFiles,
        formatter: 'string',
      } )
        .then( ( { report, errored } ) =>  {
          if ( report ) {
            console.log( report );
          }
          resolve();
        } )
        .catch( error =>  {
          if ( targetFiles.length > 0 ) {
            this.emit( 'error', error );
          }
        } );
    } )
  ;
}

