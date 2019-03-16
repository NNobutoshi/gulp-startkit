const
  settings = {
    dist           : '../html',
    src            : 'src',
    needsSourcemap : true,
    needsCssMqpack : true,
    needsUglify    : false,
  }
;

const
  config = {
    'css_sass' : {
      src     : [ settings.src + '/**/*.scss' ],
      watch   : true,
      default : true,
      // needsCssMqpack: false,
      // needsSourcemap: false,
    },
    'iconfont' : {
      src     : [ settings.src + '/fonts/*.svg' ],
      watch   : true,
      default : false,
    },
    'js_bundle' : {
      src     : [ settings.src + '/**/*bundle.js' ],
      watch   : false,
      default : true,
      // needsUglify: false,
      // needsSourcemap: false,
    },
    'js_eslint' : {
      src : [
        ''  + '*.js',
        ''  + settings.src + '/**/*.js',
        '!' + settings.src + '/**/_vendor/*.js',
      ],
      watch   : true,
      default : true,
      // needsUglify: false,
      // needsSourcemap: false,
    },
    'html_pug' : {
      src : [
        ''  + settings.src + '/**/*.pug',
        '!' + settings.src + '/**/_*.pug',
        '!' + settings.src + '/**/_*/**/*.pug',
      ],
      watch   : true,
      default : true,
    },
    'html_pug_chidlen' : {
      src : [
        ''  + settings.src + '/**/*.pug',
        '!' + settings.src + '/**/_*.pug',
      ],
      watch   : [ settings.src + '/**/_*.pug' ],
      default : true,
    },
    'sprite'  : {
      src     : [ settings.src + '/img/_sprite/*.png' ],
      watch   : true,
      default : true,
    },
    'watch' : {
      default : true,
    },
  }
;
module.exports = {
  settings: settings,
  config: config,
}
;
