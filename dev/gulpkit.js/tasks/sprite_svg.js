const
  { src, dest } = require( 'gulp' )
  ,svgSprite = require( 'gulp-svg-sprite' )
  ,plumber   = require( 'gulp-plumber' )
  ,gulpIf    = require( 'gulp-if' )
  ,diff      = require( 'gulp-diff-build' )
;
const
  config = require( '../config.js' ).sprite_svg
;
const
  options = config.options
;

module.exports = sprite_svg;

function sprite_svg() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( { hash : 'sprite_svg' } ) )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( gulpIf( /\.svg$/, dest( config.dist ) ) )
    .pipe( gulpIf( /\.css$/, dest( config.dist ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.base ) ) )
    .pipe( gulpIf( /\.html$/, dest( config.dist ) ) )
  ;
}
