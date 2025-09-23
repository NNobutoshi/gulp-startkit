/**
 * @module utilities/event_emitter
 * @requires node:events
 */

import { EventEmitter } from 'node:events';

export const eventEmitter = new EventEmitter();
