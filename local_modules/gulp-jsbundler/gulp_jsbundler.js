/*!
* gulp_jsbundler.js
* version : 1.0.2
* link    : https://github.com/NNobutoshi/gulp-jsbundler
* License : MIT
*/

var
   through  = require('through2')
  ,path     = require('path')
;

module.exports = _init;

function _init( arg ) {
  var
     sources = []
    ,suffix  = ( arg )? arg.suffix: ''
    ,base    = ( arg )? arg.base: ''
  ;
  return through.obj( _transform, _flush );
  function _transform( file, encoding, callback ) {
    var
       contents = file._contents + ''
      ,regex    = /\/\/@import\(["']?(.*?)["']?\);?/g
      ,matches  = contents.match( regex )
      ,filePath = file.path
      ,fileName = path.basename( filePath )
      ,obj      = {}
    ;
    if( matches !== null ) {
      obj.urls = matches
        .map( function( item ) {
          var
            dirName = path.dirname( filePath )
          ;
          item = item.replace( regex, '$1' );
          if( item.indexOf('/') === 0 ) {
            return '.' + item;
          } else {
            return  path
              .resolve( dirName, item )
              .replace( __dirname, '.' )
              .replace( /\\/g ,'/' )
            ;
          }
        } )
      ;
      if( suffix && typeof suffix === 'string' ) {
        obj.name = fileName.replace( suffix, '' );
      } else {
        obj.name = fileName;
      }
      if( base && typeof base === 'string' ) {
        obj.dist = filePath
          .replace( __dirname, '.' )
          .replace( /\\/g ,'/' )
          .split( base )[1]
          .replace( fileName, '')
        ;
      } else {
        obj.dist = '';
      }
      sources.push( obj );
    }
    this.push( file );
    callback();
  }
  function _flush( callback ) {
    _init.sources = sources;
    callback();
  }
}