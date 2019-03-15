
const
  bs            = require('browser-sync').create()
  ,type         = 'normal' // 'normal' or 'proxy'
  ,proxy        = 'localhost:8000'
  ,documentRoot = './html'
  ,options      = {
    watch   : true,
    port    : 9000,
    browser : 'Chrome',
    reloadDelay    : 500,
    reloadDebounce : 500,
    reloadThrottle : 2000,
    files   : [
      documentRoot  + '/**/*.html',
      documentRoot  + '/**/*.css',
      documentRoot  + '/**/*.jpg',
      documentRoot  + '/**/*.jpeg',
      documentRoot  + '/**/*.png',
      documentRoot  + '/**/*.js',
    ],
  }
;

if ( type === 'normal') {
  options.server = {
    baseDir : documentRoot,
  };
} else if ( type === 'proxy' ) {
  options.proxy = proxy;
}

bs.init( options );
