import fs from 'fs';
import path from 'path';

import plumber from 'gulp-plumber';
import gs from 'glob-stream';
import chalk from 'chalk';

import diff from '../lib/diff_build.js';
import configFile from '../config.js';

const
  config = configFile.copy_to
;
const
  options = config.options
;

export default function copy_to() {
  return gs( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .on( 'data', file => {
      const
        baseDir = path.resolve( process.cwd(), config.base )
        ,distDir = path.resolve( process.cwd(), config.dist )
        ,distPath = path.join( distDir, path.relative( baseDir, file.path ) )
      ;
      fs.copyFile( file.path, distPath, ( error ) => {
        if ( error ) {
          this.emit( 'error', error );
          console.log( chalk.hex( '#FF0000' )( file.path ) );
        }
      } );
    } )
  ;
}
