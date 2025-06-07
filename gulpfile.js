console.log( `Node.js start: ${ process.uptime() } s` );
import { watchForCommanLineTask } from './gulpkit/index.js';

export * from './gulpkit/tasks/index.js';
export { default, html, img, css, js, icon } from './gulpkit/index.js';

watchForCommanLineTask();
