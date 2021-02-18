export default function offset( elem ) {
  const
    offset = {}
    ,rect = elem.getBoundingClientRect()
    ,scTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ,scLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
  ;
  offset.top = rect.top + scTop;
  offset.left = rect.left + scLeft;
  return offset;
}
