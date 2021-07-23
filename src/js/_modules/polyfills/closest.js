import './matches.js';

if ( !Element.prototype.closest ) {
  Element.prototype.closest = function( s ) {
    var elem = this;
    do {
      if ( Element.prototype.matches.call( elem, s ) ) {
        return elem;
      }
      elem = elem.parentElement || elem.parentNode;
    } while ( elem !== null && elem.nodeType === 1 );
    return null;
  };
}
