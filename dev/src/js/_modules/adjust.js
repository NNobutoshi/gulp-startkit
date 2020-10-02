import UaParser from 'ua-parser-js';

const uaParser = new UaParser();

export default function( className ) {
  const
    elemHtml = document.documentElement
    ,browser = uaParser.getBrowser()
  ;
  elemHtml.classList.add( className );
  elemHtml.classList.add( browser.name + browser.major );
}
