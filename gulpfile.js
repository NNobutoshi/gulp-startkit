var
   fs           = require('fs')
  ,gulp         = require('gulp')
  ,concat       = require('gulp-concat')
  ,uglify       = require('gulp-uglify')
  ,plumber      = require('gulp-plumber')
  ,sourcemap    = require('gulp-sourcemaps')
  ,gulpIf       = require('gulp-if')
  ,sass         = require('gulp-sass')
  ,postcss      = require('gulp-postcss')
  ,mergeStream  = require('merge-stream')
  ,autoprefixer = require('autoprefixer')
  ,cssMqpacker  = require("css-mqpacker")
  ,jsbundler    = require('gulp-jsbundler') /* local module */
  ,htmlinc      = require('gulp-htmlinc') /* local module */
  ,liveReload   = fs.existsSync('./gulp_livereload.js')? require('./gulp_livereload.js'): null
  ,dist            = './htdocs'
  ,src             = './src'
  ,needsUglify     = true
  ,needsSourcemap  = true
  ,needsCssMqpack  = false
  ,options         = {
    uglify : {
      output : {
        comments : /^!?[\s\S]*?(@preserve|@cc_on|\(c\)|[Ll]icense|[Cc]opyright)[\s\S]*?/
      }
    }
    ,sass : {
      outputStyle : 'compact' // nested, compact, compressed, expanded
    }
    ,autoprefixer : {
      browsers: [ 'last 2 version', 'ie 9', 'ios 7', 'android 4']
    }
  }
  ,tasks = {
    'css:sass' : {
       src     : [ src + '/sass/**/*.scss' ]
      ,watch   : true
      ,default : true
     }
    ,'js:bundle' : {
      src : [
         src + '/**/*.bundle.js'
        ,src + '/**/_*/*.js'
        ,src + '/**/_*.js'
      ]
      ,watch   : true
      ,default : true
    }
    ,'js:ordinary' : {
      src : [
         '!' + src + '/**/*.bundle.js'
        ,src + '/**/!_*/!_*.js'
      ]
      ,watch   : true
      ,default : true
    }
    ,'html:inc' : {
       src     : [ src + '/html/_includes/**/*.html' ]
      ,watch   : true
      ,default : true
    }
    ,'watch' : {
      default : true
    }
  }
;

if( typeof liveReload === 'function' && liveReload.needs === true ) {
  gulp.task( 'livereload', liveReload );
  tasks.livereload = {
    default : true
  };
}

gulp.task( 'css:sass', function() {
  var
    plugins = [ autoprefixer( options.autoprefixer ) ]
  ;
  if( needsCssMqpack ) {
    plugins.push( cssMqpacker() );
  }
  return gulp
    .src(
      tasks[ 'css:sass' ].src
    )
    .pipe( plumber() )
    .pipe( gulpIf(
       needsSourcemap
      ,sourcemap.init( { loadMaps: true } )
     ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( plugins ) )
    .pipe( sourcemap.write('./') )
    .pipe( gulp.dest( dist ) )
  ;
} );

gulp.task( 'html:inc', function() {
  return gulp
    .src( tasks[ 'html:inc' ].src )
    .pipe( plumber() )
    .pipe( htmlinc( dist ) )
  ;
} )
;

gulp.task( 'js', [ 'js:ordinary', 'js:bundle' ] );

gulp.task( 'js:ordinary',function() {
  return gulp
    .src( tasks[ 'js:ordinary' ].src )
    .pipe( plumber() )
    .pipe( gulpIf(
       needsSourcemap
      ,sourcemap.init( { loadMaps: true } )
     ) )
    .pipe( gulpIf(
        needsUglify
       ,uglify( options.uglify )
     ) )
    .pipe( gulpIf(
       needsSourcemap
      ,sourcemap.write('./')
     ) )
    .pipe( gulp.dest( dist ) )
  ;
} );

gulp.task( 'js:bundle', [ 'js:bundle:setup' ], function() {
  var
     sources = jsbundler.sources
    ,streams
  ;
  streams = sources.map( function( item ) {
    return gulp
      .src( item.urls, { base: 'src/javascript' } )
      .pipe( plumber() )
      .pipe( gulpIf(
         needsSourcemap
        ,sourcemap.init( { loadMaps: true } )
       ) )
      .pipe( gulpIf(
          needsUglify
         ,gulpIf(
             _ignore( /\.min\.js$/ )
            ,uglify( options.uglify )
          )
       ) )
      .pipe( concat( item.name ) )
      .pipe( gulpIf(
         needsSourcemap
        ,sourcemap.write('./')
       ) )
      .pipe( gulp.dest( dist + item.dist ) )
    ;
  } )
  ;
  return mergeStream( streams );
} )
;

gulp.task( 'js:bundle:setup', function() {
  return gulp
    .src( tasks[ 'js:bundle' ].src )
    .pipe( plumber() )
    .pipe( jsbundler( {
       suffix : '.bundle'
      ,base   : 'src/javascript'
    } ) )
  ;
} )
;

gulp.task( 'watch', _callWatchTasks ( tasks ) )
;

gulp.task( 'default', _filterDefaultTasks( tasks ) );

function _ignore( regex ) {
  return function( obj ) {
    return !regex.test( obj.path );
  };
}

function _callWatchTasks( obj ) {
  Object
    .keys( obj )
    .forEach( function( key ) {
      if ( obj[ key ].watch && obj[ key ].watch === true ) {
        gulp.watch( obj[ key ].src, [ key ] );
      }
  } );
}

function _filterDefaultTasks( obj ) {
  return Object
    .keys( obj )
    .filter( function( key ) {
      if ( obj[ key ].default && obj[ key ].default === true ) {
        return key;
      }
  } );
}