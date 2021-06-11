import '../polyfills/matches.js';

export default function closest( elem, selector, wrapper ) {
  const parents = [];
  let parent = elem.parentElement;
  wrapper = wrapper || 'body';
  while ( !parent.matches( wrapper ) ) {
    if ( parent.matches( selector ) ) {
      console.info( 'matches' );
      parents.push( parent );
    }
    parent = parent.parentElement;
  }
  return parents;
}
