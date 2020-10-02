'use strict';

import 'expose-loader?exposes[]=jQuery!jquery';
import foo from './_modules/foo.js';

console.info( foo( 'body' ) );
