import { commonConfig, commonOptions } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

const TASK_NAME = 'icon_font';
const GROUP_DIR = '/fonts/icons';

/**
 * @module config_icon_font
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */
/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config_icon_font
 */
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

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_icon_font
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config_icon_font
 */
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
      title    : TASK_NAME,
      subtitle : 'created',
    },
    scss : {
      title    : `${ TASK_NAME }:scss`,
      subtitle : 'generated',
    },
  },
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_icon_font
 */
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
