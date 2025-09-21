/**
 * @memberof module:config
 * @requires node:process
 * @requires ./common.js
 * @requires ./merge_by_env.js
 * @requires ./get_env_status.js
 */

import { cwd, env } from 'node:process';
import path         from 'node:path';

import { srcDir, distDir, commonOptions } from './common.js';
import mergeByEnv                         from './merge_by_env.js';

export { mergedConfig as config, mergedOptions as options };

const
  TASK_NAME = 'html_pug'
  ,NODE_ENV = env.NODE_ENV
  ,CWD = cwd()
;
const
  SRC_DIR   = srcDir[ NODE_ENV ]
  ,DIST_DIR = distDir[ NODE_ENV ]
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:html_pug
 */
const devConfig = {
  src : [
    `${ SRC_DIR }/**/*.pug`,
    `${ SRC_DIR }/**/_pug_data.json`,
    `${ SRC_DIR }/**/_pug_common_data.json`,
  ],
  subsrc : [
    `${ SRC_DIR }/**/*.{png,jpg,svg}`,
    `!${ SRC_DIR }/**/_sprite*/*.{png,svg}`,
    `!${ SRC_DIR }/**/fonts/icons/*.svg`,
  ],
  dataSrc : [
    `${ SRC_DIR }/**/_pug_data.json`,
    `${ SRC_DIR }/**/_pug_common_data.json`,
  ],
  dist : DIST_DIR,
  base : SRC_DIR,
  data : path.resolve( CWD, `${ SRC_DIR }/_data/_pug_data.json` ),
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:html_pug
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:html_pug
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name : TASK_NAME,
  },
  imgSize : true,
  injectImageSize : {
    imgRegEx : /<(img|source)(.*?)(src|srcset)=(["'])([^"'?]*)(\??[^"'?]*)["'](.*?)>/g,
    enabled  : true,
  },
  formatHtml : {
    repairAElement        : true,
    commentPosition       : 'inside', // inside or outside
    commentOnOneLine      : true,
    blankLineAfterComment : true,
    indent                : true,
    uglyAElementRegEx     : /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg,
    endCommentRegEx       : /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/[.#].+?)-->/mg,
  },
  beautify : {
    indent_size : 2,
    indent_char : ' ',
  },
  pug : {
    pretty  : true,
    basedir : SRC_DIR,
  },
  logStreamData : {
    title     : TASK_NAME,
    subtitle  : 'renderd',
  },
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:html_pug
 */
const prodOptions = null;

// 開発環境用の設定をベースにマージする。
const
  mergedConfig   = mergeByEnv( NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
