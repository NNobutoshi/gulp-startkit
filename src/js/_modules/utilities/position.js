export default function position( elem ) {
  const
    pos = {}
    ,rect = elem.getBoundingClientRect()
    ,scTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ,scLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
  ;
  pos.top = rect.top + scTop;
  pos.left = rect.left + scLeft;
  return pos;
}
