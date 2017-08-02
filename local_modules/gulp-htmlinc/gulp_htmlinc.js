var
   through = require('through2')
  ,fs      = require('fs')
  ,charset = 'utf-8'
;

module.exports = _init;

function _init( arg ) {
  var
     dist          = ( arg && arg.dist )? arg.dist: './htdocs'
    ,escapeRegex   = /([.*+?^=!:${}()|[\]\/\\])/g
    ,includedFiles = []
  ;
  return through.obj( _transform, _flush );
  function _transform( file, encoding, callback ) {
    var
       store    = []
      ,len      = 0
      ,included = {
         all   : ''
        ,start : ''
        ,end   : ''
      }
    ;
    included.all = file._contents + '';
    store = included.all.split('\n');
    len = store.length;
    if( len >= 3) {
      store.forEach( function( item, index ) {
        if( index === 0 ) {
          included.start = item.replace( escapeRegex, '\\$1' );
        }
        if( index === len - 1 ) {
          included.end = item.replace( escapeRegex, '\\$1' );
        }
      } );
      includedFiles.push( included );
    }
    this.push( file );
    callback();
  }
  function _flush( callback ) {
    _eachDir( dist, _write );
    callback();
  }
  function _eachDir( path, callback ) {
    fs.readdir( path, function( err, files ) {
      if( err ){
        console.info( err );
        return;
      }
      files.forEach( function( file ) {
        var
           dir  = path + '/' + file
          ,stat = fs.statSync
        ;
        if( stat( dir ).isDirectory() ){
          _eachDir( dir, _write );
        } else if( stat( dir ).isFile() ) {
          if( /\.html?$/.test( dir ) ){
            callback( dir );
          }
        }
      });
    });
  }
  function _write( file ) {
    var
       contents = fs.readFileSync( file, charset )
      ,newContents = contents
    ;
    includedFiles.forEach( function( obj ) {
      var
         regex = new RegExp( obj.start + '[\\s\\S]*?' + obj.end, 'g' )
      ;
      newContents = newContents.replace( regex, obj.all );
    } )
    ;
    fs.writeFileSync( file, newContents );
  }
}