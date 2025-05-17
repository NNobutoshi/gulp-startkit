import { commonConfig, commonOptions } from './common.js';
import mergeConfForEnv from './merge_conf.js';

import autoprefixer from 'autoprefixer';
import mqpacker     from '@hail2u/css-mqpacker';

export { mergedConf as config, mergedOptions as options };

// 開発環境用。
const devConfig = {
  src  : [ commonConfig.SRC + '/**/*.scss' ],
  dist : commonConfig.DIST,
  base : commonConfig.SRC,
  enabledWatch      : commonConfig.WATCH_ENABLED,
  enabledSourcemaps : commonConfig.SOURCEMAPS_ENABLED,
  sourcemaps_dir    : '/' + commonConfig.SOURCEMAPS_DIR,
};
// 本番環境用。
// 開発環境と異なる設定を行う場合に、
// その異なるプロパティ部分だけの同一構造のオブジェクトを代入。
// 同一設定の場合はnull を明示的に代入。
const prodConfig = {
  enabledSourcemaps : commonConfig.SOURCEMAPS_ENABLED,
};

// devConf に同じ。
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name : 'css_sass',
  },
  postcss : {
    plugins : [
      autoprefixer(),
      mqpacker(),
    ]
  },
  sass : {
    outputStyle : 'expanded', // nested, compact, compressed, expanded
    linefeed    : 'lf', // 'crlf', 'lf'
    indentType  : 'space', // 'space', 'tab'
    indentWidth : 2,
    silenceDeprecations : [ 'legacy-js-api' ], // Dart Sass 2.0.0 までの間
  },
  logStreamData : {
    scss : {
      title    : 'css_sass',
      subtitle : 'compiled',
    },
    sourceMaps : {
      title       : 'css_sass:map',
      subtitle    : 'created',
      forEachFile : false,
    },
  },
};
const prodOptions = {
  sass : {
    outputStyle : 'compressed', // nested, compact, compressed, expanded
  },
};

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeConfForEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeConfForEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
