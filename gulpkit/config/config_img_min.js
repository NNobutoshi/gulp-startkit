/**
 * @memberof config
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

import { commonConfig, commonOptions } from './common.js';
import mergeByEnv from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

const
  TASK_NAME = 'img_min'
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:img_min
 */
const devConfig = {
  src : [
    ''  + commonConfig.SRC + '/**/*.{png,jpg,svg}',
    '!' + commonConfig.SRC + '/**/_sprite*/*.{png,svg}',
    '!' + commonConfig.SRC + '/**/fonts/icons/*.svg',
  ],
  dist : commonConfig.DIST,
  enabledWatch : commonConfig.WATCH_ENABLED,
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodConfig:img_min
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:img_min
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name     : TASK_NAME,
    oneToOne : true,
  },
  gulpSrc : {
    base     : commonConfig.SRC,
    encoding : false,
    read     : !commonConfig.DIFF_ENABLED,
  },
  imageminMozjpeg : {
    quality : 90,
  },
  imageminPngquant : {
    quality : [ 0.8, 0.9 ],
  },
  svgo : {
    plugins : [
      {
        name   : 'removeViewBox',
        active : true,
      },
      {
        name   : 'cleanupIDs',
        active : false,
      },
    ],
  },
};

/**
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
 * @memberof module:config
 * @name prodOptions:img_min
 */
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
