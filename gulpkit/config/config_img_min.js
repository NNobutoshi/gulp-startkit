import { commonConfig, commonOptions } from './common.js';
import mergeConfForEnv from './merge_conf.js';

export { mergedConf as config, mergedOptions as options };

const TASK_NAME = 'img_min';

// 開発環境用。
const devConfig = {
  src : [
    ''  + commonConfig.SRC + '/**/*.{png,jpg,svg}',
    '!' + commonConfig.SRC + '/**/_sprite*/*.{png,svg}',
    '!' + commonConfig.SRC + '/**/fonts/icons/*.svg',
  ],
  dist : commonConfig.DIST,
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
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeConfForEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeConfForEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
