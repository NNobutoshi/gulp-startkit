import path from 'node:path';

import { config, options } from './common.js';
import switchConfig        from './switch.js';

const
  devConfig = {
    src : [
      ''  + config.SRC + '/**/*.pug',
      ''  + config.SRC + '/**/*_data.json',
    ],
    imgSrc : [
      ''  + config.SRC + '/**/*.{png,jpg,svg}',
      '!' + config.SRC + '/**/_sprite*/*.{png,svg}',
      '!' + config.SRC + '/**/fonts/icons/*.svg',
    ],
    dist : config.DIST,
    base : config.SRC,
    data : path.resolve( process.cwd(), `${ config.SRC }/_data/_pug_data.json` ),
    enabledWatch : config.WATCH_ENABLED,
    options : {
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
        basedir : config.SRC,
      },
      diff : { ...options.diff,
        name : 'html_pug',
      },
      plumber : options.plumber,
      logStreamData : {
        title     : 'html_pug',
        subtitle  : 'renderd',
      },
    },
  }
  ,prodConfig = {}
;

export default switchConfig( config.NODE_ENV,  devConfig, prodConfig );
