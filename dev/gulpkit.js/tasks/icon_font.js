const
  { src, dest } = require( 'gulp' )
  ,iconfont    = require( 'gulp-iconfont' )
  ,iconfontCss = require( 'gulp-iconfont-css' )
  ,plumber     = require( 'gulp-plumber' )
  ,fs          = require( 'fs' )
;
const
  config = require( '../config.js' ).icon_font
;
const
  options = config.options
;

function icon_font( done ) {
  let
    srcOptions = {}
  ;
  if ( config.tmspFile ) {
    if ( !fs.existsSync( config.tmspFile ) ) {
      return done();
    }
    srcOptions.since = Number( fs.readFileSync( config.tmspFile, 'utf-8' ) );
  }
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( iconfontCss( options.iconfontCss ) )
    .pipe( iconfont( options.iconfont ) )
    .pipe( dest( config.fontsDist ) )
    .on( 'finish', function() {
      src( config.fontsCopyFrom, srcOptions )
        .pipe( dest( config.fontsCopyTo ) )
      ;
    } )
  ;
}

module.exports = icon_font;
