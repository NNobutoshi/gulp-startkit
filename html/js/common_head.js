/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/common_head.bundle.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/amd-define.js":
/*!***************************************!*\
  !*** (webpack)/buildin/amd-define.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ "./node_modules/webpack/buildin/amd-options.js":
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/js/_modules/adjust.js":
/*!***********************************!*\
  !*** ./src/js/_modules/adjust.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vendor_ua_parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_vendor/ua-parser.js */ "./src/js/_vendor/ua-parser.js");
/* harmony import */ var _vendor_ua_parser_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_vendor_ua_parser_js__WEBPACK_IMPORTED_MODULE_0__);

var uaParser = new _vendor_ua_parser_js__WEBPACK_IMPORTED_MODULE_0___default.a();
/* harmony default export */ __webpack_exports__["default"] = (function (className) {
  var elemHtml = document.querySelector('html'),
      browser = uaParser.getBrowser();
  elemHtml.classList.add(className);
  elemHtml.classList.add(browser.name + browser.major);
});

/***/ }),

/***/ "./src/js/_vendor/modernizr.js":
/*!*************************************!*\
  !*** ./src/js/_vendor/modernizr.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * modernizr v3.6.0
 * Build https://modernizr.com/download?-touchevents-mq-setclasses-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/
;

(function (window, document, undefined) {
  var tests = [];
  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.6.0',
    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },
    // Queue of tests
    _q: [],
    // Stub these for people who are listening
    on: function on(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function () {
        cb(self[test]);
      }, 0);
    },
    addTest: function addTest(name, fn, options) {
      tests.push({
        name: name,
        fn: fn,
        options: options
      });
    },
    addAsyncTest: function addAsyncTest(fn) {
      tests.push({
        name: null,
        fn: fn
      });
    }
  }; // Fake some of Object.create so we can force non test results to be non "own" properties.

  var Modernizr = function Modernizr() {};

  Modernizr.prototype = ModernizrProto; // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D

  Modernizr = new Modernizr();
  var classes = [];
  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return _typeof(obj) === type;
  }

  ;
  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx]; // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.

        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        } // Run the test, or use the raw value if it's not a function


        result = is(feature.fn, 'function') ? feature.fn() : feature.fn; // Set each of the names on the Modernizr object

        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx]; // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words

          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }

  ;
  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */
  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]

  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    } // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too


    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);

      if (isSVG) {
        docElement.className.baseVal = className;
      } else {
        docElement.className = className;
      }
    }
  }

  ;
  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  ;
  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  ;
  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod; // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270

    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }

    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = ''; //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible

      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule); // If this is done after page load we don't want to remove the body so check if body exists

    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow; // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      // eslint-disable-next-line

      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;
  }

  ;
  /**
   * Modernizr.mq tests a given media query, live against the current state of the window
   * adapted from matchMedia polyfill by Scott Jehl and Paul Irish
   * gist.github.com/786768
   *
   * @memberof Modernizr
   * @name Modernizr.mq
   * @optionName Modernizr.mq()
   * @optionProp mq
   * @access public
   * @function mq
   * @param {string} mq - String of the media query we want to test
   * @returns {boolean}
   * @example
   * Modernizr.mq allows for you to programmatically check if the current browser
   * window state matches a media query.
   *
   * ```js
   *  var query = Modernizr.mq('(min-width: 900px)');
   *
   *  if (query) {
   *    // the browser window is larger than 900px
   *  }
   * ```
   *
   * Only valid media queries are supported, therefore you must always include values
   * with your media query
   *
   * ```js
   * // good
   *  Modernizr.mq('(min-width: 900px)');
   *
   * // bad
   *  Modernizr.mq('min-width');
   * ```
   *
   * If you would just like to test that media queries are supported in general, use
   *
   * ```js
   *  Modernizr.mq('only all'); // true if MQ are supported, false if not
   * ```
   *
   *
   * Note that if the browser does not support media queries (e.g. old IE) mq will
   * always return false.
   */

  var mq = function () {
    var matchMedia = window.matchMedia || window.msMatchMedia;

    if (matchMedia) {
      return function (mq) {
        var mql = matchMedia(mq);
        return mql && mql.matches || false;
      };
    }

    return function (mq) {
      var bool = false;
      injectElementWithStyles('@media ' + mq + ' { #modernizr { position: absolute; } }', function (node) {
        bool = (window.getComputedStyle ? window.getComputedStyle(node, null) : node.currentStyle).position == 'absolute';
      });
      return bool;
    };
  }();

  ModernizrProto.mq = mq;
  /**
   * List of property values to set for css tests. See ticket #21
   * http://git.io/vUGl4
   *
   * @memberof Modernizr
   * @name Modernizr._prefixes
   * @optionName Modernizr._prefixes
   * @optionProp prefixes
   * @access public
   * @example
   *
   * Modernizr._prefixes is the internal list of prefixes that we test against
   * inside of things like [prefixed](#modernizr-prefixed) and [prefixedCSS](#-code-modernizr-prefixedcss). It is simply
   * an array of kebab-case vendor prefixes you can use within your code.
   *
   * Some common use cases include
   *
   * Generating all possible prefixed version of a CSS property
   * ```js
   * var rule = Modernizr._prefixes.join('transform: rotate(20deg); ');
   *
   * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); moz-transform: rotate(20deg); o-transform: rotate(20deg); ms-transform: rotate(20deg);'
   * ```
   *
   * Generating all possible prefixed version of a CSS value
   * ```js
   * rule = 'display:' +  Modernizr._prefixes.join('flex; display:') + 'flex';
   *
   * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; display:-o-flex; display:-ms-flex; display:flex'
   * ```
   */
  // we use ['',''] rather than an empty array in order to allow a pattern of .`join()`ing prefixes to test
  // values in feature detects to continue to work

  var prefixes = ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['', '']; // expose these for the plugin API. Look in the source for how to join() them against your input

  ModernizrProto._prefixes = prefixes;
  /**
   * testStyles injects an element with style element and some CSS rules
   *
   * @memberof Modernizr
   * @name Modernizr.testStyles
   * @optionName Modernizr.testStyles()
   * @optionProp testStyles
   * @access public
   * @function testStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   * @example
   *
   * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
   * along with (possibly multiple) DOM elements. This lets you check for features
   * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
   *
   * ```js
   * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
   *   // elem is the first DOM node in the page (by default #modernizr)
   *   // rule is the first argument you supplied - the CSS rule in string form
   *
   *   addTest('widthworks', elem.style.width === '9px')
   * });
   * ```
   *
   * If your test requires multiple nodes, you can include a third argument
   * indicating how many additional div elements to include on the page. The
   * additional nodes are injected as children of the `elem` that is returned as
   * the first argument to the callback.
   *
   * ```js
   * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
   *   document.getElementById('modernizr').style.width === '1px'; // true
   *   document.getElementById('modernizr2').style.width === '2px'; // true
   *   elem.firstChild === document.getElementById('modernizr2'); // true
   * }, 1);
   * ```
   *
   * By default, all of the additional elements have an ID of `modernizr[n]`, where
   * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
   * the second additional is `#modernizr3`, etc.).
   * If you want to have more meaningful IDs for your function, you can provide
   * them as the fourth argument, as an array of strings
   *
   * ```js
   * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
   *   elem.firstChild === document.getElementById('foo'); // true
   *   elem.lastChild === document.getElementById('bar'); // true
   * }, 2, ['foo', 'bar']);
   * ```
   *
   */

  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;
  /*!
  {
    "name": "Touch Events",
    "property": "touchevents",
    "caniuse" : "touch",
    "tags": ["media", "attribute"],
    "notes": [{
      "name": "Touch Events spec",
      "href": "https://www.w3.org/TR/2013/WD-touch-events-20130124/"
    }],
    "warnings": [
      "Indicates if the browser supports the Touch Events spec, and does not necessarily reflect a touchscreen device"
    ],
    "knownBugs": [
      "False-positive on some configurations of Nokia N900",
      "False-positive on some BlackBerry 6.0 builds – https://github.com/Modernizr/Modernizr/issues/372#issuecomment-3112695"
    ]
  }
  !*/

  /* DOC
  Indicates if the browser supports the W3C Touch Events API.
  
  This *does not* necessarily reflect a touchscreen device:
  
  * Older touchscreen devices only emulate mouse events
  * Modern IE touch devices implement the Pointer Events API instead: use `Modernizr.pointerevents` to detect support for that
  * Some browsers & OS setups may enable touch APIs when no touchscreen is connected
  * Future browsers may implement other event models for touch interactions
  
  See this article: [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/).
  
  It's recommended to bind both mouse and touch/pointer events simultaneously – see [this HTML5 Rocks tutorial](http://www.html5rocks.com/en/mobile/touchandmouse/).
  
  This test will also return `true` for Firefox 4 Multitouch support.
  */
  // Chrome (desktop) used to lie about its support on this, but that has since been rectified: http://crbug.com/36415

  Modernizr.addTest('touchevents', function () {
    var bool;

    if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
      bool = true;
    } else {
      // include the 'heartz' as a way to have a non matching MQ to help terminate the join
      // https://git.io/vznFH
      var query = ['@media (', prefixes.join('touch-enabled),('), 'heartz', ')', '{#modernizr{top:9px;position:absolute}}'].join('');
      testStyles(query, function (node) {
        bool = node.offsetTop === 9;
      });
    }

    return bool;
  }); // Run each test

  testRunner(); // Remove the "no-js" class if it exists

  setClasses(classes);
  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest; // Run the things that are supposed to run after the tests

  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  } // Leak Modernizr namespace


  window.Modernizr = Modernizr;
  ;
})(window, document);

/***/ }),

/***/ "./src/js/_vendor/ua-parser.js":
/*!*************************************!*\
  !*** ./src/js/_vendor/ua-parser.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * UAParser.js v0.7.19
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 or MIT
 */
(function (window, undefined) {
  'use strict'; //////////////
  // Constants
  /////////////

  var LIBVERSION = '0.7.19',
      EMPTY = '',
      UNKNOWN = '?',
      FUNC_TYPE = 'function',
      UNDEF_TYPE = 'undefined',
      OBJ_TYPE = 'object',
      STR_TYPE = 'string',
      MAJOR = 'major',
      // deprecated
  MODEL = 'model',
      NAME = 'name',
      TYPE = 'type',
      VENDOR = 'vendor',
      VERSION = 'version',
      ARCHITECTURE = 'architecture',
      CONSOLE = 'console',
      MOBILE = 'mobile',
      TABLET = 'tablet',
      SMARTTV = 'smarttv',
      WEARABLE = 'wearable',
      EMBEDDED = 'embedded'; ///////////
  // Helper
  //////////

  var util = {
    extend: function extend(regexes, extensions) {
      var margedRegexes = {};

      for (var i in regexes) {
        if (extensions[i] && extensions[i].length % 2 === 0) {
          margedRegexes[i] = extensions[i].concat(regexes[i]);
        } else {
          margedRegexes[i] = regexes[i];
        }
      }

      return margedRegexes;
    },
    has: function has(str1, str2) {
      if (typeof str1 === "string") {
        return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
      } else {
        return false;
      }
    },
    lowerize: function lowerize(str) {
      return str.toLowerCase();
    },
    major: function major(version) {
      return _typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, '').split(".")[0] : undefined;
    },
    trim: function trim(str) {
      return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
  }; ///////////////
  // Map helper
  //////////////

  var mapper = {
    rgx: function rgx(ua, arrays) {
      //var result = {},
      var i = 0,
          j,
          k,
          p,
          q,
          matches,
          match; //, args = arguments;

      /*// construct object barebones
      for (p = 0; p < args[1].length; p++) {
          q = args[1][p];
          result[typeof q === OBJ_TYPE ? q[0] : q] = undefined;
      }*/
      // loop through all regexes maps

      while (i < arrays.length && !matches) {
        var regex = arrays[i],
            // even sequence (0,2,4,..)
        props = arrays[i + 1]; // odd sequence (1,3,5,..)

        j = k = 0; // try matching uastring with regexes

        while (j < regex.length && !matches) {
          matches = regex[j++].exec(ua);

          if (!!matches) {
            for (p = 0; p < props.length; p++) {
              match = matches[++k];
              q = props[p]; // check if given property is actually array

              if (_typeof(q) === OBJ_TYPE && q.length > 0) {
                if (q.length == 2) {
                  if (_typeof(q[1]) == FUNC_TYPE) {
                    // assign modified match
                    this[q[0]] = q[1].call(this, match);
                  } else {
                    // assign given value, ignore regex match
                    this[q[0]] = q[1];
                  }
                } else if (q.length == 3) {
                  // check whether function or regex
                  if (_typeof(q[1]) === FUNC_TYPE && !(q[1].exec && q[1].test)) {
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
      } // console.log(this);
      //return this;

    },
    str: function str(_str, map) {
      for (var i in map) {
        // check if array
        if (_typeof(map[i]) === OBJ_TYPE && map[i].length > 0) {
          for (var j = 0; j < map[i].length; j++) {
            if (util.has(map[i][j], _str)) {
              return i === UNKNOWN ? undefined : i;
            }
          }
        } else if (util.has(map[i], _str)) {
          return i === UNKNOWN ? undefined : i;
        }
      }

      return _str;
    }
  }; ///////////////
  // String map
  //////////////

  var maps = {
    browser: {
      oldsafari: {
        version: {
          '1.0': '/8',
          '1.2': '/1',
          '1.3': '/3',
          '2.0': '/412',
          '2.0.2': '/416',
          '2.0.3': '/417',
          '2.0.4': '/419',
          '?': '/'
        }
      }
    },
    device: {
      amazon: {
        model: {
          'Fire Phone': ['SD', 'KF']
        }
      },
      sprint: {
        model: {
          'Evo Shift 4G': '7373KT'
        },
        vendor: {
          'HTC': 'APA',
          'Sprint': 'Sprint'
        }
      }
    },
    os: {
      windows: {
        version: {
          'ME': '4.90',
          'NT 3.11': 'NT3.51',
          'NT 4.0': 'NT4.0',
          '2000': 'NT 5.0',
          'XP': ['NT 5.1', 'NT 5.2'],
          'Vista': 'NT 6.0',
          '7': 'NT 6.1',
          '8': 'NT 6.2',
          '8.1': 'NT 6.3',
          '10': ['NT 6.4', 'NT 10.0'],
          'RT': 'ARM'
        }
      }
    }
  }; //////////////
  // Regex map
  /////////////

  var regexes = {
    browser: [[// Presto based
    /(opera\smini)\/([\w\.-]+)/i, // Opera Mini
    /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, // Opera Mobi/Tablet
    /(opera).+version\/([\w\.]+)/i, // Opera > 9.80
    /(opera)[\/\s]+([\w\.]+)/i // Opera < 9.80
    ], [NAME, VERSION], [/(opios)[\/\s]+([\w\.]+)/i // Opera mini on iphone >= 8.0
    ], [[NAME, 'Opera Mini'], VERSION], [/\s(opr)\/([\w\.]+)/i // Opera Webkit
    ], [[NAME, 'Opera'], VERSION], [// Mixed
    /(kindle)\/([\w\.]+)/i, // Kindle
    /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i, // Lunascape/Maxthon/Netfront/Jasmine/Blazer
    // Trident based
    /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, // Avant/IEMobile/SlimBrowser/Baidu
    /(?:ms|\()(ie)\s([\w\.]+)/i, // Internet Explorer
    // Webkit/KHTML based
    /(rekonq)\/([\w\.]*)/i, // Rekonq
    /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
    ], [NAME, VERSION], [/(konqueror)\/([\w\.]+)/i // Konqueror
    ], [[NAME, 'Konqueror'], VERSION], [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i // IE11
    ], [[NAME, 'IE'], VERSION], [/(edge|edgios|edga)\/((\d+)?[\w\.]+)/i // Microsoft Edge
    ], [[NAME, 'Edge'], VERSION], [/(yabrowser)\/([\w\.]+)/i // Yandex
    ], [[NAME, 'Yandex'], VERSION], [/(puffin)\/([\w\.]+)/i // Puffin
    ], [[NAME, 'Puffin'], VERSION], [/(focus)\/([\w\.]+)/i // Firefox Focus
    ], [[NAME, 'Firefox Focus'], VERSION], [/(opt)\/([\w\.]+)/i // Opera Touch
    ], [[NAME, 'Opera Touch'], VERSION], [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i // UCBrowser
    ], [[NAME, 'UCBrowser'], VERSION], [/(comodo_dragon)\/([\w\.]+)/i // Comodo Dragon
    ], [[NAME, /_/g, ' '], VERSION], [/(micromessenger)\/([\w\.]+)/i // WeChat
    ], [[NAME, 'WeChat'], VERSION], [/(brave)\/([\w\.]+)/i // Brave browser
    ], [[NAME, 'Brave'], VERSION], [/(qqbrowserlite)\/([\w\.]+)/i // QQBrowserLite
    ], [NAME, VERSION], [/(QQ)\/([\d\.]+)/i // QQ, aka ShouQ
    ], [NAME, VERSION], [/m?(qqbrowser)[\/\s]?([\w\.]+)/i // QQBrowser
    ], [NAME, VERSION], [/(BIDUBrowser)[\/\s]?([\w\.]+)/i // Baidu Browser
    ], [NAME, VERSION], [/(2345Explorer)[\/\s]?([\w\.]+)/i // 2345 Browser
    ], [NAME, VERSION], [/(MetaSr)[\/\s]?([\w\.]+)/i // SouGouBrowser
    ], [NAME], [/(LBBROWSER)/i // LieBao Browser
    ], [NAME], [/xiaomi\/miuibrowser\/([\w\.]+)/i // MIUI Browser
    ], [VERSION, [NAME, 'MIUI Browser']], [/;fbav\/([\w\.]+);/i // Facebook App for iOS & Android
    ], [VERSION, [NAME, 'Facebook']], [/safari\s(line)\/([\w\.]+)/i, // Line App for iOS
    /android.+(line)\/([\w\.]+)\/iab/i // Line App for Android
    ], [NAME, VERSION], [/headlesschrome(?:\/([\w\.]+)|\s)/i // Chrome Headless
    ], [VERSION, [NAME, 'Chrome Headless']], [/\swv\).+(chrome)\/([\w\.]+)/i // Chrome WebView
    ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [/((?:oculus|samsung)browser)\/([\w\.]+)/i], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [// Oculus / Samsung Browser
    /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i // Android Browser
    ], [VERSION, [NAME, 'Android Browser']], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i // Chrome/OmniWeb/Arora/Tizen/Nokia
    ], [NAME, VERSION], [/(dolfin)\/([\w\.]+)/i // Dolphin
    ], [[NAME, 'Dolphin'], VERSION], [/((?:android.+)crmo|crios)\/([\w\.]+)/i // Chrome for Android/iOS
    ], [[NAME, 'Chrome'], VERSION], [/(coast)\/([\w\.]+)/i // Opera Coast
    ], [[NAME, 'Opera Coast'], VERSION], [/fxios\/([\w\.-]+)/i // Firefox for iOS
    ], [VERSION, [NAME, 'Firefox']], [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i // Mobile Safari
    ], [VERSION, [NAME, 'Mobile Safari']], [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i // Safari & Safari Mobile
    ], [VERSION, NAME], [/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i // Google Search Appliance on iOS
    ], [[NAME, 'GSA'], VERSION], [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i // Safari < 3.0
    ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [/(webkit|khtml)\/([\w\.]+)/i], [NAME, VERSION], [// Gecko based
    /(navigator|netscape)\/([\w\.-]+)/i // Netscape
    ], [[NAME, 'Netscape'], VERSION], [/(swiftfox)/i, // Swiftfox
    /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
    /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i, // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
    /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, // Mozilla
    // Other
    /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
    /(links)\s\(([\w\.]+)/i, // Links
    /(gobrowser)\/?([\w\.]*)/i, // GoBrowser
    /(ice\s?browser)\/v?([\w\._]+)/i, // ICE Browser
    /(mosaic)[\/\s]([\w\.]+)/i // Mosaic
    ], [NAME, VERSION]
    /* /////////////////////
    // Media players BEGIN
    ////////////////////////
     , [
     /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
    /(coremedia) v((\d+)[\w\._]+)/i
    ], [NAME, VERSION], [
     /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
    ], [NAME, VERSION], [
     /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
    ], [NAME, VERSION], [
     /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                        // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                        // NSPlayer/PSP-InternetRadioPlayer/Videos
    /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
    /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
    /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
    ], [NAME, VERSION], [
    /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
    ], [NAME, VERSION], [
     /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
    ], [[NAME, 'Flip Player'], VERSION], [
     /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                        // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
    ], [NAME], [
     /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                        // Gstreamer
    ], [NAME, VERSION], [
     /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
    /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                        // Java/urllib/requests/wget/cURL
    /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
    ], [NAME, VERSION], [
     /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
    ], [[NAME, /_/g, ' '], VERSION], [
     /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                        // MPlayer SVN
    ], [NAME, VERSION], [
     /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
    ], [NAME, VERSION], [
     /(mplayer)/i,                                                       // MPlayer (no other info)
    /(yourmuze)/i,                                                      // YourMuze
    /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
    ], [NAME], [
     /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
    ], [NAME, VERSION], [
     /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
    ], [NAME, VERSION], [
     /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
    ], [NAME, VERSION], [
     /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
    /(winamp)\s((\d+)[\w\.-]+)/i,
    /(winamp)mpeg\/((\d+)[\w\.-]+)/i
    ], [NAME, VERSION], [
     /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                        // inlight radio
    ], [NAME], [
     /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                        // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                        // SoundTap/Totem/Stagefright/Streamium
    ], [NAME, VERSION], [
     /(smp)((\d+)[\d\.]+)/i                                              // SMP
    ], [NAME, VERSION], [
     /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
    /(vlc)\/((\d+)[\w\.-]+)/i,
    /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
    /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
    /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
    ], [NAME, VERSION], [
     /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
    /(windows-media-player)\/((\d+)[\w\.-]+)/i
    ], [[NAME, /-/g, ' '], VERSION], [
     /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                        // Windows Media Server
    ], [VERSION, [NAME, 'Windows']], [
     /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
    ], [NAME, VERSION], [
     /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
    /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
    ], [[NAME, 'rad.io'], VERSION]
     //////////////////////
    // Media players END
    ////////////////////*/
    ],
    cpu: [[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i // AMD64
    ], [[ARCHITECTURE, 'amd64']], [/(ia32(?=;))/i // IA32 (quicktime)
    ], [[ARCHITECTURE, util.lowerize]], [/((?:i[346]|x)86)[;\)]/i // IA32
    ], [[ARCHITECTURE, 'ia32']], [// PocketPC mistakenly identified as PowerPC
    /windows\s(ce|mobile);\sppc;/i], [[ARCHITECTURE, 'arm']], [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i // PowerPC
    ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [/(sun4\w)[;\)]/i // SPARC
    ], [[ARCHITECTURE, 'sparc']], [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
    ], [[ARCHITECTURE, util.lowerize]]],
    device: [[/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i // iPad/PlayBook
    ], [MODEL, VENDOR, [TYPE, TABLET]], [/applecoremedia\/[\w\.]+ \((ipad)/ // iPad
    ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [/(apple\s{0,1}tv)/i // Apple TV
    ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [/(archos)\s(gamepad2?)/i, // Archos
    /(hp).+(touchpad)/i, // HP TouchPad
    /(hp).+(tablet)/i, // HP Tablet
    /(kindle)\/([\w\.]+)/i, // Kindle
    /\s(nook)[\w\s]+build\/(\w+)/i, // Nook
    /(dell)\s(strea[kpr\s\d]*[\dko])/i // Dell Streak
    ], [VENDOR, MODEL, [TYPE, TABLET]], [/(kf[A-z]+)\sbuild\/.+silk\//i // Kindle Fire HD
    ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i // Fire Phone
    ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [/android.+aft([bms])\sbuild/i // Fire TV
    ], [MODEL, [VENDOR, 'Amazon'], [TYPE, SMARTTV]], [/\((ip[honed|\s\w*]+);.+(apple)/i // iPod/iPhone
    ], [MODEL, VENDOR, [TYPE, MOBILE]], [/\((ip[honed|\s\w*]+);/i // iPod/iPhone
    ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [/(blackberry)[\s-]?(\w+)/i, // BlackBerry
    /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i, // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
    /(hp)\s([\w\s]+\w)/i, // HP iPAQ
    /(asus)-?(\w+)/i // Asus
    ], [VENDOR, MODEL, [TYPE, MOBILE]], [/\(bb10;\s(\w+)/i // BlackBerry 10
    ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [// Asus Tablets
    /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [/(sony)\s(tablet\s[ps])\sbuild\//i, // Sony
    /(sony)?(?:sgp.+)\sbuild\//i], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [/android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [/\s(ouya)\s/i, // Ouya
    /(nintendo)\s([wids3u]+)/i // Nintendo
    ], [VENDOR, MODEL, [TYPE, CONSOLE]], [/android.+;\s(shield)\sbuild/i // Nvidia
    ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [/(playstation\s[34portablevi]+)/i // Playstation
    ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [/(sprint\s(\w+))/i // Sprint Phones
    ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i // Lenovo tablets
    ], [VENDOR, MODEL, [TYPE, TABLET]], [/(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i, // HTC
    /(zte)-(\w*)/i, // ZTE
    /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
    ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [/(nexus\s9)/i // HTC Nexus 9
    ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [/d\/huawei([\w\s-]+)[;\)]/i, /(nexus\s6p)/i // Huawei
    ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [/(microsoft);\s(lumia[\s\w]+)/i // Microsoft Lumia
    ], [VENDOR, MODEL, [TYPE, MOBILE]], [/[\s\(;](xbox(?:\sone)?)[\s\);]/i // Microsoft Xbox
    ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [/(kin\.[onetw]{3})/i // Microsoft Kin
    ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [// Motorola
    /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w*)/i, /(XT\d{3,4}) build\//i, /(nexus\s6)/i], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i // HbbTV devices
    ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [/hbbtv.+maple;(\d+)/i], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [/\(dtv[\);].+(aquos)/i // Sharp
    ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [// Samsung
    /smart-tv.+(samsung)/i], [VENDOR, [TYPE, SMARTTV], MODEL], [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i, /sec-((sgh\w+))/i], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [/sie-(\w*)/i // Siemens
    ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [/(maemo|nokia).*(n900|lumia\s\d+)/i, // Nokia
    /(nokia)[\s_-]?([\w-]*)/i], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i // Acer
    ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [/android.+([vl]k\-?\d{3})\s+build/i // LG Tablet
    ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i // LG Tablet
    ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [/(lg) netcast\.tv/i // LG SmartTV
    ], [VENDOR, MODEL, [TYPE, SMARTTV]], [/(nexus\s[45])/i, // LG
    /lg[e;\s\/-]+(\w*)/i, /android.+lg(\-?[\d\w]+)\s+build/i], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [/android.+(ideatab[a-z0-9\-\s]+)/i // Lenovo
    ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [/linux;.+((jolla));/i // Jolla
    ], [VENDOR, MODEL, [TYPE, MOBILE]], [/((pebble))app\/[\d\.]+\s/i // Pebble
    ], [VENDOR, MODEL, [TYPE, WEARABLE]], [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i // OPPO
    ], [VENDOR, MODEL, [TYPE, MOBILE]], [/crkey/i // Google Chromecast
    ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [/android.+;\s(glass)\s\d/i // Google Glass
    ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [/android.+;\s(pixel c)[\s)]/i // Google Pixel C
    ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [/android.+;\s(pixel( [23])?( xl)?)\s/i // Google Pixel
    ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [/android.+;\s(\w+)\s+build\/hm\1/i, // Xiaomi Hongmi 'numeric' models
    /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, // Xiaomi Hongmi
    /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i, // Xiaomi Mi
    /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i // Redmi Phones
    ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i // Mi Pad tablets
    ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [/android.+;\s(m[1-5]\snote)\sbuild/i // Meizu Tablet
    ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [/(mz)-([\w-]{2,})/i // Meizu Phone
    ], [[VENDOR, 'Meizu'], MODEL, [TYPE, MOBILE]], [/android.+a000(1)\s+build/i, // OnePlus
    /android.+oneplus\s(a\d{4})\s+build/i], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i // RCA Tablets
    ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i // Dell Venue Tablets
    ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i // Verizon Tablet
    ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i // Barnes & Noble Tablet
    ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i // Barnes & Noble Tablet
    ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [/android.+;\s(k88)\sbuild/i // ZTE K Series Tablet
    ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i // Swiss GEN Mobile
    ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [/android.+[;\/]\s*(zur\d{3})\s+build/i // Swiss ZUR Tablet
    ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i // Zeki Tablets
    ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [/(android).+[;\/]\s+([YR]\d{2})\s+build/i, /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i // Dragon Touch Tablet
    ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i // Insignia Tablets
    ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i // NextBook Tablets
    ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [// Voice Xtreme Phones
    /android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i // LvTel Phones
    ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [/android.+;\s(PH-1)\s/i], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [// Essential PH-1
    /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i // Envizen Tablets
    ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i // Le Pan Tablets
    ], [VENDOR, MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i // MachSpeed Tablets
    ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i // Trinity Tablets
    ], [VENDOR, MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*TU_(1491)\s+build/i // Rotor Tablets
    ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [/android.+(KS(.+))\s+build/i // Amazon Kindle Tablets
    ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i // Gigaset Tablets
    ], [VENDOR, MODEL, [TYPE, TABLET]], [/\s(tablet|tab)[;\/]/i, // Unidentifiable Tablet
    /\s(mobile)(?:[;\/]|\ssafari)/i // Unidentifiable Mobile
    ], [[TYPE, util.lowerize], VENDOR, MODEL], [/[\s\/\(](smart-?tv)[;\)]/i // SmartTV
    ], [[TYPE, SMARTTV]], [/(android[\w\.\s\-]{0,9});.+build/i // Generic Android Device
    ], [MODEL, [VENDOR, 'Generic']]
    /*//////////////////////////
        // TODO: move to string map
        ////////////////////////////
         /(C6603)/i                                                          // Sony Xperia Z C6603
        ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
        /(C6903)/i                                                          // Sony Xperia Z 1
        ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
         /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
        ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
        /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
        ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
        /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
        ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
        /(SM-G313HZ)/i                                                      // Samsung Galaxy V
        ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
        /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
        ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
        /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
        ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
        /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
        ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
         /(T3C)/i                                                            // Advan Vandroid T3C
        ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
        /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
        ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
        /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
        ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [
         /(V972M)/i                                                          // ZTE V972M
        ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [
         /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [
        /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
        ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
        /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [
        /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
        ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
         /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
        ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [
         /////////////
        // END TODO
        ///////////*/
    ],
    engine: [[/windows.+\sedge\/([\w\.]+)/i // EdgeHTML
    ], [VERSION, [NAME, 'EdgeHTML']], [/webkit\/537\.36.+chrome\/(?!27)/i // Blink
    ], [[NAME, 'Blink']], [/(presto)\/([\w\.]+)/i, // Presto
    /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
    /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, // KHTML/Tasman/Links
    /(icab)[\/\s]([23]\.[\d\.]+)/i // iCab
    ], [NAME, VERSION], [/rv\:([\w\.]{1,9}).+(gecko)/i // Gecko
    ], [VERSION, NAME]],
    os: [[// Windows based
    /microsoft\s(windows)\s(vista|xp)/i // Windows (iTunes)
    ], [NAME, VERSION], [/(windows)\snt\s6\.2;\s(arm)/i, // Windows RT
    /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, // Windows Phone
    /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [// Mobile/Embedded OS
    /\((bb)(10);/i // BlackBerry 10
    ], [[NAME, 'BlackBerry'], VERSION], [/(blackberry)\w*\/?([\w\.]*)/i, // Blackberry
    /(tizen)[\/\s]([\w\.]+)/i, // Tizen
    /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]*)/i, // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
    /linux;.+(sailfish);/i // Sailfish OS
    ], [NAME, VERSION], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i // Symbian
    ], [[NAME, 'Symbian'], VERSION], [/\((series40);/i // Series 40
    ], [NAME], [/mozilla.+\(mobile;.+gecko.+firefox/i // Firefox OS
    ], [[NAME, 'Firefox OS'], VERSION], [// Console
    /(nintendo|playstation)\s([wids34portablevu]+)/i, // Nintendo/Playstation
    // GNU/Linux based
    /(mint)[\/\s\(]?(\w*)/i, // Mint
    /(mageia|vectorlinux)[;\s]/i, // Mageia/VectorLinux
    /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i, // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
    // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
    /(hurd|linux)\s?([\w\.]*)/i, // Hurd/Linux
    /(gnu)\s?([\w\.]*)/i // GNU
    ], [NAME, VERSION], [/(cros)\s[\w]+\s([\w\.]+\w)/i // Chromium OS
    ], [[NAME, 'Chromium OS'], VERSION], [// Solaris
    /(sunos)\s?([\w\.\d]*)/i // Solaris
    ], [[NAME, 'Solaris'], VERSION], [// BSD based
    /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
    ], [NAME, VERSION], [/(haiku)\s(\w+)/i // Haiku
    ], [NAME, VERSION], [/cfnetwork\/.+darwin/i, /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i // iOS
    ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)/i // Mac OS
    ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [// Other
    /((?:open)?solaris)[\/\s-]?([\w\.]*)/i, // Solaris
    /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, // AIX
    /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i, // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS/Fuchsia
    /(unix)\s?([\w\.]*)/i // UNIX
    ], [NAME, VERSION]]
  }; /////////////////
  // Constructor
  ////////////////

  /*
  var Browser = function (name, version) {
      this[NAME] = name;
      this[VERSION] = version;
  };
  var CPU = function (arch) {
      this[ARCHITECTURE] = arch;
  };
  var Device = function (vendor, model, type) {
      this[VENDOR] = vendor;
      this[MODEL] = model;
      this[TYPE] = type;
  };
  var Engine = Browser;
  var OS = Browser;
  */

  var UAParser = function UAParser(uastring, extensions) {
    if (_typeof(uastring) === 'object') {
      extensions = uastring;
      uastring = undefined;
    }

    if (!(this instanceof UAParser)) {
      return new UAParser(uastring, extensions).getResult();
    }

    var ua = uastring || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY);
    var rgxmap = extensions ? util.extend(regexes, extensions) : regexes; //var browser = new Browser();
    //var cpu = new CPU();
    //var device = new Device();
    //var engine = new Engine();
    //var os = new OS();

    this.getBrowser = function () {
      var browser = {
        name: undefined,
        version: undefined
      };
      mapper.rgx.call(browser, ua, rgxmap.browser);
      browser.major = util.major(browser.version); // deprecated

      return browser;
    };

    this.getCPU = function () {
      var cpu = {
        architecture: undefined
      };
      mapper.rgx.call(cpu, ua, rgxmap.cpu);
      return cpu;
    };

    this.getDevice = function () {
      var device = {
        vendor: undefined,
        model: undefined,
        type: undefined
      };
      mapper.rgx.call(device, ua, rgxmap.device);
      return device;
    };

    this.getEngine = function () {
      var engine = {
        name: undefined,
        version: undefined
      };
      mapper.rgx.call(engine, ua, rgxmap.engine);
      return engine;
    };

    this.getOS = function () {
      var os = {
        name: undefined,
        version: undefined
      };
      mapper.rgx.call(os, ua, rgxmap.os);
      return os;
    };

    this.getResult = function () {
      return {
        ua: this.getUA(),
        browser: this.getBrowser(),
        engine: this.getEngine(),
        os: this.getOS(),
        device: this.getDevice(),
        cpu: this.getCPU()
      };
    };

    this.getUA = function () {
      return ua;
    };

    this.setUA = function (uastring) {
      ua = uastring; //browser = new Browser();
      //cpu = new CPU();
      //device = new Device();
      //engine = new Engine();
      //os = new OS();

      return this;
    };

    return this;
  };

  UAParser.VERSION = LIBVERSION;
  UAParser.BROWSER = {
    NAME: NAME,
    MAJOR: MAJOR,
    // deprecated
    VERSION: VERSION
  };
  UAParser.CPU = {
    ARCHITECTURE: ARCHITECTURE
  };
  UAParser.DEVICE = {
    MODEL: MODEL,
    VENDOR: VENDOR,
    TYPE: TYPE,
    CONSOLE: CONSOLE,
    MOBILE: MOBILE,
    SMARTTV: SMARTTV,
    TABLET: TABLET,
    WEARABLE: WEARABLE,
    EMBEDDED: EMBEDDED
  };
  UAParser.ENGINE = {
    NAME: NAME,
    VERSION: VERSION
  };
  UAParser.OS = {
    NAME: NAME,
    VERSION: VERSION
  }; //UAParser.Utils = util;
  ///////////
  // Export
  //////////
  // check js environment

  if (( false ? undefined : _typeof(exports)) !== UNDEF_TYPE) {
    // nodejs env
    if (( false ? undefined : _typeof(module)) !== UNDEF_TYPE && module.exports) {
      exports = module.exports = UAParser;
    } // TODO: test!!!!!!!!

    /*
    if (require && require.main === module && process) {
        // cli
        var jsonize = function (arr) {
            var res = [];
            for (var i in arr) {
                res.push(new UAParser(arr[i]).getResult());
            }
            process.stdout.write(JSON.stringify(res, null, 2) + '\n');
        };
        if (process.stdin.isTTY) {
            // via args
            jsonize(process.argv.slice(2));
        } else {
            // via pipe
            var str = '';
            process.stdin.on('readable', function() {
                var read = process.stdin.read();
                if (read !== null) {
                    str += read;
                }
            });
            process.stdin.on('end', function () {
                jsonize(str.replace(/\n$/, '').split('\n'));
            });
        }
    }
    */


    exports.UAParser = UAParser;
  } else {
    // requirejs env (optional)
    if (( false ? undefined : _typeof(__webpack_require__(/*! !webpack amd define */ "./node_modules/webpack/buildin/amd-define.js"))) === FUNC_TYPE && __webpack_require__(/*! !webpack amd options */ "./node_modules/webpack/buildin/amd-options.js")) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return UAParser;
      }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (window) {
      // browser env
      window.UAParser = UAParser;
    }
  } // jQuery/Zepto specific (optional)
  // Note:
  //   In AMD env the global scope should be kept clean, but jQuery is an exception.
  //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
  //   and we should catch that.


  var $ = window && (window.jQuery || window.Zepto);

  if (_typeof($) !== UNDEF_TYPE && !$.ua) {
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
})((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' ? window : this);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./src/js/common_head.bundle.js":
/*!**************************************!*\
  !*** ./src/js/common_head.bundle.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_adjust_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_modules/adjust.js */ "./src/js/_modules/adjust.js");
/* harmony import */ var _vendor_modernizr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_vendor/modernizr.js */ "./src/js/_vendor/modernizr.js");
/* harmony import */ var _vendor_modernizr_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_vendor_modernizr_js__WEBPACK_IMPORTED_MODULE_1__);




Object(_modules_adjust_js__WEBPACK_IMPORTED_MODULE_0__["default"])('js');

/***/ })

/******/ });
//# sourceMappingURL=common_head.js.map