( function( d ) {
  var
     htmlElement = d.getElementsByTagName('html')[0]
    ,classNames  = htmlElement.className.split(' ')
  ;
  classNames.push('js');
  htmlElement.className = classNames.join(' ');
} )( document );