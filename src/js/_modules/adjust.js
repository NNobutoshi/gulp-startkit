
module.exports = function( className, d ) {
  'use strict';
  const
    htmlElement = d.getElementsByTagName('html')[0]
    ,classNames  = htmlElement.className.split(' ')
  ;
  classNames.push( className );
  htmlElement.className = classNames.join(' ');
};
