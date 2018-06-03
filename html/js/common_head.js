!function o(s,a,d){function l(t,e){if(!a[t]){if(!s[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(u)return u(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var i=a[t]={exports:{}};s[t][0].call(i.exports,function(e){return l(s[t][1][e]||e)},i,i.exports,o,s,a,d)}return a[t].exports}for(var u="function"==typeof require&&require,e=0;e<d.length;e++)l(d[e]);return l}({1:[function(e,t,n){t.exports=function(e,t){"use strict";var n=t.getElementsByTagName("html")[0],r=n.className.split(" ");r.push(e),n.className=r.join(" ")}},{}],2:[function(e,t,n){!function(f,p,h){var a=[],d=[],e={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){d.push({name:e,fn:t,options:n})},addAsyncTest:function(e){d.push({name:null,fn:e})}},l=function(){};l.prototype=e,
/*!
{
  "name": "History API",
  "property": "history",
  "caniuse": "history",
  "tags": ["history"],
  "authors": ["Hay Kranen", "Alexander Farkas"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/html51/browsers.html#the-history-interface"
  }, {
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/window.history"
  }],
  "polyfills": ["historyjs", "html5historyapi"]
}
!*/
(l=new l).addTest("history",function(){var e=navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone")||"file:"===location.protocol)&&(f.history&&"pushState"in f.history)}),
/*!
{
  "name": "QuerySelector",
  "property": "queryselector",
  "caniuse": "queryselector",
  "tags": ["queryselector"],
  "authors": ["Andrew Betts (@triblondon)"],
  "notes": [{
    "name" : "W3C Selectors reference",
    "href": "https://www.w3.org/TR/selectors-api/#queryselectorall"
  }],
  "polyfills": ["css-selector-engine"]
}
!*/
l.addTest("queryselector","querySelector"in p&&"querySelectorAll"in p),
/*!
{
  "name": "SVG",
  "property": "svg",
  "caniuse": "svg",
  "tags": ["svg"],
  "authors": ["Erik Dahlstrom"],
  "polyfills": [
    "svgweb",
    "raphael",
    "amplesdk",
    "canvg",
    "svg-boilerplate",
    "sie",
    "dojogfx",
    "fabricjs"
  ]
}
!*/
l.addTest("svg",!!p.createElementNS&&!!p.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect);var m=p.documentElement,v="svg"===m.nodeName.toLowerCase();function o(e){var t=m.className,n=l._config.classPrefix||"";if(v&&(t=t.baseVal),l._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}l._config.enableClasses&&(t+=" "+n+e.join(" "+n),v?m.className.baseVal=t:m.className=t)}function g(e,t){return typeof e===t}function y(){return"function"!=typeof p.createElement?p.createElement(arguments[0]):v?p.createElementNS.call(p,"http://www.w3.org/2000/svg",arguments[0]):p.createElement.apply(p,arguments)}var r,t=(r=!("onblur"in p.documentElement),function(e,t){var n;return!!e&&(t&&"string"!=typeof t||(t=y(t||"div")),!(n=(e="on"+e)in t)&&r&&(t.setAttribute||(t=y("div")),t.setAttribute(e,""),n="function"==typeof t[e],t[e]!==h&&(t[e]=h),t.removeAttribute(e)),n)});e.hasEvent=t,
/*!
{
  "name": "Hashchange event",
  "property": "hashchange",
  "caniuse": "hashchange",
  "tags": ["history"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/window.onhashchange"
  }],
  "polyfills": [
    "jquery-hashchange",
    "moo-historymanager",
    "jquery-ajaxy",
    "hasher",
    "shistory"
  ]
}
!*/
l.addTest("hashchange",function(){return!1!==t("hashchange",f)&&(p.documentMode===h||7<p.documentMode)}),
/*!
{
  "name": "Canvas",
  "property": "canvas",
  "caniuse": "canvas",
  "tags": ["canvas", "graphics"],
  "polyfills": ["flashcanvas", "excanvas", "slcanvas", "fxcanvas"]
}
!*/
l.addTest("canvas",function(){var e=y("canvas");return!(!e.getContext||!e.getContext("2d"))}),
/*!
{
  "name": "VML",
  "property": "vml",
  "caniuse": "vml",
  "tags": ["vml"],
  "authors": ["Craig Andrews (@candrews)"],
  "notes": [{
    "name" : "W3C VML reference",
    "href": "https://www.w3.org/TR/NOTE-VML"
  },{
    "name" : "Microsoft VML reference",
    "href": "https://msdn.microsoft.com/en-us/library/bb263898.aspx"
  }]
}
!*/
l.addTest("vml",function(){var e,t=y("div"),n=!1;return v||(t.innerHTML='<v:shape id="vml_flag1" adj="1" />',"style"in(e=t.firstChild)&&(e.style.behavior="url(#default#VML)"),n=!e||"object"==typeof e.adj),n}),
/*!
{
  "name": "WebGL",
  "property": "webgl",
  "caniuse": "webgl",
  "tags": ["webgl", "graphics"],
  "polyfills": ["jebgl", "cwebgl", "iewebgl"]
}
!*/
l.addTest("webgl",function(){var e=y("canvas"),t="probablySupportsContext"in e?"probablySupportsContext":"supportsContext";return t in e?e[t]("webgl")||e[t]("experimental-webgl"):"WebGLRenderingContext"in f}),
/*!
{
  "name": "CSS Multiple Backgrounds",
  "caniuse": "multibackgrounds",
  "property": "multiplebgs",
  "tags": ["css"]
}
!*/
l.addTest("multiplebgs",function(){var e=y("a").style;return e.cssText="background:url(https://),url(https://),red url(https://)",/(url\s*\(.*?){3}/.test(e.background)}),
/*!
{
  "name": "CSS rgba",
  "caniuse": "css3-colors",
  "property": "rgba",
  "tags": ["css"],
  "notes": [{
    "name": "CSSTricks Tutorial",
    "href": "https://css-tricks.com/rgba-browser-support/"
  }]
}
!*/
l.addTest("rgba",function(){var e=y("a").style;return e.cssText="background-color:rgba(150,255,150,.5)",-1<(""+e.backgroundColor).indexOf("rgba")}),
/*!
{
  "name": "CSS Transform Style preserve-3d",
  "property": "preserve3d",
  "authors": ["denyskoch", "aFarkas"],
  "tags": ["css"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/1748"
  }]
}
!*/
l.addTest("preserve3d",function(){var e,t,n=f.CSS,r=!1;return!!(n&&n.supports&&n.supports("(transform-style: preserve-3d)"))||(e=y("a"),t=y("a"),e.style.cssText="display: block; transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);",t.style.cssText="display: block; width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);",e.appendChild(t),m.appendChild(e),r=t.getBoundingClientRect(),m.removeChild(e),r=r.width&&r.width<4)}),
/*!
{
  "name": "Inline SVG",
  "property": "inlinesvg",
  "caniuse": "svg-html5",
  "tags": ["svg"],
  "notes": [{
    "name": "Test page",
    "href": "https://paulirish.com/demo/inline-svg"
  }, {
    "name": "Test page and results",
    "href": "https://codepen.io/eltonmesquita/full/GgXbvo/"
  }],
  "polyfills": ["inline-svg-polyfill"],
  "knownBugs": ["False negative on some Chromia browsers."]
}
!*/
l.addTest("inlinesvg",function(){var e=y("div");return e.innerHTML="<svg/>","http://www.w3.org/2000/svg"==("undefined"!=typeof SVGRect&&e.firstChild&&e.firstChild.namespaceURI)});var s=y("input"),n="autocomplete autofocus list placeholder max min multiple pattern required step".split(" "),i={};
/*!
{
  "name": "Input attributes",
  "property": "input",
  "tags": ["forms"],
  "authors": ["Mike Taylor"],
  "notes": [{
    "name": "WHATWG spec",
    "href": "https://html.spec.whatwg.org/multipage/forms.html#input-type-attr-summary"
  }],
  "knownBugs": ["Some blackberry devices report false positive for input.multiple"]
}
!*/l.input=function(e){for(var t=0,n=e.length;t<n;t++)i[e[t]]=!!(e[t]in s);return i.list&&(i.list=!(!y("datalist")||!f.HTMLDataListElement)),i}(n);
/*!
{
  "name": "Form input types",
  "property": "inputtypes",
  "caniuse": "forms",
  "tags": ["forms"],
  "authors": ["Mike Taylor"],
  "polyfills": [
    "jquerytools",
    "webshims",
    "h5f",
    "webforms2",
    "nwxforms",
    "fdslider",
    "html5slider",
    "galleryhtml5forms",
    "jscolor",
    "html5formshim",
    "selectedoptionsjs",
    "formvalidationjs"
  ]
}
!*/
var u="search tel url email datetime date month week time datetime-local number range color".split(" "),c={};l.inputtypes=function(e){for(var t,n,r,i=e.length,o=0;o<i;o++)s.setAttribute("type",t=e[o]),(r="text"!==s.type&&"style"in s)&&(s.value="1)",s.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(t)&&s.style.WebkitAppearance!==h?(m.appendChild(s),r=(n=p.defaultView).getComputedStyle&&"textfield"!==n.getComputedStyle(s,null).WebkitAppearance&&0!==s.offsetHeight,m.removeChild(s)):/^(search|tel)$/.test(t)||(r=/^(url|email)$/.test(t)?s.checkValidity&&!1===s.checkValidity():"1)"!=s.value)),c[e[o]]=!!r;return c}(u);var x=e._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];e._prefixes=x,
/*!
{
  "name": "CSS Calc",
  "property": "csscalc",
  "caniuse": "calc",
  "tags": ["css"],
  "builderAliases": ["css_calc"],
  "authors": ["@calvein"]
}
!*/
l.addTest("csscalc",function(){var e=y("a");return e.style.cssText="width:"+x.join("calc(10px);width:"),!!e.style.length}),
/*!
{
  "name": "CSS Gradients",
  "caniuse": "css-gradients",
  "property": "cssgradients",
  "tags": ["css"],
  "knownBugs": ["False-positives on webOS (https://github.com/Modernizr/Modernizr/issues/202)"],
  "notes": [{
    "name": "Webkit Gradient Syntax",
    "href": "https://webkit.org/blog/175/introducing-css-gradients/"
  },{
    "name": "Linear Gradient Syntax",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient"
  },{
    "name": "W3C Gradient Spec",
    "href": "https://drafts.csswg.org/css-images-3/#gradients"
  }]
}
!*/
l.addTest("cssgradients",function(){for(var e,t="background-image:",n="",r=0,i=x.length-1;r<i;r++)e=0===r?"to ":"",n+=t+x[r]+"linear-gradient("+e+"left top, #9f9, white);";l._config.usePrefixes&&(n+=t+"-webkit-gradient(linear,left top,right bottom,from(#9f9),to(white));");var o=y("a").style;return o.cssText=n,-1<(""+o.backgroundImage).indexOf("gradient")}),
/*!
{
  "name": "CSS Opacity",
  "caniuse": "css-opacity",
  "property": "opacity",
  "tags": ["css"]
}
!*/
l.addTest("opacity",function(){var e=y("a").style;return e.cssText=x.join("opacity:.55;"),/^0.55$/.test(e.opacity)});
/*!
{
  "name": "CSS Supports",
  "property": "supports",
  "caniuse": "css-featurequeries",
  "tags": ["css"],
  "builderAliases": ["css_supports"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://dev.w3.org/csswg/css3-conditional/#at-supports"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/648"
  },{
    "name": "W3 Info",
    "href": "http://dev.w3.org/csswg/css3-conditional/#the-csssupportsrule-interface"
  }]
}
!*/
var b="CSS"in f&&"supports"in f.CSS,w="supportsCSS"in f;function C(e,t){return e-1===t||e===t||e+1===t}function T(e,t,n){var r;if("getComputedStyle"in f){r=getComputedStyle.call(f,e,t);var i=f.console;if(null!==r)n&&(r=r.getPropertyValue(n));else if(i)i[i.error?"error":"log"].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}else r=!t&&e.currentStyle&&e.currentStyle[n];return r}l.addTest("supports",b||w);var S={}.toString;
/*!
{
  "name": "SVG clip paths",
  "property": "svgclippaths",
  "tags": ["svg"],
  "notes": [{
    "name": "Demo",
    "href": "http://srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg"
  }]
}
!*/function _(e,t,n,r){var i,o,s,a,d,l="modernizr",u=y("div"),c=((d=p.body)||((d=y(v?"svg":"body")).fake=!0),d);if(parseInt(n,10))for(;n--;)(s=y("div")).id=r?r[n]:l+(n+1),u.appendChild(s);return(i=y("style")).type="text/css",i.id="s"+l,(c.fake?c:u).appendChild(i),c.appendChild(u),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(p.createTextNode(e)),u.id=l,c.fake&&(c.style.background="",c.style.overflow="hidden",a=m.style.overflow,m.style.overflow="hidden",m.appendChild(c)),o=t(u,e),c.fake?(c.parentNode.removeChild(c),m.style.overflow=a,m.offsetHeight):u.parentNode.removeChild(u),!!o}l.addTest("svgclippaths",function(){return!!p.createElementNS&&/SVGClipPath/.test(S.call(p.createElementNS("http://www.w3.org/2000/svg","clipPath")))});var k,z=(k=f.matchMedia||f.msMatchMedia)?function(e){var t=k(e);return t&&t.matches||!1}:function(e){var t=!1;return _("@media "+e+" { #modernizr { position: absolute; } }",function(e){t="absolute"==(f.getComputedStyle?f.getComputedStyle(e,null):e.currentStyle).position}),t};e.mq=z;var E,N,j,A,P,O=e.testStyles=_;
/*!
{
  "name": "@font-face",
  "property": "fontface",
  "authors": ["Diego Perini", "Mat Marquis"],
  "tags": ["css"],
  "knownBugs": [
    "False Positive: WebOS https://github.com/Modernizr/Modernizr/issues/342",
    "False Postive: WP7 https://github.com/Modernizr/Modernizr/issues/538"
  ],
  "notes": [{
    "name": "@font-face detection routine by Diego Perini",
    "href": "http://javascript.nwbox.com/CSSSupport/"
  },{
    "name": "Filament Group @font-face compatibility research",
    "href": "https://docs.google.com/presentation/d/1n4NyG4uPRjAA8zn_pSQ_Ket0RhcWC6QlZ6LMjKeECo0/edit#slide=id.p"
  },{
    "name": "Filament Grunticon/@font-face device testing results",
    "href": "https://docs.google.com/spreadsheet/ccc?key=0Ag5_yGvxpINRdHFYeUJPNnZMWUZKR2ItMEpRTXZPdUE#gid=0"
  },{
    "name": "CSS fonts on Android",
    "href": "https://stackoverflow.com/questions/3200069/css-fonts-on-android"
  },{
    "name": "@font-face and Android",
    "href": "http://archivist.incutio.com/viewlist/css-discuss/115960"
  }]
}
!*/function R(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function M(e,t){if("object"==typeof e)for(var n in e)A(e,n)&&M(n,e[n]);else{var r=(e=e.toLowerCase()).split("."),i=l[r[0]];if(2==r.length&&(i=i[r[1]]),void 0!==i)return l;t="function"==typeof t?t():t,1==r.length?l[r[0]]=t:(!l[r[0]]||l[r[0]]instanceof Boolean||(l[r[0]]=new Boolean(l[r[0]])),l[r[0]][r[1]]=t),o([(t&&0!=t?"":"no-")+r.join("-")]),l._trigger(e,t)}return l}(E=navigator.userAgent,N=E.match(/w(eb)?osbrowser/gi),j=E.match(/windows phone/gi)&&E.match(/iemobile\/([0-9])+/gi)&&9<=parseFloat(RegExp.$1),N||j)?l.addTest("fontface",!1):O('@font-face {font-family:"font";src:url("https://")}',function(e,t){var n=p.getElementById("smodernizr"),r=n.sheet||n.styleSheet,i=r?r.cssRules&&r.cssRules[0]?r.cssRules[0].cssText:r.cssText||"":"",o=/src/i.test(i)&&0===i.indexOf(t.split(" ")[0]);l.addTest("fontface",o)}),
/*!
{
  "name": "CSS Generated Content",
  "property": "generatedcontent",
  "tags": ["css"],
  "warnings": ["Android won't return correct height for anything below 7px #738"],
  "notes": [{
    "name": "W3C CSS Selectors Level 3 spec",
    "href": "https://www.w3.org/TR/css3-selectors/#gen-content"
  },{
    "name": "MDN article on :before",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/::before"
  },{
    "name": "MDN article on :after",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/::before"
  }]
}
!*/
O('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}',function(e){l.addTest("generatedcontent",6<=e.offsetHeight)}),
/*!
{
  "name": "CSS vh unit",
  "property": "cssvhunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vhunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "Similar JSFiddle",
    "href": "https://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/
O("#modernizr { height: 50vh; }",function(e){var t=parseInt(f.innerHeight/2,10),n=parseInt(T(e,null,"height"),10);l.addTest("cssvhunit",n==t)}),
/*!
{
  "name": "CSS vmax unit",
  "property": "cssvmaxunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vmaxunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/glsee/JDsWQ/4/"
  }]
}
!*/
O("#modernizr1{width: 50vmax}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}",function(e){var t=e.childNodes[2],n=e.childNodes[1],r=e.childNodes[0],i=parseInt((n.offsetWidth-n.clientWidth)/2,10),o=r.clientWidth/100,s=r.clientHeight/100,a=parseInt(50*Math.max(o,s),10),d=parseInt(T(t,null,"width"),10);l.addTest("cssvmaxunit",C(a,d)||C(a,d-i))},3),
/*!
{
  "name": "CSS vmin unit",
  "property": "cssvminunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vminunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/glsee/JRmdq/8/"
  }]
}
!*/
O("#modernizr1{width: 50vm;width:50vmin}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}",function(e){var t=e.childNodes[2],n=e.childNodes[1],r=e.childNodes[0],i=parseInt((n.offsetWidth-n.clientWidth)/2,10),o=r.clientWidth/100,s=r.clientHeight/100,a=parseInt(50*Math.min(o,s),10),d=parseInt(T(t,null,"width"),10);l.addTest("cssvminunit",C(a,d)||C(a,d-i))},3),
/*!
{
  "name": "CSS vw unit",
  "property": "cssvwunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vwunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "https://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/
O("#modernizr { width: 50vw; }",function(e){var t=parseInt(f.innerWidth/2,10),n=parseInt(T(e,null,"width"),10);l.addTest("cssvwunit",n==t)}),A=g(P={}.hasOwnProperty,"undefined")||g(P.call,"undefined")?function(e,t){return t in e&&g(e.constructor.prototype[t],"undefined")}:function(e,t){return P.call(e,t)},e._l={},e.on=function(e,t){this._l[e]||(this._l[e]=[]),this._l[e].push(t),l.hasOwnProperty(e)&&setTimeout(function(){l._trigger(e,l[e])},0)},e._trigger=function(e,t){if(this._l[e]){var n=this._l[e];setTimeout(function(){var e;for(e=0;e<n.length;e++)(0,n[e])(t)},0),delete this._l[e]}},l._q.push(function(){e.addTest=M});var I="Moz O ms Webkit",L=e._config.usePrefixes?I.split(" "):[];e._cssomPrefixes=L;var q=function(e){var t,n=x.length,r=f.CSSRule;if(void 0===r)return h;if(!e)return!1;if((t=(e=e.replace(/^@/,"")).replace(/-/g,"_").toUpperCase()+"_RULE")in r)return"@"+e;for(var i=0;i<n;i++){var o=x[i];if(o.toUpperCase()+"_"+t in r)return"@-"+o.toLowerCase()+"-"+e}return!1};e.atRule=q;var W=e._config.usePrefixes?I.toLowerCase().split(" "):[];function B(e,t){return function(){return e.apply(t,arguments)}}e._domPrefixes=W;var H={elem:y("modernizr")};l._q.push(function(){delete H.elem});var V={style:H.elem.style};function U(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function $(e,t,n,r){if(r=!g(r,"undefined")&&r,!g(n,"undefined")){var i=function(e,t){var n=e.length;if("CSS"in f&&"supports"in f.CSS){for(;n--;)if(f.CSS.supports(U(e[n]),t))return!0;return!1}if("CSSSupportsRule"in f){for(var r=[];n--;)r.push("("+U(e[n])+":"+t+")");return _("@supports ("+(r=r.join(" or "))+") { #modernizr { position: absolute; } }",function(e){return"absolute"==T(e,null,"position")})}return h}(e,n);if(!g(i,"undefined"))return i}for(var o,s,a,d,l,u=["modernizr","tspan","samp"];!V.style&&u.length;)o=!0,V.modElem=y(u.shift()),V.style=V.modElem.style;function c(){o&&(delete V.style,delete V.modElem)}for(a=e.length,s=0;s<a;s++)if(d=e[s],l=V.style[d],~(""+d).indexOf("-")&&(d=R(d)),V.style[d]!==h){if(r||g(n,"undefined"))return c(),"pfx"!=t||d;try{V.style[d]=n}catch(e){}if(V.style[d]!=l)return c(),"pfx"!=t||d}return c(),!1}l._q.unshift(function(){delete V.style});var D=e.testProp=function(e,t,n){return $([e],h,t,n)};
/*!
{
  "name": "CSS textshadow",
  "property": "textshadow",
  "caniuse": "css-textshadow",
  "tags": ["css"],
  "knownBugs": ["FF3.0 will false positive on this test"]
}
!*/function G(e,t,n,r,i){var o=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+L.join(o+" ")+o).split(" ");return g(t,"string")||g(t,"undefined")?$(s,t,r,i):function(e,t,n){var r;for(var i in e)if(e[i]in t)return!1===n?e[i]:g(r=t[e[i]],"function")?B(r,n||t):r;return!1}(s=(e+" "+W.join(o+" ")+o).split(" "),t,n)}l.addTest("textshadow",D("textShadow","1px 1px")),e.testAllProps=G;var F=e.prefixed=function(e,t,n){return 0===e.indexOf("@")?q(e):(-1!=e.indexOf("-")&&(e=R(e)),t?G(e,t,n):G(e,"pfx"))};
/*!
{
  "name": "IndexedDB",
  "property": "indexeddb",
  "caniuse": "indexeddb",
  "tags": ["storage"],
  "polyfills": ["indexeddb"],
  "async": true
}
!*/function J(e,t){var n=e.deleteDatabase(t);n.onsuccess=function(){M("indexeddb.deletedatabase",!0)},n.onerror=function(){M("indexeddb.deletedatabase",!1)}}function Y(e,t,n){return G(e,h,h,t,n)}l.addAsyncTest(function(){var e;try{e=F("indexedDB",f)}catch(e){}if(e){var t="modernizr-"+Math.random(),n=e.open(t);n.onerror=function(){n.error&&"InvalidStateError"===n.error.name?M("indexeddb",!1):(M("indexeddb",!0),J(e,t))},n.onsuccess=function(){M("indexeddb",!0),J(e,t)}}else M("indexeddb",!1)}),
/*!
{
  "name": "matchMedia",
  "property": "matchmedia",
  "caniuse" : "matchmedia",
  "tags": ["matchmedia"],
  "authors": ["Alberto Elias"],
  "notes": [{
    "name": "W3C CSSOM View Module",
    "href": "https://drafts.csswg.org/cssom-view/#the-mediaquerylist-interface"
  }, {
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia"
  }],
  "polyfills": ["matchmediajs"]
}
!*/
l.addTest("matchmedia",!!F("matchMedia",f)),e.testAllProps=Y,
/*!
{
  "name": "CSS Columns",
  "property": "csscolumns",
  "caniuse": "multicolumn",
  "polyfills": ["css3multicolumnjs"],
  "tags": ["css"]
}
!*/
function(){l.addTest("csscolumns",function(){var e=!1,t=Y("columnCount");try{(e=!!t)&&(e=new Boolean(e))}catch(e){}return e});for(var e,t,n=["Width","Span","Fill","Gap","Rule","RuleColor","RuleStyle","RuleWidth","BreakBefore","BreakAfter","BreakInside"],r=0;r<n.length;r++)e=n[r].toLowerCase(),t=Y("column"+n[r]),"breakbefore"!==e&&"breakafter"!==e&&"breakinside"!=e||(t=t||Y(n[r])),l.addTest("csscolumns."+e,t)}(),
/*!
{
  "name": "Flexbox",
  "property": "flexbox",
  "caniuse": "flexbox",
  "tags": ["css"],
  "notes": [{
    "name": "The _new_ flexbox",
    "href": "http://dev.w3.org/csswg/css3-flexbox"
  }],
  "warnings": [
    "A `true` result for this detect does not imply that the `flex-wrap` property is supported; see the `flexwrap` detect."
  ]
}
!*/
l.addTest("flexbox",Y("flexBasis","1px",!0)),
/*!
{
  "name": "Flexbox (legacy)",
  "property": "flexboxlegacy",
  "tags": ["css"],
  "polyfills": ["flexie"],
  "notes": [{
    "name": "The _old_ flexbox",
    "href": "https://www.w3.org/TR/2009/WD-css3-flexbox-20090723/"
  }]
}
!*/
l.addTest("flexboxlegacy",Y("boxDirection","reverse",!0)),
/*!
{
  "name": "Flexbox (tweener)",
  "property": "flexboxtweener",
  "tags": ["css"],
  "polyfills": ["flexie"],
  "notes": [{
    "name": "The _inbetween_ flexbox",
    "href": "https://www.w3.org/TR/2011/WD-css3-flexbox-20111129/"
  }],
  "warnings": ["This represents an old syntax, not the latest standard syntax."]
}
!*/
l.addTest("flexboxtweener",Y("flexAlign","end",!0)),
/*!
{
  "name": "CSS Reflections",
  "caniuse": "css-reflections",
  "property": "cssreflections",
  "tags": ["css"]
}
!*/
l.addTest("cssreflections",Y("boxReflect","above",!0)),
/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "caniuse": "transforms2d",
  "tags": ["css"]
}
!*/
l.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&Y("transform","scale(1)",!0)}),
/*!
{
  "name": "CSS Transforms 3D",
  "property": "csstransforms3d",
  "caniuse": "transforms3d",
  "tags": ["css"],
  "warnings": [
    "Chrome may occassionally fail this test on some systems; more info: https://code.google.com/p/chromium/issues/detail?id=129004"
  ]
}
!*/
l.addTest("csstransforms3d",function(){var t=!!Y("perspective","1px",!0),e=l._config.usePrefixes;if(t&&(!e||"webkitPerspective"in m.style)){var n;l.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",e&&(n+=",(-webkit-transform-3d)")),O("#modernizr{width:0;height:0}"+(n+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}"),function(e){t=7===e.offsetWidth&&18===e.offsetHeight})}return t}),
/*!
{
  "name": "CSS Transitions",
  "property": "csstransitions",
  "caniuse": "css-transitions",
  "tags": ["css"]
}
!*/
l.addTest("csstransitions",Y("transition","all",!0)),function(){var e,t,n,r,i,o;for(var s in d)if(d.hasOwnProperty(s)){if(e=[],(t=d[s]).name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(r=g(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)1===(o=e[i].split(".")).length?l[o[0]]=r:(!l[o[0]]||l[o[0]]instanceof Boolean||(l[o[0]]=new Boolean(l[o[0]])),l[o[0]][o[1]]=r),a.push((r?"":"no-")+o.join("-"))}}(),o(a),delete e.addTest,delete e.addAsyncTest;for(var Z=0;Z<l._q.length;Z++)l._q[Z]();f.Modernizr=l}(window,document)},{}],3:[function(e,t,n){e("./_vendor/modernizr-custom.js"),e("./_modules/adjust.js")("js",document)},{"./_modules/adjust.js":1,"./_vendor/modernizr-custom.js":2}]},{},[3]);
//# sourceMappingURL=common_head.js.map
