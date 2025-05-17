import path from 'node:path';

import { commonConfig, commonOptions } from './common.js';
import mergeConfForEnv from './merge_conf.js';

export { mergedConf as config, mergedOptions as options };

// 開発環境用。
const devConfig = {
  src   : [ commonConfig.SRC + '/**/img/_sprite_svg/**/*.svg' ],
  base  : commonConfig.SRC,
  dist  : commonConfig.DIST,
  group : '/img/_sprite_svg',// この命名ルールのディレクトリ毎に。
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
    name  : 'img_sprite_svg',
    group : '/img/_sprite_svg',
  },
  svgSprite : {
    mode : {
      symbol : {
        dest    : 'img',
        sprite  : 'common_symbols.svg',
        example : {
          dest : '../_sprite_svg_example.html',
        },
      },
      css : {
        dest       : 'css',
        sprite     : '../img/common_sheet.svg',
        prefix     : '.icon_%s',
        dimensions : '_dims',
        bust       : false,
        render     : {
          scss : {
            dest : path.resolve( process.cwd(), 'css/_sprite_svg.scss' ),
          },
        },
        example : {
          dest : path.resolve( process.cwd(), '_sprite_svg_bg_example.html' ),
        },
      },
    },
    shape : {
      // dimension : {
      //   maxWidth  : 32,
      //   maxHeight : 32,
      // },
      // spacing : {
      //   padding : 10,
      // },
      transform : [
        {
          svgo : {
            plugins : [
              {
                name   : 'removeViewBox',
                active : true,
              },
            ],
          },
        },
      ],
    },
    svg : {
      xmlDeclaration     : false,
      doctypeDeclaration : false,
    },
  },
  svgLint : {
  },
  logStreamData : {
    svg : {
      title       : 'img_sprite_svg',
      subtitle    : 'created',
      forEachFile : false,
    },
    scss : {
      title       : 'img_sprite_svg:scss',
      subtitle    : 'generated',
      forEachFile : false,
    },
    html : {
      title       : 'img_sprite_svg:html',
      subtitle    : 'created',
    },
  },
};
const prodOptions = {
  svgSprite : {
    mode : {
      symbol : {
        example : false,
      },
      css : {
        example : false,
      },
    },
  },
};

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeConfForEnv( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeConfForEnv( commonConfig.NODE_ENV, devOptions, prodOptions )
;
