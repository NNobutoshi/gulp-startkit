const
  { src, dest, lastRun } = require( 'gulp' )
  ,svgSprite = require( 'gulp-svg-sprite' )
  ,plumber  = require( 'gulp-plumber' )
;
const
  config = require( '../config.js' ).sprite_svg
;
const
  options = config.options
;

module.exports = sprite_svg;

function sprite_svg() {
  const
    srcOptions = {
      since : lastRun( sprite_svg ) || process.lastRunTime,
    }
  ;
  return src( config.src, srcOptions )
    .pipe( plumber( options.plumber ) )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( dest( config.dist ) )
  ;
}
