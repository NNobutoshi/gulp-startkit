import { commonConfig, commonOptions } from './common.js';
import mergeConfForEnv from './merge_conf.js';

export { mergedConf as config, mergedOptions as options };

const TASK_NAME = 'icon_font';
const GROUP_DIR = '/fonts/icons';

// 開発環境用。
const devConfig = {
  src          : [ commonConfig.SRC + '/**/fonts/icons/*.svg' ],
  base         : commonConfig.SRC,
  dist         : commonConfig.DIST,
  placeholder  : commonConfig.PLACEHOLDER,
  fontsDist    : commonConfig.DIST + `${ commonConfig.PLACEHOLDER }/fonts`,
  scssDist     : commonConfig.SRC  + `${ commonConfig.PLACEHOLDER }/css`,
  group        : GROUP_DIR, // この命名ルールのディレクトリ毎に。
  enabledWatch : commonConfig.WATCH_ENABLED,
};
// 本番環境用。
// 開発環境と異なる設定を行う場合に、
// その異なるプロパティ部分だけの同一構造のオブジェクトを代入。
// 同一設定の場合はnull を明示的に代入。
const prodConfig = null;

// devConf に同じ。
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name  : TASK_NAME,
    group : GROUP_DIR,
  },
  iconfont : {
    fontName       : `icons${ commonConfig.PLACEHOLDER }`,
    prependUnicode : false,
    formats        : [ 'ttf', 'eot', 'woff', 'woff2' ],
    normalize      : true,
    fontHeight     : 1001,
    startUnicode   : 0xF001,
  },
  iconFontScss : {
    scssFileName : '_icons.scss',
    fontPath     : '../fonts/',
    cssClass     : 'icon',
    templatePath : commonConfig.SRC + '/css/_templates/_icons.scss.handlebars',
  },
  lintSvg : {
  },
  logStreamData : {
    iconFont :  {
      title       : TASK_NAME,
      subtitle    : 'created',
    },
    scss : {
      title       : `${ TASK_NAME }:scss`,
      subtitle    : 'generated',
      forEachFile : false,
      onStream    : false,
    },
  },
};
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeConfForEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeConfForEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
