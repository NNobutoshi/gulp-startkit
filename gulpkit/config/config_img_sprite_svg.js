/**
 * @memberof module:config
 * @requires node:process
 * @requires node:path
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
  TASK_NAME = 'img_sprite_svg',
  GROUP_DIR = 'img/_sprite_svg',
  NODE_ENV  = env.NODE_ENV,
  CWD = cwd()
;
const
  SRC_DIR  = srcDir[ NODE_ENV ],
  DIST_DIR = distDir[ NODE_ENV ]
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:img_sprite_svg
 */
const devConfig = {
  src   : [ `${ SRC_DIR }/**/${ GROUP_DIR }/*.svg` ],
  base  : SRC_DIR,
  dist  : DIST_DIR,
  group : GROUP_DIR, // この命名ルールのディレクトリごとに。
};

/**
 * 本番環境用のコンフィグオブジェクト（差分）。<br>
 * 開発環境（devConfig）と異なるプロパティのみを定義。<br>
 * 差分がない場合は null を設定。
 * @memberof module:config
 * @name prodConfig:img_sprite_svg
 */
const prodConfig = null;

/**
 * 開発環境用オプションオブジェクト。
 * @memberof module:config
 * @name devOptions:img_sprite_svg
 */
const devOptions = {
  plumber : commonOptions.plumber,
  diff : { ...commonOptions.diff,
    name    : TASK_NAME,
    group   : GROUP_DIR,
  },
  watch : commonOptions.watch,
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
            dest : path.resolve( CWD, 'css/_sprite_svg.scss' ),
          },
        },
        example : {
          dest : path.resolve( CWD, '_sprite_svg_bg_example.html' ),
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
  lintSvg : {
  },
  logStreamData : {
    svg : {
      title       : TASK_NAME,
      subtitle    : 'created',
      forEachFile : false,
    },
    scss : {
      title       : `${ TASK_NAME }:scss`,
      subtitle    : 'generated',
      forEachFile : false,
    },
    html : {
      title       : `${ TASK_NAME }:html`,
      subtitle    : 'created',
    },
  },
};

/**
 * 本番環境用のオプションオブジェクト（差分）。<br>
 * 開発環境（devOptions）と異なるプロパティのみを定義。<br>
 * 差分がない場合は null を設定。
 * @memberof module:config
 * @name prodOptions:img_sprite_svg
 */
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

// 開発環境用の設定をベースにマージする。
const
  mergedConfig  = mergeByEnv( NODE_ENV, devConfig, prodConfig ),
  mergedOptions = mergeByEnv( NODE_ENV, devOptions, prodOptions )
;
