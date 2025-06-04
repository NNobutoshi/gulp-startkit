import { cwd } from 'node:process';
import path    from 'node:path';

import { commonConfig, commonOptions } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

/**
 * @module config_html_pug
 * @requires node:process
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

const
  TASK_NAME = 'html_pug'
  ,CWD = cwd()
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config_html_pug
 */
const devConfig = {
  src : [
    commonConfig.SRC + '/**/*.pug',
    commonConfig.SRC + '/**/_pug_data.json',
    commonConfig.SRC + '/**/_pug_common_data.json',
  ],
  subsrc : [
    ''  + commonConfig.SRC + '/**/*.{png,jpg,svg}',
    '!' + commonConfig.SRC + '/**/_sprite*/*.{png,svg}',
    '!' + commonConfig.SRC + '/**/fonts/icons/*.svg',
  ],
  dataSrc : [
    commonConfig.SRC + '/**/_pug_data.json',
    commonConfig.SRC + '/**/_pug_common_data.json',
  ],
  dist : commonConfig.DIST,
  base : commonConfig.SRC,
  data : path.resolve( CWD, `${ commonConfig.SRC }/_data/_pug_data.json` ),
  enabledWatch : commonConfig.WATCH_ENABLED,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config_html_pug
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config_html_pug
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
    basedir : commonConfig.SRC,
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
 * @memberof module:config_html_pug
 */
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
