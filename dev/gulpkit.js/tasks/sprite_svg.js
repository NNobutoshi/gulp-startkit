const
  { src, dest, lastRun } = require( 'gulp' )
  ,svgSprite = require( 'gulp-svg-sprite' )
  ,plumber  = require( 'gulp-plumber' )
  ,gulpIf   = require( 'gulp-if' )
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
    .pipe( gulpIf( /\.svg$/, dest( config.dist ) ) )
    .pipe( gulpIf( /\.css$/, dest( config.dist ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.base ) ) )
    .pipe( gulpIf( /\.html$/, dest( config.dist ) ) )
  ;
}
