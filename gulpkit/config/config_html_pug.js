import path from 'node:path';

import { commonConfig, commonOptions } from './common.js';
import switchConfig from './switch.js';

export { switchedConf as config, switchedOptions as options };

const devConfig = {
  src : [
    ''  + commonConfig.SRC + '/**/*.pug',
    ''  + commonConfig.SRC + '/**/*_data.json',
  ],
  imgSrc : [
    ''  + commonConfig.SRC + '/**/*.{png,jpg,svg}',
    '!' + commonConfig.SRC + '/**/_sprite*/*.{png,svg}',
    '!' + commonConfig.SRC + '/**/fonts/icons/*.svg',
  ],
  dist : commonConfig.DIST,
  base : commonConfig.SRC,
  data : path.resolve( process.cwd(), `${ commonConfig.SRC }/_data/_pug_data.json` ),
  enabledWatch : commonConfig.WATCH_ENABLED,
};
const prodConfig = null;

const devOptions = {
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
  diff : { ...commonOptions.diff,
    name : 'html_pug',
  },
  plumber : commonOptions.plumber,
  logStreamData : {
    title     : 'html_pug',
    subtitle  : 'renderd',
  },
};
const prodOptions = null;

const
  switchedConf = switchConfig( commonConfig.NODE_ENV, devConfig, prodConfig )
  ,switchedOptions = switchConfig( commonConfig.NODE_ENV, devOptions, prodOptions )
;
