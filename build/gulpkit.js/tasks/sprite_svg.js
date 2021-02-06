const
  { src, dest, lastRun } = require( 'gulp' )
  ,svgSprite = require( 'gulp-svg-sprite' )
  ,plumber   = require( 'gulp-plumber' )
  ,gulpIf    = require( 'gulp-if' )
  ,diffBuild = require( '../diff_build.js' )
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
    .pipe( diffBuild(
      {
        since   : lastRun( sprite_svg ) || process.lastRunTime,
        allPass : true,
      }
    ) )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( gulpIf( /\.svg$/, dest( config.dist ) ) )
    .pipe( gulpIf( /\.css$/, dest( config.dist ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.base ) ) )
    .pipe( gulpIf( /\.html$/, dest( config.dist ) ) )
  ;
}
