import { watchForCommanLineTask } from './gulpkit/index.js';

export * from './gulpkit/tasks/index.js';
export { default, html, img, css, js  } from './gulpkit/index.js';

watchForCommanLineTask();
