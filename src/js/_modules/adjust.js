import { UAParser } from 'ua-parser-js';

const uAParser = new UAParser();

export default function( className ) {
  const
    elemHtml = document.documentElement
    ,browser = uAParser.getBrowser()
  ;
  elemHtml.classList.add( className );
  elemHtml.classList.add( browser.name + browser.major );
}
