const
  $ = window.jQuery
;
export default function( selector ) {
  return $( selector ).length;
}
