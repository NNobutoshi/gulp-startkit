/**
 * Gulp タスクのエクスポート
 * @module tasks/index
 */
export { default as clean }           from './clean.js';
export { default as copy_to }         from './copy_to.js';
export { default as css_sass }        from './css_sass.js';
export { default as css_lint_scss }   from './css_lint_scss.js';
export { default as html_pug }        from './html_pug.js';
export { default as icon_font }       from './icon_font.js';
export { default as img_min }         from './img_min.js';
export { default as img_sprite }      from './img_sprite.js';
export { default as img_sprite_svg }  from './img_sprite_svg.js';
export { default as js_eslint }       from './js_eslint.js';
export { default as js_webpack }      from './js_webpack.js';

export { default as task_watch }          from './task_watch.js';
export { init_browsing, reload_browsing } from './browse.js';
