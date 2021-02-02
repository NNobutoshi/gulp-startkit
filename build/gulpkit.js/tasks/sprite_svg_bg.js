const
  { src, dest, lastRun } = require( 'gulp' )
  ,svgSprite = require( 'gulp-svg-sprite' )
  ,plumber  = require( 'gulp-plumber' )
  ,gulpIf   = require( 'gulp-if' )
;
const
  config = require( '../config.js' ).sprite_svg_bg
;
const
  options = config.options
;

module.exports = sprite_svg_bg;

function sprite_svg_bg() {
  const
    srcOptions = {
      since : lastRun( sprite_svg_bg ) || process.lastRunTime,
    }
  ;
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( gulpIf( /\.svg$/, dest( config.dist ) ) )
    .pipe( gulpIf( /\.css$/, dest( config.dist ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.base ) ) )
    .pipe( gulpIf( /\.html$/, dest( config.dist ) ) )
  ;
}
