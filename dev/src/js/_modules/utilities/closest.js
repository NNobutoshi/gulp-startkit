import '../polyfills/matches.js';

export default function closest( elem, wrapper ) {
  for ( var closest = elem; closest; closest = closest.parentElement ) {
    if ( closest.matches( wrapper ) ) {
      break;
    }
  }
  return closest;
}

