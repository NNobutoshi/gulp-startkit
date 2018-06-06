
var
  gulp          = require('gulp')
  ,bs           = require('browser-sync')
  ,type         = 'normal' // 'normal' or 'proxy'
  ,proxy        = 'localhost:8000'
  ,port         = 9000
  ,documentRoot = './html'
  ,flag         = true
  ,browser      = 'Chrome'
  ,_init        = function() {
    var
      time      = 300
    ;
    if ( type === 'normal') {
      bs( {
        server : {
          baseDir: documentRoot
        }
        ,port : port
        ,browser : browser
      } );
    } else if ( type === 'proxy' ) {
      bs( {
        proxy : proxy
        ,port : port
        ,browser : browser
      } );
    } else {
      return false;
    }
    gulp.watch(
      [
        documentRoot  + '/**/*.html'
        ,documentRoot + '/**/*.css'
        ,documentRoot + '/**/*.js'
        ,documentRoot + '/**/*.png'
        ,documentRoot + '/**/*.jpg'
      ]
      ,{ interval: time }
      ,bs.reload
    );
  }
;

if ( flag === true ) {
  _init.needs = flag;
}
module.exports = _init;

gulp.task( 'serverTask', _init );
gulp.task( 'default', [ 'serverTask' ] );