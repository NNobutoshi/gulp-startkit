import '../polyfills/matches.js';

export default function closest( elem, wrapper ) {
  let closest = elem;
  for ( ; closest; closest = closest.parentElement ) {
    if ( closest.matches( wrapper ) ) {
      break;
    }
  }
  return closest;
}
