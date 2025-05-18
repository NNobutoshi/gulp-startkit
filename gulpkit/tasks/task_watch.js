import { watch, series } from 'gulp';
import fancyLog          from 'fancy-log';
import chalk             from 'chalk';

import {
  config as watchConfig,
  options as watchOptions,
} from '../config/config_task_watch.js';

import { config as copyToConfig }       from '../config/config_copy_to.js';
import { config as cssSassConfig }      from '../config/config_css_sass.js';
import { config as cssLintScssConfig }  from '../config/config_css_lint_scss.js';
import { config as htmlPugConfig }      from '../config/config_html_pug.js';
import { config as iconFontConfig }     from '../config/config_icon_font.js';
import { config as imgMinConfig }       from '../config/config_img_min.js';
import { config as imgSpriteConfig }    from '../config/config_img_sprite.js';
import { config as imgSpriteSvgConfig } from '../config/config_img_sprite_svg.js';
import { config as jsEslintConfig }     from '../config/config_js_eslint.js';

const tasksConfig = {
  copy_to        : copyToConfig,
  css_sass       : cssSassConfig,
  css_scss_lint  : cssLintScssConfig,
  icon_font      : iconFontConfig,
  html_pug       : htmlPugConfig,
  img_min        : imgMinConfig,
  img_sprite     : imgSpriteConfig,
  img_sprite_svg : imgSpriteSvgConfig,
  js_eslint      : jsEslintConfig,
};

/**
 * gulp watch タスクを生成する関数
 * @param {Array} tasks タスク名の配列
 * @param {Function} commonNextTask 共通の次のタスク
 * @returns {Function} watch タスク
 */
export default function task_watch( tasks, commonNextTask ) {
  return function init_watch( done ) {
    let enabled = false;
    process.emit( watchConfig.watchInitEventName );
    for ( let i = 0, len = tasks.length; i < len; i++ ) {
      const
        task = tasks[ i ]
        ,taskName = tasks[ i ].name
        ,taskConfig = tasksConfig[ taskName ]
      ;
      if ( !taskConfig ) {
        continue;
      }
      let
        watchSrc
      ;
      if ( taskConfig.src && tasksConfig.subsrc ) {
        watchSrc = taskConfig.concat( taskConfig.subsrc );
      } else if ( taskConfig.src ) {
        watchSrc = taskConfig.src;
      } else {
        continue;
      }
      if ( taskConfig.enabledWatch === true && watchSrc ) {
        enabled = true;
        watch(
          watchSrc,
          watchOptions,
          ( typeof commonNextTask === 'function' )
            ? series( task, commonNextTask, watching )
            : task
          ,
        );
      }
    } //for
    if ( enabled === false ) {
      fancyLog( chalk.gray( 'no task to watch' ) );
    }
    done();
  };
  function watching( done ) {
    process.emit( watchConfig.watchStartEventName );
    done();
  }
}
