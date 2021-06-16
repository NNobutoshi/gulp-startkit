import '../polyfills/matches.js';

export default function parents( elem, selector, wrapper ) {
  const parents = [];
  let parent = elem.parentElement;
  wrapper = wrapper || 'body';
  while ( !parent.matches( wrapper ) ) {
    if ( parent.matches( selector ) ) {
      parents.push( parent );
    }
    parent = parent.parentElement;
  }
  return parents;
}
