/**
 * @memberof module:config
 * @requires node:process
 * @requires node:path
 * @requires ./common.js
 * @requires ./merge_by_env.js
 */

import { cwd, env } from 'node:process';
import path         from 'node:path';

import { commonConfig, commonOptions } from './common.js';
import mergeByEnv                      from './merge_by_env.js';

export { mergedConf as config, mergedOptions as options };

const
  TASK_NAME  = 'img_sprite_svg'
  ,GROUP_DIR = 'img/_sprite_svg'
  ,CWD = cwd()
;

/**
 * 開発環境用コンフィグオブジェクト。
 * @memberof module:config
 * @name devConfig:img_sprite_svg
 */
const devConfig = {
  src   : [ `${ commonConfig.SRC }/**/${ GROUP_DIR }/*.svg` ],
  base  : commonConfig.SRC,
  dist  : commonConfig.DIST,
  group : GROUP_DIR, // この命名ルールのディレクトリごとに。
};

/**
 * 本番環境用コンフィグオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
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
    name  : TASK_NAME,
    group : GROUP_DIR,
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
 * 本番環境用オプションオブジェクト。<br>
 * 開発環境と異なる設定を行う場合に、その異なるプロパティ部分だけの同一構造のオブジェクトを代入。<br>
 * 同一設定の場合はnull を明示的に代入。
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

// すべては開発環境用の設定をベースにマージする。
const
  mergedConf     = mergeByEnv( env.NODE_ENV, devConfig, prodConfig )
  ,mergedOptions = mergeByEnv( env.NODE_ENV, devOptions, prodOptions )
;
