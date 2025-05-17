import { commonConfig, commonOptions } from './common.js';
import mergeConfForEnv from './merge_conf.js';

export { mergedConf as config, mergedOptions as options };

// 開発環境用。
const devConfig = {
  src : [
    ''  + commonConfig.SRC + '/**/*.scss',
    '!' + commonConfig.SRC + '/**/css/_sprite_svg.scss',
    '!' + commonConfig.SRC + '/**/_vendor/*.scss',
    '!' + commonConfig.SRC + '/**/_templates/*.scss',
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
    name     : 'css_scss_lint',
    oneToOne : true,
  },
  gulpSrc : {
    read : !commonConfig.DIFF_ENABLED,
  },
  stylelint : {
    formatter : 'string',
  },
  logStreamData : {
    title       : 'css_scss_lint',
    subtitle    : 'linted',
    forEachFile : false,
  },
};
const prodOptions = null;

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeConfForEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeConfForEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
