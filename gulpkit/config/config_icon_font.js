/**
 * @memberof module:config
 * @requires node:process
 * @requires ./common.js
 * @requires ./constants.js
 * @requires ./merge_by_env.js
 */

import { env } from 'node:process';

import { srcDir, distDir, commonOptions } from './common.js';
import { PLACEHOLDER }                    from './constants.js';
import mergeByEnv                         from './merge_by_env.js';

export { mergedConfig as config, mergedOptions as options };

const
  TASK_NAME  = 'icon_font'
  ,GROUP_DIR = 'fonts/icons'
;
const
  NODE_ENV = env.NODE_ENV
;
const
  SRC_DIR   = srcDir[ NODE_ENV ]
  ,DIST_DIR = distDir[ NODE_ENV ]
;


/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:icon_font
 */
const devConfig = {
  src          : [ `${ SRC_DIR }/**/${ GROUP_DIR }/*.svg` ],
  base         : SRC_DIR,
  dist         : DIST_DIR,
  placeholder  : PLACEHOLDER,
  fontsDist    : DIST_DIR + `${ PLACEHOLDER }/fonts`,
  scssDist     : SRC_DIR  + `${ PLACEHOLDER }/css`,
  group        : GROUP_DIR, // この命名ルールのディレクトリごとに。
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:icon_font
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:icon_font
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name    : TASK_NAME,
    enabled : commonOptions.enabledDiff.dev,
    group   : GROUP_DIR,
  },
  iconfont : {
    fontName       : `icons${ PLACEHOLDER }`,
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
    templatePath : SRC_DIR + '/css/_templates/_icons.scss.handlebars',
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
 * @memberof module:config
 * @name prodOptions:icon_font
 */
const prodOptions = {
  diff : {
    enabled : commonOptions.enabledDiff.prod,
  },
};

// すべては開発環境用の設定をベースにマージする。
const
  mergedConfig   = mergeByEnv( NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
