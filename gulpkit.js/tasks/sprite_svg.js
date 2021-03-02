const
  { src, dest } = require( 'gulp' )
  ,svgSprite    = require( 'gulp-svg-sprite' )
  ,plumber      = require( 'gulp-plumber' )
  ,gulpIf       = require( 'gulp-if' )
  ,taskForEach  = require( '../lib/task_for_each.js' )
  ,groupSrc     = require( '../lib/group_src.js' )
  ,diff         = require( '../lib/diff_build.js' )
;
const
  config = require( '../config.js' ).sprite_svg
;
const
  options = config.options
;

module.exports = sprite_svg;

function sprite_svg() {
  const srcCollection = {};
  return src( config.src )
    .pipe( gulpIf( options.diff, diff( options.diff ) ) )
    .pipe( groupSrc( srcCollection, config.group, config.base ) )
    .pipe( taskForEach( srcCollection, _branchTask ) )
  ;
}

function _branchTask( subSrc, baseDir ) {
  return src( subSrc )
    .pipe( plumber( options.plumber ) )
    .pipe( svgSprite( options.svgSprite ) )
    .pipe( gulpIf( /\.svg$/, dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( /\.css$/, dest( config.dist + baseDir ) ) )
    .pipe( gulpIf( /\.scss$/, dest( config.base + baseDir ) ) )
    .pipe( gulpIf( /\.html$/, dest( config.dist + baseDir ) ) )
  ;
}
