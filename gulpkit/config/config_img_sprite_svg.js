import path from 'node:path';

import { commonConfig, commonOptions } from './common.js';
import switchConfig        from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src   : [ commonConfig.SRC + '/**/img/_sprite_svg/**/*.svg' ],
  base  : commonConfig.SRC,
  dist  : commonConfig.DIST,
  group : '/img/_sprite_svg',// この命名ルールのディレクトリ毎に。
  enabledWatch : commonConfig.WATCH_ENABLED,
}
;
const prodConfig = null;

const devOptions = {
  plumber : commonOptions.plumber,
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
        }
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
  diff : { ...commonOptions.diff,
    name    : 'img_sprite_svg',
    group   : '/img/_sprite_svg',
  },
  logStreamData : {
    svg :  {
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
    mode  : {
      symbol : {
        example : false,
      },
      css : {
        example : false,
      },
    },
  },
};

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;
