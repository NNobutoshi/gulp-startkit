import gulp        from 'gulp';
import dartSass    from 'sass';
import gulpSass    from 'gulp-sass';
import plumber     from 'gulp-plumber';
import postcss     from 'gulp-postcss';
import grapher     from 'sass-graph';
import cssMqpacker from 'css-mqpacker';
import through     from 'through2';
import log         from 'fancy-log';

import diff        from '../lib/diff_build.js';
import configFile  from '../config.js';

const
  { src, dest } = gulp
  ,sass         = gulpSass( dartSass )
;
const
  config = configFile.css_sass
  ,options = config.options
;

const
  graph = grapher.parseDir( config.base )
;

export default function css_sass() {
  const
    srcOptions   = { sourcemaps : config.sourcemap }
    ,destOptions = { sourcemaps : config.sourcemap_dir }
  ;
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff, null, _select ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( _log() )
    .pipe( dest( config.dist, destOptions ) )
  ;
}

function _log() {
  const rendered = {
    files : []
  };
  return through.obj( ( file, enc, callBack ) => {
    rendered.files.push( file.path );
    callBack( null, file );
  }, ( callBack ) => {
    log( `css_sass: rendered ${rendered.files.length } files` );
    callBack();
  } );
}

/*
 * tdiff_build.jsの hrough2 flush の中で、Object で集めた通過候補毎に実行。
 * sass-graph をつかって候補ファイルに依存するものを最終選択する。
 */
function _select( filePath, _collection, destFiles ) {
  graph.visitAncestors( filePath, function( item ) {
    if ( !Object.keys( destFiles ).includes( item ) ) {
      destFiles[ item ] = 1;
    }
  } );
}
