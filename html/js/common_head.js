/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/_modules/adjust.js":
/*!***********************************!*\
  !*** ./src/js/_modules/adjust.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ua-parser-js */ "ua-parser-js");
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ua_parser_js__WEBPACK_IMPORTED_MODULE_0__);

var uaParser = new (ua_parser_js__WEBPACK_IMPORTED_MODULE_0___default())();
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(className) {
  var elemHtml = document.documentElement,
      browser = uaParser.getBrowser();
  elemHtml.classList.add(className);
  elemHtml.classList.add(browser.name + browser.major);
}

/***/ }),

/***/ "./src/js/common_head.entry.js":
/*!*************************************!*\
  !*** ./src/js/common_head.entry.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var expose_loader_exposes_UaParser_ua_parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! expose-loader?exposes[]=UaParser!ua-parser-js */ "../node_modules/expose-loader/dist/cjs.js?exposes[]=UaParser!../node_modules/ua-parser-js/src/ua-parser-exposed.js");
/* harmony import */ var expose_loader_exposes_UaParser_ua_parser_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(expose_loader_exposes_UaParser_ua_parser_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _modules_adjust_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_modules/adjust.js */ "./src/js/_modules/adjust.js");




(0,_modules_adjust_js__WEBPACK_IMPORTED_MODULE_1__.default)('js');

/***/ }),

/***/ "../node_modules/expose-loader/dist/cjs.js?exposes[]=UaParser!../node_modules/ua-parser-js/src/ua-parser-exposed.js":
/*!**************************************************************************************************************************!*\
  !*** ../node_modules/expose-loader/dist/cjs.js?exposes[]=UaParser!../node_modules/ua-parser-js/src/ua-parser-exposed.js ***!
  \**************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ___EXPOSE_LOADER_IMPORT___ = __webpack_require__(/*! -!./ua-parser.js */ "../node_modules/ua-parser-js/src/ua-parser.js");
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = __webpack_require__(/*! ../../expose-loader/dist/runtime/getGlobalThis.js */ "../node_modules/expose-loader/dist/runtime/getGlobalThis.js");
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___;
if (typeof ___EXPOSE_LOADER_GLOBAL_THIS___["UaParser"] === 'undefined') ___EXPOSE_LOADER_GLOBAL_THIS___["UaParser"] = ___EXPOSE_LOADER_IMPORT___;
else throw new Error('[exposes-loader] The "UaParser" value exists in the global scope, it may not be safe to overwrite it, use the "override" option')
module.exports = ___EXPOSE_LOADER_IMPORT___;


/***/ }),

/***/ "../node_modules/expose-loader/dist/runtime/getGlobalThis.js":
/*!*******************************************************************!*\
  !*** ../node_modules/expose-loader/dist/runtime/getGlobalThis.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


// eslint-disable-next-line func-names
module.exports = function () {
  if (typeof globalThis === "object") {
    return globalThis;
  }

  var g;

  try {
    // This works if eval is allowed (see CSP)
    // eslint-disable-next-line no-new-func
    g = this || new Function("return this")();
  } catch (e) {
    // This works if the window reference is available
    if (typeof window === "object") {
      return window;
    } // This works if the self reference is available


    if (typeof self === "object") {
      return self;
    } // This works if the global reference is available


    if (typeof __webpack_require__.g !== "undefined") {
      return __webpack_require__.g;
    }
  }

  return g;
}();

/***/ }),

/***/ "../node_modules/ua-parser-js/src/ua-parser.js":
/*!*****************************************************!*\
  !*** ../node_modules/ua-parser-js/src/ua-parser.js ***!
  \*****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * UAParser.js v0.7.23
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2019 Faisal Salman <f@faisalman.com>
 * Licensed under MIT License
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.23',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var mergedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    mergedRegexes[i] = regexes[i];
                }
            }
            return mergedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]{3,6}).+version\/([\w\.-]+)/i,                  // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser
            /(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i,                      // Baidu Browser
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]*)/i,                                             // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            ], [NAME, VERSION], [

            /(konqueror)\/([\w\.]+)/i                                           // Konqueror
            ], [[NAME, 'Konqueror'], VERSION], [

            /(trident).+rv[:\s]([\w\.]{1,9}).+like\sgecko/i                     // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i                          // Microsoft Edge
            ], [[NAME, 'Edge'], VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(Avast)\/([\w\.]+)/i                                               // Avast Secure Browser
            ], [[NAME, 'Avast Secure Browser'], VERSION], [

            /(AVG)\/([\w\.]+)/i                                                 // AVG Secure Browser
            ], [[NAME, 'AVG Secure Browser'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
            ], [[NAME, 'Puffin'], VERSION], [

            /(focus)\/([\w\.]+)/i                                               // Firefox Focus
            ], [[NAME, 'Firefox Focus'], VERSION], [

            /(opt)\/([\w\.]+)/i                                                 // Opera Touch
            ], [[NAME, 'Opera Touch'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i         // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(windowswechat qbcore)\/([\w\.]+)/i                                // WeChat Desktop for Windows Built-in Browser
            ], [[NAME, 'WeChat(Win) Desktop'], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /(brave)\/([\w\.]+)/i                                               // Brave browser
            ], [[NAME, 'Brave'], VERSION], [

            /(whale)\/([\w\.]+)/i                                               // Whale browser
            ], [[NAME, 'Whale'], VERSION], [

            /(qqbrowserlite)\/([\w\.]+)/i                                       // QQBrowserLite
            ], [NAME, VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
            ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
            ], [NAME, VERSION], [

            /(baiduboxapp)[\/\s]?([\w\.]+)/i                                    // Baidu App
            ], [NAME, VERSION], [

            /(2345Explorer)[\/\s]?([\w\.]+)/i                                   // 2345 Browser
            ], [NAME, VERSION], [

            /(MetaSr)[\/\s]?([\w\.]+)/i                                         // SouGouBrowser
            ], [NAME], [

            /(LBBROWSER)/i                                                      // LieBao Browser
            ], [NAME], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android with version
            ], [VERSION, [NAME, 'Facebook']], [
            
            /FBAN\/FBIOS|FB_IAB\/FB4A/i                                         // Facebook App for iOS & Android without version
            ], [[NAME, 'Facebook']], [

            /safari\s(line)\/([\w\.]+)/i,                                       // Line App for iOS
            /android.+(line)\/([\w\.]+)\/iab/i                                  // Line App for Android
            ], [NAME, VERSION], [

            /headlesschrome(?:\/([\w\.]+)|\s)/i                                 // Chrome Headless
            ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
            ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(sailfishbrowser)\/([\w\.]+)/i                                     // Sailfish Browser
            ], [[NAME, 'Sailfish Browser'], VERSION], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /(qihu|qhbrowser|qihoobrowser|360browser)/i                         // 360
            ], [[NAME, '360 Browser']], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
            ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+)\s.*mobile\/\w+\s(safari)/i                      // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+)\s.*(mobile\s?safari|safari)/i                   // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(gsa)\/([\w\.]+)\s.*(mobile\s?safari|safari)(\/[\w\.]+)/i // Google Search Appliance on iOS
            ], [[NAME, 'GSA'], VERSION], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,

                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)\s[\w\s\-]+\/[\w\.]+$/i,                       // Other Firefox-based
            /(mozilla)\/([\w\.]+)\s.+rv\:.+gecko\/\d+/i,                        // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]*)/i,                                         // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]
        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i                        // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple'], [TYPE, SMARTTV]], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)(\sbuild\/|\)).+silk\//i                                 // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+(\sbuild\/|\)).+silk\//i                    // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [
            /android.+aft([bms])\sbuild/i                                       // Fire TV
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, SMARTTV]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(htc)[;_\s-]{1,2}([\w\s]+(?=\)|\sbuild)|\w+)/i,                    // HTC
            /(zte)-(\w*)/i,                                                     // ZTE
            /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i
                                                                                // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,                                        // Huawei
            /android.+\s(nexus\s6p|vog-[at]?l\d\d|ane-[at]?l[x\d]\d|eml-a?l\d\da?|lya-[at]?l\d[\dc]|clt-a?l\d\di?)/i

            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /android.+(bah2?-a?[lw]\d{2})/i                                     // Huawei MediaPad
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, TABLET]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w*)/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|SM-P605|SM-P610|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w*)/i                                                        // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]*)/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i                   // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
            ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /linux;\snetcast.+smarttv/i,                                        // LG SmartTV
            /lg\snetcast\.tv-201\d/i
            ], [[VENDOR, 'LG'], MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w*)/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i             // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [
            /(lenovo)[_\s-]?([\w-]+)/i
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, 'Chromecast'], [VENDOR, 'Google'], [TYPE, SMARTTV]], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)[\s)]/i                                       // Google Pixel C
            ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel( [2-9]a?)?( xl)?)[\s)]/i                        // Google Pixel
            ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+;\s(\w+)\s+build\/hm\1/i,                                 // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]?note?[\s_]?(?:\d\w)?)\sbuild/i,                // Xiaomi Hongmi
            /android.+(redmi[\s\-_]?(?:note|k)?(?:[\s_]?[\w\s]+))(?:\sbuild|\))/i,      
                                                                                // Xiaomi Redmi
            /android.+(mi[\s\-_]?(?:a\d|one|one[\s_]plus|note lte)?[\s_]?(?:\d?\w?)[\s_]?(?:plus)?)\sbuild/i    
                                                                                // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]?(?:pad)(?:[\s_]?[\w\s]+))(?:\sbuild|\))/i     // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
            /(mz)-([\w-]{2,})/i
            ], [[VENDOR, 'Meizu'], MODEL, [TYPE, MOBILE]], [

            /android.+a000(1)\s+build/i,                                        // OnePlus
            /android.+oneplus\s(a\d{4})[\s)]/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/\s](Venue[\d\s]{2,7})\s+build/i                       // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i     // Barnes & Noble Tablet
            ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+;\s(k88)\sbuild/i                                         // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i        // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i                            // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i                    // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i                     // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+;\s(PH-1)\s/i
            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [                // Essential PH-1

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i          // Le Pan Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\w\-\.]+)\s+build/i                       // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            //android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
            //], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i                      // Gigaset Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [
                                                                                // Android Phones from Unidentified Vendors
            /android .+?; ([^;]+?)(?: build|\) applewebkit).+? mobile safari/i
            ], [MODEL, [TYPE, MOBILE]], [
                                                                                // Android Tablets from Unidentified Vendors
            /android .+?;\s([^;]+?)(?: build|\) applewebkit).+?(?! mobile) safari/i
            ], [MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /[\s\/\(](smart-?tv)[;\)]/i                                         // SmartTV
            ], [[TYPE, SMARTTV]], [

            /(android[\w\.\s\-]{0,9});.+build/i                                 // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
                                                                                // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9}).+(gecko)/i                                       // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,                   // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]*)/i,                                     // Blackberry
            /(tizen|kaios)[\/\s]([\w\.]+)/i,                                    // Tizen/KaiOS
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki/Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i                  // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [VERSION, [NAME, 'Chromecast']], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w*)/i,                                            // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]*)/i,                                        // Hurd/Linux
            /(gnu)\s?([\w\.]*)/i                                                // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.\d]*)/i                                            // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i                    // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                   // Haiku
            ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i             // iOS
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]*)/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,                             // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,                                // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS/Fuchsia
            /(unix)\s?([\w\.]*)/i                                               // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////
    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

        this.getBrowser = function () {
            var browser = { name: undefined, version: undefined };
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            var cpu = { architecture: undefined };
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            var device = { vendor: undefined, model: undefined, type: undefined };
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            var engine = { name: undefined, version: undefined };
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            var os = { name: undefined, version: undefined };
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };

    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if ("object" !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (true) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                return UAParser;
            }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {}
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if ($ && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);


/***/ }),

/***/ "ua-parser-js":
/*!***************************!*\
  !*** external "UaParser" ***!
  \***************************/
/***/ (function(module) {

"use strict";
module.exports = UaParser;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/js/common_head.entry.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvX21vZHVsZXMvYWRqdXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb21tb25faGVhZC5lbnRyeS5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL3VhLXBhcnNlci1qcy9zcmMvdWEtcGFyc2VyLWV4cG9zZWQuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9leHBvc2UtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRHbG9iYWxUaGlzLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvdWEtcGFyc2VyLWpzL3NyYy91YS1wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiVWFQYXJzZXJcIiIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6WyJ1YVBhcnNlciIsIlVhUGFyc2VyIiwiY2xhc3NOYW1lIiwiZWxlbUh0bWwiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImJyb3dzZXIiLCJnZXRCcm93c2VyIiwiY2xhc3NMaXN0IiwiYWRkIiwibmFtZSIsIm1ham9yIiwiYWRqdXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQSxJQUFNQSxRQUFRLEdBQUcsSUFBSUMscURBQUosRUFBakI7QUFFQSw2QkFBZSxvQ0FBVUMsU0FBVixFQUFz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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQWE7QUFDekI7QUFDQTtBQUNBLFFBQVEsZ0JBQWdCO0FBQ3hCLEtBQUs7QUFDTDtBQUNBLFlBQVksSUFBMkM7QUFDdkQsWUFBWSxtQ0FBTztBQUNuQjtBQUNBLGFBQWE7QUFBQSxrR0FBQztBQUNkLFNBQVMsTUFBTSxFQUdOO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7Ozs7QUMvNUJELDBCOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0EsY0FBYywwQkFBMEIsRUFBRTtXQUMxQyxjQUFjLGVBQWU7V0FDN0IsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBO1dBQ0EsQ0FBQyxJOzs7OztXQ1BELDZDQUE2Qyx3REFBd0QsRTs7Ozs7V0NBckc7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJqc1xcY29tbW9uX2hlYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVWFQYXJzZXIgZnJvbSAndWEtcGFyc2VyLWpzJztcblxuY29uc3QgdWFQYXJzZXIgPSBuZXcgVWFQYXJzZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oIGNsYXNzTmFtZSApIHtcbiAgY29uc3RcbiAgICBlbGVtSHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgICxicm93c2VyID0gdWFQYXJzZXIuZ2V0QnJvd3NlcigpXG4gIDtcbiAgZWxlbUh0bWwuY2xhc3NMaXN0LmFkZCggY2xhc3NOYW1lICk7XG4gIGVsZW1IdG1sLmNsYXNzTGlzdC5hZGQoIGJyb3dzZXIubmFtZSArIGJyb3dzZXIubWFqb3IgKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICdleHBvc2UtbG9hZGVyP2V4cG9zZXNbXT1VYVBhcnNlciF1YS1wYXJzZXItanMnO1xuaW1wb3J0IGFkanVzdCBmcm9tICcuL19tb2R1bGVzL2FkanVzdC5qcyc7XG5cbmFkanVzdCggJ2pzJyApO1xuIiwidmFyIF9fX0VYUE9TRV9MT0FERVJfSU1QT1JUX19fID0gcmVxdWlyZShcIi0hLi91YS1wYXJzZXIuanNcIik7XG52YXIgX19fRVhQT1NFX0xPQURFUl9HRVRfR0xPQkFMX1RISVNfX18gPSByZXF1aXJlKFwiLi4vLi4vZXhwb3NlLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0R2xvYmFsVGhpcy5qc1wiKTtcbnZhciBfX19FWFBPU0VfTE9BREVSX0dMT0JBTF9USElTX19fID0gX19fRVhQT1NFX0xPQURFUl9HRVRfR0xPQkFMX1RISVNfX187XG5pZiAodHlwZW9mIF9fX0VYUE9TRV9MT0FERVJfR0xPQkFMX1RISVNfX19bXCJVYVBhcnNlclwiXSA9PT0gJ3VuZGVmaW5lZCcpIF9fX0VYUE9TRV9MT0FERVJfR0xPQkFMX1RISVNfX19bXCJVYVBhcnNlclwiXSA9IF9fX0VYUE9TRV9MT0FERVJfSU1QT1JUX19fO1xuZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1tleHBvc2VzLWxvYWRlcl0gVGhlIFwiVWFQYXJzZXJcIiB2YWx1ZSBleGlzdHMgaW4gdGhlIGdsb2JhbCBzY29wZSwgaXQgbWF5IG5vdCBiZSBzYWZlIHRvIG92ZXJ3cml0ZSBpdCwgdXNlIHRoZSBcIm92ZXJyaWRlXCIgb3B0aW9uJylcbm1vZHVsZS5leHBvcnRzID0gX19fRVhQT1NFX0xPQURFUl9JTVBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09IFwib2JqZWN0XCIpIHtcbiAgICByZXR1cm4gZ2xvYmFsVGhpcztcbiAgfVxuXG4gIHZhciBnO1xuXG4gIHRyeSB7XG4gICAgLy8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgZyA9IHRoaXMgfHwgbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHJldHVybiB3aW5kb3c7XG4gICAgfSAvLyBUaGlzIHdvcmtzIGlmIHRoZSBzZWxmIHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblxuXG4gICAgaWYgKHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiKSB7XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9IC8vIFRoaXMgd29ya3MgaWYgdGhlIGdsb2JhbCByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cblxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gZ2xvYmFsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBnO1xufSgpOyIsIi8qIVxuICogVUFQYXJzZXIuanMgdjAuNy4yM1xuICogTGlnaHR3ZWlnaHQgSmF2YVNjcmlwdC1iYXNlZCBVc2VyLUFnZW50IHN0cmluZyBwYXJzZXJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWlzYWxtYW4vdWEtcGFyc2VyLWpzXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTItMjAxOSBGYWlzYWwgU2FsbWFuIDxmQGZhaXNhbG1hbi5jb20+XG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgTGljZW5zZVxuICovXG5cbihmdW5jdGlvbiAod2luZG93LCB1bmRlZmluZWQpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQ29uc3RhbnRzXG4gICAgLy8vLy8vLy8vLy8vL1xuXG5cbiAgICB2YXIgTElCVkVSU0lPTiAgPSAnMC43LjIzJyxcbiAgICAgICAgRU1QVFkgICAgICAgPSAnJyxcbiAgICAgICAgVU5LTk9XTiAgICAgPSAnPycsXG4gICAgICAgIEZVTkNfVFlQRSAgID0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgVU5ERUZfVFlQRSAgPSAndW5kZWZpbmVkJyxcbiAgICAgICAgT0JKX1RZUEUgICAgPSAnb2JqZWN0JyxcbiAgICAgICAgU1RSX1RZUEUgICAgPSAnc3RyaW5nJyxcbiAgICAgICAgTUFKT1IgICAgICAgPSAnbWFqb3InLCAvLyBkZXByZWNhdGVkXG4gICAgICAgIE1PREVMICAgICAgID0gJ21vZGVsJyxcbiAgICAgICAgTkFNRSAgICAgICAgPSAnbmFtZScsXG4gICAgICAgIFRZUEUgICAgICAgID0gJ3R5cGUnLFxuICAgICAgICBWRU5ET1IgICAgICA9ICd2ZW5kb3InLFxuICAgICAgICBWRVJTSU9OICAgICA9ICd2ZXJzaW9uJyxcbiAgICAgICAgQVJDSElURUNUVVJFPSAnYXJjaGl0ZWN0dXJlJyxcbiAgICAgICAgQ09OU09MRSAgICAgPSAnY29uc29sZScsXG4gICAgICAgIE1PQklMRSAgICAgID0gJ21vYmlsZScsXG4gICAgICAgIFRBQkxFVCAgICAgID0gJ3RhYmxldCcsXG4gICAgICAgIFNNQVJUVFYgICAgID0gJ3NtYXJ0dHYnLFxuICAgICAgICBXRUFSQUJMRSAgICA9ICd3ZWFyYWJsZScsXG4gICAgICAgIEVNQkVEREVEICAgID0gJ2VtYmVkZGVkJztcblxuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBIZWxwZXJcbiAgICAvLy8vLy8vLy8vXG5cblxuICAgIHZhciB1dGlsID0ge1xuICAgICAgICBleHRlbmQgOiBmdW5jdGlvbiAocmVnZXhlcywgZXh0ZW5zaW9ucykge1xuICAgICAgICAgICAgdmFyIG1lcmdlZFJlZ2V4ZXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcmVnZXhlcykge1xuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25zW2ldICYmIGV4dGVuc2lvbnNbaV0ubGVuZ3RoICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtZXJnZWRSZWdleGVzW2ldID0gZXh0ZW5zaW9uc1tpXS5jb25jYXQocmVnZXhlc1tpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkUmVnZXhlc1tpXSA9IHJlZ2V4ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lcmdlZFJlZ2V4ZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGhhcyA6IGZ1bmN0aW9uIChzdHIxLCBzdHIyKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBzdHIxID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyMi50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc3RyMS50b0xvd2VyQ2FzZSgpKSAhPT0gLTE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGxvd2VyaXplIDogZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuICAgICAgICBtYWpvciA6IGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mKHZlcnNpb24pID09PSBTVFJfVFlQRSA/IHZlcnNpb24ucmVwbGFjZSgvW15cXGRcXC5dL2csJycpLnNwbGl0KFwiLlwiKVswXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgdHJpbSA6IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBNYXAgaGVscGVyXG4gICAgLy8vLy8vLy8vLy8vLy9cblxuXG4gICAgdmFyIG1hcHBlciA9IHtcblxuICAgICAgICByZ3ggOiBmdW5jdGlvbiAodWEsIGFycmF5cykge1xuXG4gICAgICAgICAgICB2YXIgaSA9IDAsIGosIGssIHAsIHEsIG1hdGNoZXMsIG1hdGNoO1xuXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIHJlZ2V4ZXMgbWFwc1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBhcnJheXMubGVuZ3RoICYmICFtYXRjaGVzKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVnZXggPSBhcnJheXNbaV0sICAgICAgIC8vIGV2ZW4gc2VxdWVuY2UgKDAsMiw0LC4uKVxuICAgICAgICAgICAgICAgICAgICBwcm9wcyA9IGFycmF5c1tpICsgMV07ICAgLy8gb2RkIHNlcXVlbmNlICgxLDMsNSwuLilcbiAgICAgICAgICAgICAgICBqID0gayA9IDA7XG5cbiAgICAgICAgICAgICAgICAvLyB0cnkgbWF0Y2hpbmcgdWFzdHJpbmcgd2l0aCByZWdleGVzXG4gICAgICAgICAgICAgICAgd2hpbGUgKGogPCByZWdleC5sZW5ndGggJiYgIW1hdGNoZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhbaisrXS5leGVjKHVhKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISFtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IG1hdGNoZXNbKytrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gcHJvcHNbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgZ2l2ZW4gcHJvcGVydHkgaXMgYWN0dWFsbHkgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHEgPT09IE9CSl9UWVBFICYmIHEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxWzFdID09IEZVTkNfVFlQRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBtb2RpZmllZCBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBxWzFdLmNhbGwodGhpcywgbWF0Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24gZ2l2ZW4gdmFsdWUsIGlnbm9yZSByZWdleCBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBxWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHEubGVuZ3RoID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgZnVuY3Rpb24gb3IgcmVnZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcVsxXSA9PT0gRlVOQ19UWVBFICYmICEocVsxXS5leGVjICYmIHFbMV0udGVzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIGZ1bmN0aW9uICh1c3VhbGx5IHN0cmluZyBtYXBwZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gcVsxXS5jYWxsKHRoaXMsIG1hdGNoLCBxWzJdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2FuaXRpemUgbWF0Y2ggdXNpbmcgZ2l2ZW4gcmVnZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBtYXRjaC5yZXBsYWNlKHFbMV0sIHFbMl0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHEubGVuZ3RoID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gbWF0Y2ggPyBxWzNdLmNhbGwodGhpcywgbWF0Y2gucmVwbGFjZShxWzFdLCBxWzJdKSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FdID0gbWF0Y2ggPyBtYXRjaCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0ciA6IGZ1bmN0aW9uIChzdHIsIG1hcCkge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG1hcCkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGFycmF5XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtYXBbaV0gPT09IE9CSl9UWVBFICYmIG1hcFtpXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWFwW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXRpbC5oYXMobWFwW2ldW2pdLCBzdHIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHV0aWwuaGFzKG1hcFtpXSwgc3RyKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGkgPT09IFVOS05PV04pID8gdW5kZWZpbmVkIDogaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gU3RyaW5nIG1hcFxuICAgIC8vLy8vLy8vLy8vLy8vXG5cblxuICAgIHZhciBtYXBzID0ge1xuXG4gICAgICAgIGJyb3dzZXIgOiB7XG4gICAgICAgICAgICBvbGRzYWZhcmkgOiB7XG4gICAgICAgICAgICAgICAgdmVyc2lvbiA6IHtcbiAgICAgICAgICAgICAgICAgICAgJzEuMCcgICA6ICcvOCcsXG4gICAgICAgICAgICAgICAgICAgICcxLjInICAgOiAnLzEnLFxuICAgICAgICAgICAgICAgICAgICAnMS4zJyAgIDogJy8zJyxcbiAgICAgICAgICAgICAgICAgICAgJzIuMCcgICA6ICcvNDEyJyxcbiAgICAgICAgICAgICAgICAgICAgJzIuMC4yJyA6ICcvNDE2JyxcbiAgICAgICAgICAgICAgICAgICAgJzIuMC4zJyA6ICcvNDE3JyxcbiAgICAgICAgICAgICAgICAgICAgJzIuMC40JyA6ICcvNDE5JyxcbiAgICAgICAgICAgICAgICAgICAgJz8nICAgICA6ICcvJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZXZpY2UgOiB7XG4gICAgICAgICAgICBhbWF6b24gOiB7XG4gICAgICAgICAgICAgICAgbW9kZWwgOiB7XG4gICAgICAgICAgICAgICAgICAgICdGaXJlIFBob25lJyA6IFsnU0QnLCAnS0YnXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzcHJpbnQgOiB7XG4gICAgICAgICAgICAgICAgbW9kZWwgOiB7XG4gICAgICAgICAgICAgICAgICAgICdFdm8gU2hpZnQgNEcnIDogJzczNzNLVCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZlbmRvciA6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0hUQycgICAgICAgOiAnQVBBJyxcbiAgICAgICAgICAgICAgICAgICAgJ1NwcmludCcgICAgOiAnU3ByaW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBvcyA6IHtcbiAgICAgICAgICAgIHdpbmRvd3MgOiB7XG4gICAgICAgICAgICAgICAgdmVyc2lvbiA6IHtcbiAgICAgICAgICAgICAgICAgICAgJ01FJyAgICAgICAgOiAnNC45MCcsXG4gICAgICAgICAgICAgICAgICAgICdOVCAzLjExJyAgIDogJ05UMy41MScsXG4gICAgICAgICAgICAgICAgICAgICdOVCA0LjAnICAgIDogJ05UNC4wJyxcbiAgICAgICAgICAgICAgICAgICAgJzIwMDAnICAgICAgOiAnTlQgNS4wJyxcbiAgICAgICAgICAgICAgICAgICAgJ1hQJyAgICAgICAgOiBbJ05UIDUuMScsICdOVCA1LjInXSxcbiAgICAgICAgICAgICAgICAgICAgJ1Zpc3RhJyAgICAgOiAnTlQgNi4wJyxcbiAgICAgICAgICAgICAgICAgICAgJzcnICAgICAgICAgOiAnTlQgNi4xJyxcbiAgICAgICAgICAgICAgICAgICAgJzgnICAgICAgICAgOiAnTlQgNi4yJyxcbiAgICAgICAgICAgICAgICAgICAgJzguMScgICAgICAgOiAnTlQgNi4zJyxcbiAgICAgICAgICAgICAgICAgICAgJzEwJyAgICAgICAgOiBbJ05UIDYuNCcsICdOVCAxMC4wJ10sXG4gICAgICAgICAgICAgICAgICAgICdSVCcgICAgICAgIDogJ0FSTSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vL1xuICAgIC8vIFJlZ2V4IG1hcFxuICAgIC8vLy8vLy8vLy8vLy9cblxuXG4gICAgdmFyIHJlZ2V4ZXMgPSB7XG5cbiAgICAgICAgYnJvd3NlciA6IFtbXG5cbiAgICAgICAgICAgIC8vIFByZXN0byBiYXNlZFxuICAgICAgICAgICAgLyhvcGVyYVxcc21pbmkpXFwvKFtcXHdcXC4tXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgTWluaVxuICAgICAgICAgICAgLyhvcGVyYVxcc1ttb2JpbGV0YWJdezMsNn0pLit2ZXJzaW9uXFwvKFtcXHdcXC4tXSspL2ksICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgTW9iaS9UYWJsZXRcbiAgICAgICAgICAgIC8ob3BlcmEpLit2ZXJzaW9uXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgPiA5LjgwXG4gICAgICAgICAgICAvKG9wZXJhKVtcXC9cXHNdKyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSA8IDkuODBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKG9waW9zKVtcXC9cXHNdKyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBtaW5pIG9uIGlwaG9uZSA+PSA4LjBcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ09wZXJhIE1pbmknXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL1xccyhvcHIpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgV2Via2l0XG4gICAgICAgICAgICBdLCBbW05BTUUsICdPcGVyYSddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvLyBNaXhlZFxuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC8obHVuYXNjYXBlfG1heHRob258bmV0ZnJvbnR8amFzbWluZXxibGF6ZXIpW1xcL1xcc10/KFtcXHdcXC5dKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTHVuYXNjYXBlL01heHRob24vTmV0ZnJvbnQvSmFzbWluZS9CbGF6ZXJcbiAgICAgICAgICAgIC8vIFRyaWRlbnQgYmFzZWRcbiAgICAgICAgICAgIC8oYXZhbnRcXHN8aWVtb2JpbGV8c2xpbSkoPzpicm93c2VyKT9bXFwvXFxzXT8oW1xcd1xcLl0qKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBdmFudC9JRU1vYmlsZS9TbGltQnJvd3NlclxuICAgICAgICAgICAgLyhiaWR1YnJvd3NlcnxiYWlkdWJyb3dzZXIpW1xcL1xcc10/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgLy8gQmFpZHUgQnJvd3NlclxuICAgICAgICAgICAgLyg/Om1zfFxcKCkoaWUpXFxzKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXJcblxuICAgICAgICAgICAgLy8gV2Via2l0L0tIVE1MIGJhc2VkXG4gICAgICAgICAgICAvKHJla29ucSlcXC8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJla29ucVxuICAgICAgICAgICAgLyhjaHJvbWl1bXxmbG9ja3xyb2NrbWVsdHxtaWRvcml8ZXBpcGhhbnl8c2lsa3xza3lmaXJlfG92aWJyb3dzZXJ8Ym9sdHxpcm9ufHZpdmFsZGl8aXJpZGl1bXxwaGFudG9tanN8Ym93c2VyfHF1YXJrfHF1cHppbGxhfGZhbGtvbilcXC8oW1xcd1xcLi1dKykvaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWl1bS9GbG9jay9Sb2NrTWVsdC9NaWRvcmkvRXBpcGhhbnkvU2lsay9Ta3lmaXJlL0JvbHQvSXJvbi9JcmlkaXVtL1BoYW50b21KUy9Cb3dzZXIvUXVwWmlsbGEvRmFsa29uXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhrb25xdWVyb3IpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLb25xdWVyb3JcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0tvbnF1ZXJvciddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKHRyaWRlbnQpLitydls6XFxzXShbXFx3XFwuXXsxLDl9KS4rbGlrZVxcc2dlY2tvL2kgICAgICAgICAgICAgICAgICAgICAvLyBJRTExXG4gICAgICAgICAgICBdLCBbW05BTUUsICdJRSddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKGVkZ2V8ZWRnaW9zfGVkZ2F8ZWRnKVxcLygoXFxkKyk/W1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgRWRnZVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnRWRnZSddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKHlhYnJvd3NlcilcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFlhbmRleFxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnWWFuZGV4J10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oQXZhc3QpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXZhc3QgU2VjdXJlIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0F2YXN0IFNlY3VyZSBCcm93c2VyJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oQVZHKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVZHIFNlY3VyZSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbW05BTUUsICdBVkcgU2VjdXJlIEJyb3dzZXInXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhwdWZmaW4pXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQdWZmaW5cbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ1B1ZmZpbiddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKGZvY3VzKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggRm9jdXNcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0ZpcmVmb3ggRm9jdXMnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhvcHQpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSBUb3VjaFxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnT3BlcmEgVG91Y2gnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLygoPzpbXFxzXFwvXSl1Yz9cXHM/YnJvd3NlcnwoPzpqdWMuKyl1Y3dlYilbXFwvXFxzXT8oW1xcd1xcLl0rKS9pICAgICAgICAgLy8gVUNCcm93c2VyXG4gICAgICAgICAgICBdLCBbW05BTUUsICdVQ0Jyb3dzZXInXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhjb21vZG9fZHJhZ29uKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21vZG8gRHJhZ29uXG4gICAgICAgICAgICBdLCBbW05BTUUsIC9fL2csICcgJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8od2luZG93c3dlY2hhdCBxYmNvcmUpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0IERlc2t0b3AgZm9yIFdpbmRvd3MgQnVpbHQtaW4gQnJvd3NlclxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnV2VDaGF0KFdpbikgRGVza3RvcCddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKG1pY3JvbWVzc2VuZ2VyKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlQ2hhdFxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnV2VDaGF0J10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oYnJhdmUpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQnJhdmUgYnJvd3NlclxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnQnJhdmUnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyh3aGFsZSlcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaGFsZSBicm93c2VyXG4gICAgICAgICAgICBdLCBbW05BTUUsICdXaGFsZSddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKHFxYnJvd3NlcmxpdGUpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFFRQnJvd3NlckxpdGVcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKFFRKVxcLyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFFRLCBha2EgU2hvdVFcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvbT8ocXFicm93c2VyKVtcXC9cXHNdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBRUUJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKGJhaWR1Ym94YXBwKVtcXC9cXHNdPyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCYWlkdSBBcHBcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKDIzNDVFeHBsb3JlcilbXFwvXFxzXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAyMzQ1IEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKE1ldGFTcilbXFwvXFxzXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb3VHb3VCcm93c2VyXG4gICAgICAgICAgICBdLCBbTkFNRV0sIFtcblxuICAgICAgICAgICAgLyhMQkJST1dTRVIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaWVCYW8gQnJvd3NlclxuICAgICAgICAgICAgXSwgW05BTUVdLCBbXG5cbiAgICAgICAgICAgIC94aWFvbWlcXC9taXVpYnJvd3NlclxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1JVUkgQnJvd3NlclxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnTUlVSSBCcm93c2VyJ11dLCBbXG5cbiAgICAgICAgICAgIC87ZmJhdlxcLyhbXFx3XFwuXSspOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmFjZWJvb2sgQXBwIGZvciBpT1MgJiBBbmRyb2lkIHdpdGggdmVyc2lvblxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnRmFjZWJvb2snXV0sIFtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgL0ZCQU5cXC9GQklPU3xGQl9JQUJcXC9GQjRBL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZhY2Vib29rIEFwcCBmb3IgaU9TICYgQW5kcm9pZCB3aXRob3V0IHZlcnNpb25cbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0ZhY2Vib29rJ11dLCBbXG5cbiAgICAgICAgICAgIC9zYWZhcmlcXHMobGluZSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgQXBwIGZvciBpT1NcbiAgICAgICAgICAgIC9hbmRyb2lkLisobGluZSlcXC8oW1xcd1xcLl0rKVxcL2lhYi9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmUgQXBwIGZvciBBbmRyb2lkXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL2hlYWRsZXNzY2hyb21lKD86XFwvKFtcXHdcXC5dKyl8XFxzKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIEhlYWRsZXNzXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdDaHJvbWUgSGVhZGxlc3MnXV0sIFtcblxuICAgICAgICAgICAgL1xcc3d2XFwpLisoY2hyb21lKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBXZWJWaWV3XG4gICAgICAgICAgICBdLCBbW05BTUUsIC8oLispLywgJyQxIFdlYlZpZXcnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLygoPzpvY3VsdXN8c2Ftc3VuZylicm93c2VyKVxcLyhbXFx3XFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgLyguKyg/Omd8dXMpKSguKykvLCAnJDEgJDInXSwgVkVSU0lPTl0sIFsgICAgICAgICAgICAgICAgLy8gT2N1bHVzIC8gU2Ftc3VuZyBCcm93c2VyXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLit2ZXJzaW9uXFwvKFtcXHdcXC5dKylcXHMrKD86bW9iaWxlXFxzP3NhZmFyaXxzYWZhcmkpKi9pICAgICAgICAvLyBBbmRyb2lkIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0FuZHJvaWQgQnJvd3NlciddXSwgW1xuXG4gICAgICAgICAgICAvKHNhaWxmaXNoYnJvd3NlcilcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhaWxmaXNoIEJyb3dzZXJcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ1NhaWxmaXNoIEJyb3dzZXInXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhjaHJvbWV8b21uaXdlYnxhcm9yYXxbdGl6ZW5va2FdezV9XFxzP2Jyb3dzZXIpXFwvdj8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZS9PbW5pV2ViL0Fyb3JhL1RpemVuL05va2lhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhkb2xmaW4pXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2xwaGluXG4gICAgICAgICAgICBdLCBbW05BTUUsICdEb2xwaGluJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8ocWlodXxxaGJyb3dzZXJ8cWlob29icm93c2VyfDM2MGJyb3dzZXIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMzYwXG4gICAgICAgICAgICBdLCBbW05BTUUsICczNjAgQnJvd3NlciddXSwgW1xuXG4gICAgICAgICAgICAvKCg/OmFuZHJvaWQuKyljcm1vfGNyaW9zKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBmb3IgQW5kcm9pZC9pT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0Nocm9tZSddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKGNvYXN0KVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIENvYXN0XG4gICAgICAgICAgICBdLCBbW05BTUUsICdPcGVyYSBDb2FzdCddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvZnhpb3NcXC8oW1xcd1xcLi1dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggZm9yIGlPU1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnRmlyZWZveCddXSwgW1xuXG4gICAgICAgICAgICAvdmVyc2lvblxcLyhbXFx3XFwuXSspXFxzLiptb2JpbGVcXC9cXHcrXFxzKHNhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAgICAvLyBNb2JpbGUgU2FmYXJpXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdNb2JpbGUgU2FmYXJpJ11dLCBbXG5cbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHdcXC5dKylcXHMuKihtb2JpbGVcXHM/c2FmYXJpfHNhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgJiBTYWZhcmkgTW9iaWxlXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdC4rPyhnc2EpXFwvKFtcXHdcXC5dKylcXHMuKihtb2JpbGVcXHM/c2FmYXJpfHNhZmFyaSkoXFwvW1xcd1xcLl0rKS9pIC8vIEdvb2dsZSBTZWFyY2ggQXBwbGlhbmNlIG9uIGlPU1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAnR1NBJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC93ZWJraXQuKz8obW9iaWxlXFxzP3NhZmFyaXxzYWZhcmkpKFxcL1tcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSA8IDMuMFxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCBtYXBwZXIuc3RyLCBtYXBzLmJyb3dzZXIub2xkc2FmYXJpLnZlcnNpb25dXSwgW1xuXG4gICAgICAgICAgICAvKHdlYmtpdHxraHRtbClcXC8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLy8gR2Vja28gYmFzZWRcbiAgICAgICAgICAgIC8obmF2aWdhdG9yfG5ldHNjYXBlKVxcLyhbXFx3XFwuLV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV0c2NhcGVcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ05ldHNjYXBlJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKHN3aWZ0Zm94KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aWZ0Zm94XG4gICAgICAgICAgICAvKGljZWRyYWdvbnxpY2V3ZWFzZWx8Y2FtaW5vfGNoaW1lcmF8ZmVubmVjfG1hZW1vXFxzYnJvd3NlcnxtaW5pbW98Y29ua2Vyb3IpW1xcL1xcc10/KFtcXHdcXC5cXCtdKykvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWNlRHJhZ29uL0ljZXdlYXNlbC9DYW1pbm8vQ2hpbWVyYS9GZW5uZWMvTWFlbW8vTWluaW1vL0Nvbmtlcm9yXG4gICAgICAgICAgICAvKGZpcmVmb3h8c2VhbW9ua2V5fGstbWVsZW9ufGljZWNhdHxpY2VhcGV8ZmlyZWJpcmR8cGhvZW5peHxwYWxlbW9vbnxiYXNpbGlza3x3YXRlcmZveClcXC8oW1xcd1xcLi1dKykkL2ksXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveC9TZWFNb25rZXkvSy1NZWxlb24vSWNlQ2F0L0ljZUFwZS9GaXJlYmlyZC9QaG9lbml4XG4gICAgICAgICAgICAvKGZpcmVmb3gpXFwvKFtcXHdcXC5dKylcXHNbXFx3XFxzXFwtXStcXC9bXFx3XFwuXSskL2ksICAgICAgICAgICAgICAgICAgICAgICAvLyBPdGhlciBGaXJlZm94LWJhc2VkXG4gICAgICAgICAgICAvKG1vemlsbGEpXFwvKFtcXHdcXC5dKylcXHMuK3J2XFw6LitnZWNrb1xcL1xcZCsvaSwgICAgICAgICAgICAgICAgICAgICAgICAvLyBNb3ppbGxhXG5cbiAgICAgICAgICAgIC8vIE90aGVyXG4gICAgICAgICAgICAvKHBvbGFyaXN8bHlueHxkaWxsb3xpY2FifGRvcmlzfGFtYXlhfHczbXxuZXRzdXJmfHNsZWlwbmlyKVtcXC9cXHNdPyhbXFx3XFwuXSspL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBvbGFyaXMvTHlueC9EaWxsby9pQ2FiL0RvcmlzL0FtYXlhL3czbS9OZXRTdXJmL1NsZWlwbmlyXG4gICAgICAgICAgICAvKGxpbmtzKVxcc1xcKChbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW5rc1xuICAgICAgICAgICAgLyhnb2Jyb3dzZXIpXFwvPyhbXFx3XFwuXSopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb0Jyb3dzZXJcbiAgICAgICAgICAgIC8oaWNlXFxzP2Jyb3dzZXIpXFwvdj8oW1xcd1xcLl9dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElDRSBCcm93c2VyXG4gICAgICAgICAgICAvKG1vc2FpYylbXFwvXFxzXShbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNb3NhaWNcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXVxuICAgICAgICBdLFxuXG4gICAgICAgIGNwdSA6IFtbXG5cbiAgICAgICAgICAgIC8oPzooYW1kfHgoPzooPzo4Nnw2NClbXy1dKT98d293fHdpbik2NClbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgIC8vIEFNRDY0XG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FtZDY0J11dLCBbXG5cbiAgICAgICAgICAgIC8oaWEzMig/PTspKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMiAocXVpY2t0aW1lKVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIHV0aWwubG93ZXJpemVdXSwgW1xuXG4gICAgICAgICAgICAvKCg/OmlbMzQ2XXx4KTg2KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTMyXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2lhMzInXV0sIFtcblxuICAgICAgICAgICAgLy8gUG9ja2V0UEMgbWlzdGFrZW5seSBpZGVudGlmaWVkIGFzIFBvd2VyUENcbiAgICAgICAgICAgIC93aW5kb3dzXFxzKGNlfG1vYmlsZSk7XFxzcHBjOy9pXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ2FybSddXSwgW1xuXG4gICAgICAgICAgICAvKCg/OnBwY3xwb3dlcnBjKSg/OjY0KT8pKD86XFxzbWFjfDt8XFwpKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG93ZXJQQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIC9vd2VyLywgJycsIHV0aWwubG93ZXJpemVdXSwgW1xuXG4gICAgICAgICAgICAvKHN1bjRcXHcpWztcXCldL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU1BBUkNcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAnc3BhcmMnXV0sIFtcblxuICAgICAgICAgICAgLygoPzphdnIzMnxpYTY0KD89OykpfDY4ayg/PVxcKSl8YXJtKD86NjR8KD89dlxcZCtbO2xdKSl8KD89YXRtZWxcXHMpYXZyfCg/OmlyaXh8bWlwc3xzcGFyYykoPzo2NCk/KD89Oyl8cGEtcmlzYykvaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJQTY0LCA2OEssIEFSTS82NCwgQVZSLzMyLCBJUklYLzY0LCBNSVBTLzY0LCBTUEFSQy82NCwgUEEtUklTQ1xuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsIHV0aWwubG93ZXJpemVdXVxuICAgICAgICBdLFxuXG4gICAgICAgIGRldmljZSA6IFtbXG5cbiAgICAgICAgICAgIC9cXCgoaXBhZHxwbGF5Ym9vayk7W1xcd1xcc1xcKSw7LV0rKHJpbXxhcHBsZSkvaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQYWQvUGxheUJvb2tcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgVkVORE9SLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FwcGxlY29yZW1lZGlhXFwvW1xcd1xcLl0rIFxcKChpcGFkKS8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBhZFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQXBwbGUnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8oYXBwbGVcXHN7MCwxfXR2KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGxlIFRWXG4gICAgICAgICAgICBdLCBbW01PREVMLCAnQXBwbGUgVFYnXSwgW1ZFTkRPUiwgJ0FwcGxlJ10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcblxuICAgICAgICAgICAgLyhhcmNob3MpXFxzKGdhbWVwYWQyPykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJjaG9zXG4gICAgICAgICAgICAvKGhwKS4rKHRvdWNocGFkKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhQIFRvdWNoUGFkXG4gICAgICAgICAgICAvKGhwKS4rKHRhYmxldCkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhQIFRhYmxldFxuICAgICAgICAgICAgLyhraW5kbGUpXFwvKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGVcbiAgICAgICAgICAgIC9cXHMobm9vaylbXFx3XFxzXStidWlsZFxcLyhcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb29rXG4gICAgICAgICAgICAvKGRlbGwpXFxzKHN0cmVhW2twclxcc1xcZF0qW1xcZGtvXSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWxsIFN0cmVha1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvKGtmW0Etel0rKShcXHNidWlsZFxcL3xcXCkpLitzaWxrXFwvL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSBIRFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQW1hem9uJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhzZHxrZilbMDM0OWhpam9yc3R1d10rKFxcc2J1aWxkXFwvfFxcKSkuK3NpbGtcXC8vaSAgICAgICAgICAgICAgICAgICAgLy8gRmlyZSBQaG9uZVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgbWFwcGVyLnN0ciwgbWFwcy5kZXZpY2UuYW1hem9uLm1vZGVsXSwgW1ZFTkRPUiwgJ0FtYXpvbiddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9hbmRyb2lkLithZnQoW2Jtc10pXFxzYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmUgVFZcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FtYXpvbiddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG5cbiAgICAgICAgICAgIC9cXCgoaXBbaG9uZWR8XFxzXFx3Kl0rKTsuKyhhcHBsZSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBvZC9pUGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgVkVORE9SLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXCgoaXBbaG9uZWR8XFxzXFx3Kl0rKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBvZC9pUGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FwcGxlJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKGJsYWNrYmVycnkpW1xccy1dPyhcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeVxuICAgICAgICAgICAgLyhibGFja2JlcnJ5fGJlbnF8cGFsbSg/PVxcLSl8c29ueWVyaWNzc29ufGFjZXJ8YXN1c3xkZWxsfG1laXp1fG1vdG9yb2xhfHBvbHl0cm9uKVtcXHNfLV0/KFtcXHctXSopL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJlblEvUGFsbS9Tb255LUVyaWNzc29uL0FjZXIvQXN1cy9EZWxsL01laXp1L01vdG9yb2xhL1BvbHl0cm9uXG4gICAgICAgICAgICAvKGhwKVxccyhbXFx3XFxzXStcXHcpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIUCBpUEFRXG4gICAgICAgICAgICAvKGFzdXMpLT8oXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBc3VzXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvXFwoYmIxMDtcXHMoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgMTBcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0JsYWNrQmVycnknXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzdXMgVGFibGV0c1xuICAgICAgICAgICAgL2FuZHJvaWQuKyh0cmFuc2ZvW3ByaW1lXFxzXXs0LDEwfVxcc1xcdyt8ZWVlcGN8c2xpZGVyXFxzXFx3K3xuZXh1cyA3fHBhZGZvbmV8cDAwYykvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQXN1cyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLyhzb255KVxccyh0YWJsZXRcXHNbcHNdKVxcc2J1aWxkXFwvL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbnlcbiAgICAgICAgICAgIC8oc29ueSk/KD86c2dwLispXFxzYnVpbGRcXC8vaVxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdTb255J10sIFtNT0RFTCwgJ1hwZXJpYSBUYWJsZXQnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvYW5kcm9pZC4rXFxzKFtjLWddXFxkezR9fHNvWy1sXVxcdyspKD89XFxzYnVpbGRcXC98XFwpLitjaHJvbWVcXC8oPyFbMS02XXswLDF9XFxkXFwuKSkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU29ueSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgL1xccyhvdXlhKVxccy9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE91eWFcbiAgICAgICAgICAgIC8obmludGVuZG8pXFxzKFt3aWRzM3VdKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIENPTlNPTEVdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhzaGllbGQpXFxzYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTnZpZGlhXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdmlkaWEnXSwgW1RZUEUsIENPTlNPTEVdXSwgW1xuXG4gICAgICAgICAgICAvKHBsYXlzdGF0aW9uXFxzWzM0cG9ydGFibGV2aV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQbGF5c3RhdGlvblxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU29ueSddLCBbVFlQRSwgQ09OU09MRV1dLCBbXG5cbiAgICAgICAgICAgIC8oc3ByaW50XFxzKFxcdyspKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTcHJpbnQgUGhvbmVzXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgbWFwcGVyLnN0ciwgbWFwcy5kZXZpY2Uuc3ByaW50LnZlbmRvcl0sIFtNT0RFTCwgbWFwcGVyLnN0ciwgbWFwcy5kZXZpY2Uuc3ByaW50Lm1vZGVsXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8oaHRjKVs7X1xccy1dezEsMn0oW1xcd1xcc10rKD89XFwpfFxcc2J1aWxkKXxcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgLy8gSFRDXG4gICAgICAgICAgICAvKHp0ZSktKFxcdyopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaVEVcbiAgICAgICAgICAgIC8oYWxjYXRlbHxnZWVrc3Bob25lfG5leGlhbnxwYW5hc29uaWN8KD89O1xccylzb255KVtfXFxzLV0/KFtcXHctXSopL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxjYXRlbC9HZWVrc1Bob25lL05leGlhbi9QYW5hc29uaWMvU29ueVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW01PREVMLCAvXy9nLCAnICddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLyhuZXh1c1xcczkpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFRDIE5leHVzIDlcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0hUQyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2RcXC9odWF3ZWkoW1xcd1xccy1dKylbO1xcKV0vaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSHVhd2VpXG4gICAgICAgICAgICAvYW5kcm9pZC4rXFxzKG5leHVzXFxzNnB8dm9nLVthdF0/bFxcZFxcZHxhbmUtW2F0XT9sW3hcXGRdXFxkfGVtbC1hP2xcXGRcXGRhP3xseWEtW2F0XT9sXFxkW1xcZGNdfGNsdC1hP2xcXGRcXGRpPykvaVxuXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdIdWF3ZWknXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLisoYmFoMj8tYT9bbHddXFxkezJ9KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEh1YXdlaSBNZWRpYVBhZFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnSHVhd2VpJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvKG1pY3Jvc29mdCk7XFxzKGx1bWlhW1xcc1xcd10rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBMdW1pYVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvW1xcc1xcKDtdKHhib3goPzpcXHNvbmUpPylbXFxzXFwpO10vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IFhib3hcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ01pY3Jvc29mdCddLCBbVFlQRSwgQ09OU09MRV1dLCBbXG4gICAgICAgICAgICAvKGtpblxcLltvbmV0d117M30pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgS2luXG4gICAgICAgICAgICBdLCBbW01PREVMLCAvXFwuL2csICcgJ10sIFtWRU5ET1IsICdNaWNyb3NvZnQnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTW90b3JvbGFcbiAgICAgICAgICAgIC9cXHMobWlsZXN0b25lfGRyb2lkKD86WzItNHhdfFxccyg/OmJpb25pY3x4Mnxwcm98cmF6cikpPzo/KFxcczRnKT8pW1xcd1xcc10rYnVpbGRcXC8vaSxcbiAgICAgICAgICAgIC9tb3RbXFxzLV0/KFxcdyopL2ksXG4gICAgICAgICAgICAvKFhUXFxkezMsNH0pIGJ1aWxkXFwvL2ksXG4gICAgICAgICAgICAvKG5leHVzXFxzNikvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTW90b3JvbGEnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvYW5kcm9pZC4rXFxzKG16NjBcXGR8eG9vbVtcXHMyXXswLDJ9KVxcc2J1aWxkXFwvL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ01vdG9yb2xhJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvaGJidHZcXC9cXGQrXFwuXFxkK1xcLlxcZCtcXHMrXFwoW1xcd1xcc10qO1xccyooXFx3W147XSopOyhbXjtdKikvaSAgICAgICAgICAgIC8vIEhiYlRWIGRldmljZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCB1dGlsLnRyaW1dLCBbTU9ERUwsIHV0aWwudHJpbV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcblxuICAgICAgICAgICAgL2hiYnR2LittYXBsZTsoXFxkKykvaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL14vLCAnU21hcnRUViddLCBbVkVORE9SLCAnU2Ftc3VuZyddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG5cbiAgICAgICAgICAgIC9cXChkdHZbXFwpO10uKyhhcXVvcykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaGFycFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU2hhcnAnXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rKChzY2gtaVs4OV0wXFxkfHNody1tMzgwc3xTTS1QNjA1fFNNLVA2MTB8Z3QtcFxcZHs0fXxndC1uXFxkK3xzZ2gtdDhbNTZdOXxuZXh1cyAxMCkpL2ksXG4gICAgICAgICAgICAvKChTTS1UXFx3KykpL2lcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnU2Ftc3VuZyddLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZ1xuICAgICAgICAgICAgL3NtYXJ0LXR2Lisoc2Ftc3VuZykvaVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgW1RZUEUsIFNNQVJUVFZdLCBNT0RFTF0sIFtcbiAgICAgICAgICAgIC8oKHNbY2dwXWgtXFx3K3xndC1cXHcrfGdhbGF4eVxcc25leHVzfHNtLVxcd1tcXHdcXGRdKykpL2ksXG4gICAgICAgICAgICAvKHNhbVtzdW5nXSopW1xccy1dKihcXHcrLT9bXFx3LV0qKS9pLFxuICAgICAgICAgICAgL3NlYy0oKHNnaFxcdyspKS9pXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ1NhbXN1bmcnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvc2llLShcXHcqKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaWVtZW5zXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTaWVtZW5zJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKG1hZW1vfG5va2lhKS4qKG45MDB8bHVtaWFcXHNcXGQrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm9raWFcbiAgICAgICAgICAgIC8obm9raWEpW1xcc18tXT8oW1xcdy1dKikvaVxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdOb2tpYSddLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkW3hcXGRcXC5cXHM7XStcXHMoW2FiXVsxLTddXFwtP1swMTc4YV1cXGRcXGQ/KS9pICAgICAgICAgICAgICAgICAgIC8vIEFjZXJcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FjZXInXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLisoW3ZsXWtcXC0/XFxkezN9KVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTEcgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdMRyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9hbmRyb2lkXFxzM1xcLltcXHNcXHc7LV17MTB9KGxnPyktKFswNmN2OV17Myw0fSkvaSAgICAgICAgICAgICAgICAgICAgIC8vIExHIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdMRyddLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvbGludXg7XFxzbmV0Y2FzdC4rc21hcnR0di9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMRyBTbWFydFRWXG4gICAgICAgICAgICAvbGdcXHNuZXRjYXN0XFwudHYtMjAxXFxkL2lcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnTEcnXSwgTU9ERUwsIFtUWVBFLCBTTUFSVFRWXV0sIFtcbiAgICAgICAgICAgIC8obmV4dXNcXHNbNDVdKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExHXG4gICAgICAgICAgICAvbGdbZTtcXHNcXC8tXSsoXFx3KikvaSxcbiAgICAgICAgICAgIC9hbmRyb2lkLitsZyhcXC0/W1xcZFxcd10rKVxccytidWlsZC9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdMRyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLyhsZW5vdm8pXFxzPyhzKD86NTAwMHw2MDAwKSg/OltcXHctXSspfHRhYig/OltcXHNcXHddKykpL2kgICAgICAgICAgICAgLy8gTGVub3ZvIHRhYmxldHNcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9hbmRyb2lkLisoaWRlYXRhYlthLXowLTlcXC1cXHNdKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZW5vdm9cbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0xlbm92byddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obGVub3ZvKVtfXFxzLV0/KFtcXHctXSspL2lcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgL2xpbnV4Oy4rKChqb2xsYSkpOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKb2xsYVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKChwZWJibGUpKWFwcFxcL1tcXGRcXC5dK1xccy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQZWJibGVcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhvcHBvKVxccz8oW1xcd1xcc10rKVxcc2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT1BQT1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvY3JrZXkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBDaHJvbWVjYXN0XG4gICAgICAgICAgICBdLCBbW01PREVMLCAnQ2hyb21lY2FzdCddLCBbVkVORE9SLCAnR29vZ2xlJ10sIFtUWVBFLCBTTUFSVFRWXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuKztcXHMoZ2xhc3MpXFxzXFxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgR2xhc3NcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0dvb2dsZSddLCBbVFlQRSwgV0VBUkFCTEVdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhwaXhlbCBjKVtcXHMpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsIENcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0dvb2dsZSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuKztcXHMocGl4ZWwoIFsyLTldYT8pPyggeGwpPylbXFxzKV0vaSAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBQaXhlbFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnR29vZ2xlJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhcXHcrKVxccytidWlsZFxcL2htXFwxL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWGlhb21pIEhvbmdtaSAnbnVtZXJpYycgbW9kZWxzXG4gICAgICAgICAgICAvYW5kcm9pZC4rKGhtW1xcc1xcLV9dP25vdGU/W1xcc19dPyg/OlxcZFxcdyk/KVxcc2J1aWxkL2ksICAgICAgICAgICAgICAgIC8vIFhpYW9taSBIb25nbWlcbiAgICAgICAgICAgIC9hbmRyb2lkLisocmVkbWlbXFxzXFwtX10/KD86bm90ZXxrKT8oPzpbXFxzX10/W1xcd1xcc10rKSkoPzpcXHNidWlsZHxcXCkpL2ksICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBSZWRtaVxuICAgICAgICAgICAgL2FuZHJvaWQuKyhtaVtcXHNcXC1fXT8oPzphXFxkfG9uZXxvbmVbXFxzX11wbHVzfG5vdGUgbHRlKT9bXFxzX10/KD86XFxkP1xcdz8pW1xcc19dPyg/OnBsdXMpPylcXHNidWlsZC9pICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBYaWFvbWkgTWlcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsICdYaWFvbWknXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvYW5kcm9pZC4rKG1pW1xcc1xcLV9dPyg/OnBhZCkoPzpbXFxzX10/W1xcd1xcc10rKSkoPzpcXHNidWlsZHxcXCkpL2kgICAgIC8vIE1pIFBhZCB0YWJsZXRzXG4gICAgICAgICAgICBdLFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsICdYaWFvbWknXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhtWzEtNV1cXHNub3RlKVxcc2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1laXp1XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdNZWl6dSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8obXopLShbXFx3LV17Mix9KS9pXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ01laXp1J10sIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK2EwMDAoMSlcXHMrYnVpbGQvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25lUGx1c1xuICAgICAgICAgICAgL2FuZHJvaWQuK29uZXBsdXNcXHMoYVxcZHs0fSlbXFxzKV0vaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnT25lUGx1cyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooUkNUW1xcZFxcd10rKVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJDQSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSQ0EnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL1xcc10oVmVudWVbXFxkXFxzXXsyLDd9KVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWxsIFZlbnVlIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0RlbGwnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMqKFFbVHxNXVtcXGRcXHddKylcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWZXJpem9uIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnVmVyaXpvbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccysoQmFybmVzWyZcXHNdK05vYmxlXFxzK3xCTltSVF0pKFY/LiopXFxzK2J1aWxkL2kgICAgIC8vIEJhcm5lcyAmIE5vYmxlIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdCYXJuZXMgJiBOb2JsZSddLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMrKFRNXFxkezN9LipcXGIpXFxzK2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCYXJuZXMgJiBOb2JsZSBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ051VmlzaW9uJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhrODgpXFxzYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWlRFIEsgU2VyaWVzIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWlRFJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihnZW5cXGR7M30pXFxzK2J1aWxkLio0OWgvaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lzcyBHRU4gTW9iaWxlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTd2lzcyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooenVyXFxkezN9KVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpc3MgWlVSIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU3dpc3MnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMqKChaZWtpKT9UQi4qXFxiKVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpla2kgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWmVraSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLyhhbmRyb2lkKS4rWztcXC9dXFxzKyhbWVJdXFxkezJ9KVxccytidWlsZC9pLFxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccysoRHJhZ29uW1xcLVxcc10rVG91Y2hcXHMrfERUKShcXHd7NX0pXFxzYnVpbGQvaSAgICAgICAgLy8gRHJhZ29uIFRvdWNoIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdEcmFnb24gVG91Y2gnXSwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihOUy0/XFx3ezAsOX0pXFxzYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnNpZ25pYSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdJbnNpZ25pYSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooKE5YfE5leHQpLT9cXHd7MCw5fSlcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgLy8gTmV4dEJvb2sgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTmV4dEJvb2snXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMqKFh0cmVtZVxcXyk/KFYoMVswNDVdfDJbMDE1XXwzMHw0MHw2MHw3WzA1XXw5MCkpXFxzK2J1aWxkL2lcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnVm9pY2UnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgWyAgICAgICAgICAgICAgICAgICAgLy8gVm9pY2UgWHRyZW1lIFBob25lc1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihMVlRFTFxcLSk/KFYxWzEyXSlcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgIC8vIEx2VGVsIFBob25lc1xuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdMdlRlbCddLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLis7XFxzKFBILTEpXFxzL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0Vzc2VudGlhbCddLCBbVFlQRSwgTU9CSUxFXV0sIFsgICAgICAgICAgICAgICAgLy8gRXNzZW50aWFsIFBILTFcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooVigxMDBNRHw3MDBOQXw3MDExfDkxN0cpLipcXGIpXFxzK2J1aWxkL2kgICAgICAgICAgLy8gRW52aXplbiBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdFbnZpemVuJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihMZVtcXHNcXC1dK1BhbilbXFxzXFwtXSsoXFx3ezEsOX0pXFxzK2J1aWxkL2kgICAgICAgICAgLy8gTGUgUGFuIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooVHJpb1tcXHNcXHdcXC1cXC5dKylcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFjaFNwZWVkIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ01hY2hTcGVlZCddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooVHJpbml0eSlbXFwtXFxzXSooVFxcZHszfSlcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAvLyBUcmluaXR5IFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccypUVV8oMTQ5MSlcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSb3RvciBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdSb3RvciddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLy9hbmRyb2lkLisoS1MoLispKVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFtYXpvbiBLaW5kbGUgVGFibGV0c1xuICAgICAgICAgICAgLy9dLCBbTU9ERUwsIFtWRU5ET1IsICdBbWF6b24nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLisoR2lnYXNldClbXFxzXFwtXSsoUVxcd3sxLDl9KVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgIC8vIEdpZ2FzZXQgVGFibGV0c1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbmRyb2lkIFBob25lcyBmcm9tIFVuaWRlbnRpZmllZCBWZW5kb3JzXG4gICAgICAgICAgICAvYW5kcm9pZCAuKz87IChbXjtdKz8pKD86IGJ1aWxkfFxcKSBhcHBsZXdlYmtpdCkuKz8gbW9iaWxlIHNhZmFyaS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbmRyb2lkIFRhYmxldHMgZnJvbSBVbmlkZW50aWZpZWQgVmVuZG9yc1xuICAgICAgICAgICAgL2FuZHJvaWQgLis/O1xccyhbXjtdKz8pKD86IGJ1aWxkfFxcKSBhcHBsZXdlYmtpdCkuKz8oPyEgbW9iaWxlKSBzYWZhcmkvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL1xccyh0YWJsZXR8dGFiKVs7XFwvXS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVuaWRlbnRpZmlhYmxlIFRhYmxldFxuICAgICAgICAgICAgL1xccyhtb2JpbGUpKD86WztcXC9dfFxcc3NhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVbmlkZW50aWZpYWJsZSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgdXRpbC5sb3dlcml6ZV0sIFZFTkRPUiwgTU9ERUxdLCBbXG5cbiAgICAgICAgICAgIC9bXFxzXFwvXFwoXShzbWFydC0/dHYpWztcXCldL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNtYXJ0VFZcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgU01BUlRUVl1dLCBbXG5cbiAgICAgICAgICAgIC8oYW5kcm9pZFtcXHdcXC5cXHNcXC1dezAsOX0pOy4rYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdlbmVyaWMgQW5kcm9pZCBEZXZpY2VcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0dlbmVyaWMnXV1cbiAgICAgICAgXSxcblxuICAgICAgICBlbmdpbmUgOiBbW1xuXG4gICAgICAgICAgICAvd2luZG93cy4rXFxzZWRnZVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFZGdlSFRNTFxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnRWRnZUhUTUwnXV0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdFxcLzUzN1xcLjM2LitjaHJvbWVcXC8oPyEyNykoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsaW5rXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdCbGluayddXSwgW1xuXG4gICAgICAgICAgICAvKHByZXN0bylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXN0b1xuICAgICAgICAgICAgLyh3ZWJraXR8dHJpZGVudHxuZXRmcm9udHxuZXRzdXJmfGFtYXlhfGx5bnh8dzNtfGdvYW5uYSlcXC8oW1xcd1xcLl0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZWJLaXQvVHJpZGVudC9OZXRGcm9udC9OZXRTdXJmL0FtYXlhL0x5bngvdzNtL0dvYW5uYVxuICAgICAgICAgICAgLyhraHRtbHx0YXNtYW58bGlua3MpW1xcL1xcc11cXCg/KFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtIVE1ML1Rhc21hbi9MaW5rc1xuICAgICAgICAgICAgLyhpY2FiKVtcXC9cXHNdKFsyM11cXC5bXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlDYWJcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvcnZcXDooW1xcd1xcLl17MSw5fSkuKyhnZWNrbykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdlY2tvXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV1cbiAgICAgICAgXSxcblxuICAgICAgICBvcyA6IFtbXG5cbiAgICAgICAgICAgIC8vIFdpbmRvd3MgYmFzZWRcbiAgICAgICAgICAgIC9taWNyb3NvZnRcXHMod2luZG93cylcXHModmlzdGF8eHApL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIChpVHVuZXMpXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8od2luZG93cylcXHNudFxcczZcXC4yO1xccyhhcm0pL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgUlRcbiAgICAgICAgICAgIC8od2luZG93c1xcc3Bob25lKD86XFxzb3MpKilbXFxzXFwvXT8oW1xcZFxcLlxcc1xcd10qKS9pLCAgICAgICAgICAgICAgICAgICAvLyBXaW5kb3dzIFBob25lXG4gICAgICAgICAgICAvKHdpbmRvd3NcXHNtb2JpbGV8d2luZG93cylbXFxzXFwvXT8oW250Y2VcXGRcXC5cXHNdK1xcdykvaVxuICAgICAgICAgICAgXSwgW05BTUUsIFtWRVJTSU9OLCBtYXBwZXIuc3RyLCBtYXBzLm9zLndpbmRvd3MudmVyc2lvbl1dLCBbXG4gICAgICAgICAgICAvKHdpbig/PTN8OXxuKXx3aW5cXHM5eFxccykoW250XFxkXFwuXSspL2lcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ1dpbmRvd3MnXSwgW1ZFUlNJT04sIG1hcHBlci5zdHIsIG1hcHMub3Mud2luZG93cy52ZXJzaW9uXV0sIFtcblxuICAgICAgICAgICAgLy8gTW9iaWxlL0VtYmVkZGVkIE9TXG4gICAgICAgICAgICAvXFwoKGJiKSgxMCk7L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IDEwXG4gICAgICAgICAgICBdLCBbW05BTUUsICdCbGFja0JlcnJ5J10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKGJsYWNrYmVycnkpXFx3KlxcLz8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja2JlcnJ5XG4gICAgICAgICAgICAvKHRpemVufGthaW9zKVtcXC9cXHNdKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaXplbi9LYWlPU1xuICAgICAgICAgICAgLyhhbmRyb2lkfHdlYm9zfHBhbG1cXHNvc3xxbnh8YmFkYXxyaW1cXHN0YWJsZXRcXHNvc3xtZWVnb3xzYWlsZmlzaHxjb250aWtpKVtcXC9cXHMtXT8oW1xcd1xcLl0qKS9pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQvV2ViT1MvUGFsbS9RTlgvQmFkYS9SSU0vTWVlR28vQ29udGlraS9TYWlsZmlzaCBPU1xuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKHN5bWJpYW5cXHM/b3N8c3ltYm9zfHM2MCg/PTspKVtcXC9cXHMtXT8oW1xcd1xcLl0qKS9pICAgICAgICAgICAgICAgICAgLy8gU3ltYmlhblxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnU3ltYmlhbiddLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgL1xcKChzZXJpZXM0MCk7L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VyaWVzIDQwXG4gICAgICAgICAgICBdLCBbTkFNRV0sIFtcbiAgICAgICAgICAgIC9tb3ppbGxhLitcXChtb2JpbGU7LitnZWNrby4rZmlyZWZveC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0ZpcmVmb3ggT1MnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIC9jcmtleVxcLyhbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIENocm9tZWNhc3RcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0Nocm9tZWNhc3QnXV0sIFtcblxuICAgICAgICAgICAgLy8gQ29uc29sZVxuICAgICAgICAgICAgLyhuaW50ZW5kb3xwbGF5c3RhdGlvbilcXHMoW3dpZHMzNHBvcnRhYmxldnVdKykvaSwgICAgICAgICAgICAgICAgICAgLy8gTmludGVuZG8vUGxheXN0YXRpb25cblxuICAgICAgICAgICAgLy8gR05VL0xpbnV4IGJhc2VkXG4gICAgICAgICAgICAvKG1pbnQpW1xcL1xcc1xcKF0/KFxcdyopL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaW50XG4gICAgICAgICAgICAvKG1hZ2VpYXx2ZWN0b3JsaW51eClbO1xcc10vaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWdlaWEvVmVjdG9yTGludXhcbiAgICAgICAgICAgIC8oam9saXxba3hsbl0/dWJ1bnR1fGRlYmlhbnxzdXNlfG9wZW5zdXNlfGdlbnRvb3woPz1cXHMpYXJjaHxzbGFja3dhcmV8ZmVkb3JhfG1hbmRyaXZhfGNlbnRvc3xwY2xpbnV4b3N8cmVkaGF0fHplbndhbGt8bGlucHVzKVtcXC9cXHMtXT8oPyFjaHJvbSkoW1xcd1xcLi1dKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSm9saS9VYnVudHUvRGViaWFuL1NVU0UvR2VudG9vL0FyY2gvU2xhY2t3YXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZlZG9yYS9NYW5kcml2YS9DZW50T1MvUENMaW51eE9TL1JlZEhhdC9aZW53YWxrL0xpbnB1c1xuICAgICAgICAgICAgLyhodXJkfGxpbnV4KVxccz8oW1xcd1xcLl0qKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIdXJkL0xpbnV4XG4gICAgICAgICAgICAvKGdudSlcXHM/KFtcXHdcXC5dKikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdOVVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oY3JvcylcXHNbXFx3XStcXHMoW1xcd1xcLl0rXFx3KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0gT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0Nocm9taXVtIE9TJ10sIFZFUlNJT05dLFtcblxuICAgICAgICAgICAgLy8gU29sYXJpc1xuICAgICAgICAgICAgLyhzdW5vcylcXHM/KFtcXHdcXC5cXGRdKikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29sYXJpc1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAnU29sYXJpcyddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvLyBCU0QgYmFzZWRcbiAgICAgICAgICAgIC9cXHMoW2ZyZW50b3BjLV17MCw0fWJzZHxkcmFnb25mbHkpXFxzPyhbXFx3XFwuXSopL2kgICAgICAgICAgICAgICAgICAgIC8vIEZyZWVCU0QvTmV0QlNEL09wZW5CU0QvUEMtQlNEL0RyYWdvbkZseVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLFtcblxuICAgICAgICAgICAgLyhoYWlrdSlcXHMoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhaWt1XG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sW1xuXG4gICAgICAgICAgICAvY2ZuZXR3b3JrXFwvLitkYXJ3aW4vaSxcbiAgICAgICAgICAgIC9pcFtob25lYWRdezIsNH0oPzouKm9zXFxzKFtcXHddKylcXHNsaWtlXFxzbWFjfDtcXHNvcGVyYSkvaSAgICAgICAgICAgICAvLyBpT1NcbiAgICAgICAgICAgIF0sIFtbVkVSU0lPTiwgL18vZywgJy4nXSwgW05BTUUsICdpT1MnXV0sIFtcblxuICAgICAgICAgICAgLyhtYWNcXHNvc1xcc3gpXFxzPyhbXFx3XFxzXFwuXSopL2ksXG4gICAgICAgICAgICAvKG1hY2ludG9zaHxtYWMoPz1fcG93ZXJwYylcXHMpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWMgT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ01hYyBPUyddLCBbVkVSU0lPTiwgL18vZywgJy4nXV0sIFtcblxuICAgICAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgICAgIC8oKD86b3Blbik/c29sYXJpcylbXFwvXFxzLV0/KFtcXHdcXC5dKikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbGFyaXNcbiAgICAgICAgICAgIC8oYWl4KVxccygoXFxkKSg/PVxcLnxcXCl8XFxzKVtcXHdcXC5dKSovaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFJWFxuICAgICAgICAgICAgLyhwbGFuXFxzOXxtaW5peHxiZW9zfG9zXFwvMnxhbWlnYW9zfG1vcnBob3N8cmlzY1xcc29zfG9wZW52bXN8ZnVjaHNpYSkvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGxhbjkvTWluaXgvQmVPUy9PUzIvQW1pZ2FPUy9Nb3JwaE9TL1JJU0NPUy9PcGVuVk1TL0Z1Y2hzaWFcbiAgICAgICAgICAgIC8odW5peClcXHM/KFtcXHdcXC5dKikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVU5JWFxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dXG4gICAgICAgIF1cbiAgICB9O1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgLy8vLy8vLy8vLy8vLy8vL1xuICAgIHZhciBVQVBhcnNlciA9IGZ1bmN0aW9uICh1YXN0cmluZywgZXh0ZW5zaW9ucykge1xuXG4gICAgICAgIGlmICh0eXBlb2YgdWFzdHJpbmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBleHRlbnNpb25zID0gdWFzdHJpbmc7XG4gICAgICAgICAgICB1YXN0cmluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVQVBhcnNlcikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVUFQYXJzZXIodWFzdHJpbmcsIGV4dGVuc2lvbnMpLmdldFJlc3VsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVhID0gdWFzdHJpbmcgfHwgKCh3aW5kb3cgJiYgd2luZG93Lm5hdmlnYXRvciAmJiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkgPyB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCA6IEVNUFRZKTtcbiAgICAgICAgdmFyIHJneG1hcCA9IGV4dGVuc2lvbnMgPyB1dGlsLmV4dGVuZChyZWdleGVzLCBleHRlbnNpb25zKSA6IHJlZ2V4ZXM7XG5cbiAgICAgICAgdGhpcy5nZXRCcm93c2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJyb3dzZXIgPSB7IG5hbWU6IHVuZGVmaW5lZCwgdmVyc2lvbjogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICBtYXBwZXIucmd4LmNhbGwoYnJvd3NlciwgdWEsIHJneG1hcC5icm93c2VyKTtcbiAgICAgICAgICAgIGJyb3dzZXIubWFqb3IgPSB1dGlsLm1ham9yKGJyb3dzZXIudmVyc2lvbik7IC8vIGRlcHJlY2F0ZWRcbiAgICAgICAgICAgIHJldHVybiBicm93c2VyO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldENQVSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjcHUgPSB7IGFyY2hpdGVjdHVyZTogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICBtYXBwZXIucmd4LmNhbGwoY3B1LCB1YSwgcmd4bWFwLmNwdSk7XG4gICAgICAgICAgICByZXR1cm4gY3B1O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldERldmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZXZpY2UgPSB7IHZlbmRvcjogdW5kZWZpbmVkLCBtb2RlbDogdW5kZWZpbmVkLCB0eXBlOiB1bmRlZmluZWQgfTtcbiAgICAgICAgICAgIG1hcHBlci5yZ3guY2FsbChkZXZpY2UsIHVhLCByZ3htYXAuZGV2aWNlKTtcbiAgICAgICAgICAgIHJldHVybiBkZXZpY2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RW5naW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGVuZ2luZSA9IHsgbmFtZTogdW5kZWZpbmVkLCB2ZXJzaW9uOiB1bmRlZmluZWQgfTtcbiAgICAgICAgICAgIG1hcHBlci5yZ3guY2FsbChlbmdpbmUsIHVhLCByZ3htYXAuZW5naW5lKTtcbiAgICAgICAgICAgIHJldHVybiBlbmdpbmU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0T1MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3MgPSB7IG5hbWU6IHVuZGVmaW5lZCwgdmVyc2lvbjogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICBtYXBwZXIucmd4LmNhbGwob3MsIHVhLCByZ3htYXAub3MpO1xuICAgICAgICAgICAgcmV0dXJuIG9zO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldFJlc3VsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdWEgICAgICA6IHRoaXMuZ2V0VUEoKSxcbiAgICAgICAgICAgICAgICBicm93c2VyIDogdGhpcy5nZXRCcm93c2VyKCksXG4gICAgICAgICAgICAgICAgZW5naW5lICA6IHRoaXMuZ2V0RW5naW5lKCksXG4gICAgICAgICAgICAgICAgb3MgICAgICA6IHRoaXMuZ2V0T1MoKSxcbiAgICAgICAgICAgICAgICBkZXZpY2UgIDogdGhpcy5nZXREZXZpY2UoKSxcbiAgICAgICAgICAgICAgICBjcHUgICAgIDogdGhpcy5nZXRDUFUoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRVQSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1YTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRVQSA9IGZ1bmN0aW9uICh1YXN0cmluZykge1xuICAgICAgICAgICAgdWEgPSB1YXN0cmluZztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVUFQYXJzZXIuVkVSU0lPTiA9IExJQlZFUlNJT047XG4gICAgVUFQYXJzZXIuQlJPV1NFUiA9IHtcbiAgICAgICAgTkFNRSAgICA6IE5BTUUsXG4gICAgICAgIE1BSk9SICAgOiBNQUpPUiwgLy8gZGVwcmVjYXRlZFxuICAgICAgICBWRVJTSU9OIDogVkVSU0lPTlxuICAgIH07XG4gICAgVUFQYXJzZXIuQ1BVID0ge1xuICAgICAgICBBUkNISVRFQ1RVUkUgOiBBUkNISVRFQ1RVUkVcbiAgICB9O1xuICAgIFVBUGFyc2VyLkRFVklDRSA9IHtcbiAgICAgICAgTU9ERUwgICA6IE1PREVMLFxuICAgICAgICBWRU5ET1IgIDogVkVORE9SLFxuICAgICAgICBUWVBFICAgIDogVFlQRSxcbiAgICAgICAgQ09OU09MRSA6IENPTlNPTEUsXG4gICAgICAgIE1PQklMRSAgOiBNT0JJTEUsXG4gICAgICAgIFNNQVJUVFYgOiBTTUFSVFRWLFxuICAgICAgICBUQUJMRVQgIDogVEFCTEVULFxuICAgICAgICBXRUFSQUJMRTogV0VBUkFCTEUsXG4gICAgICAgIEVNQkVEREVEOiBFTUJFRERFRFxuICAgIH07XG4gICAgVUFQYXJzZXIuRU5HSU5FID0ge1xuICAgICAgICBOQU1FICAgIDogTkFNRSxcbiAgICAgICAgVkVSU0lPTiA6IFZFUlNJT05cbiAgICB9O1xuICAgIFVBUGFyc2VyLk9TID0ge1xuICAgICAgICBOQU1FICAgIDogTkFNRSxcbiAgICAgICAgVkVSU0lPTiA6IFZFUlNJT05cbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy9cbiAgICAvLyBFeHBvcnRcbiAgICAvLy8vLy8vLy8vXG5cblxuICAgIC8vIGNoZWNrIGpzIGVudmlyb25tZW50XG4gICAgaWYgKHR5cGVvZihleHBvcnRzKSAhPT0gVU5ERUZfVFlQRSkge1xuICAgICAgICAvLyBub2RlanMgZW52XG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSBVTkRFRl9UWVBFICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBVQVBhcnNlcjtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLlVBUGFyc2VyID0gVUFQYXJzZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmVxdWlyZWpzIGVudiAob3B0aW9uYWwpXG4gICAgICAgIGlmICh0eXBlb2YoZGVmaW5lKSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVQVBhcnNlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgICAgICAgICAgLy8gYnJvd3NlciBlbnZcbiAgICAgICAgICAgIHdpbmRvdy5VQVBhcnNlciA9IFVBUGFyc2VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8galF1ZXJ5L1plcHRvIHNwZWNpZmljIChvcHRpb25hbClcbiAgICAvLyBOb3RlOlxuICAgIC8vICAgSW4gQU1EIGVudiB0aGUgZ2xvYmFsIHNjb3BlIHNob3VsZCBiZSBrZXB0IGNsZWFuLCBidXQgalF1ZXJ5IGlzIGFuIGV4Y2VwdGlvbi5cbiAgICAvLyAgIGpRdWVyeSBhbHdheXMgZXhwb3J0cyB0byBnbG9iYWwgc2NvcGUsIHVubGVzcyBqUXVlcnkubm9Db25mbGljdCh0cnVlKSBpcyB1c2VkLFxuICAgIC8vICAgYW5kIHdlIHNob3VsZCBjYXRjaCB0aGF0LlxuICAgIHZhciAkID0gd2luZG93ICYmICh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byk7XG4gICAgaWYgKCQgJiYgISQudWEpIHtcbiAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBVQVBhcnNlcigpO1xuICAgICAgICAkLnVhID0gcGFyc2VyLmdldFJlc3VsdCgpO1xuICAgICAgICAkLnVhLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZXIuZ2V0VUEoKTtcbiAgICAgICAgfTtcbiAgICAgICAgJC51YS5zZXQgPSBmdW5jdGlvbiAodWFzdHJpbmcpIHtcbiAgICAgICAgICAgIHBhcnNlci5zZXRVQSh1YXN0cmluZyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gcGFyc2VyLmdldFJlc3VsdCgpO1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAkLnVhW3Byb3BdID0gcmVzdWx0W3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyB3aW5kb3cgOiB0aGlzKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gVWFQYXJzZXI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvanMvY29tbW9uX2hlYWQuZW50cnkuanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9