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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/examples/js/tab.entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/examples/js/tab.entry.js":
/*!**************************************!*\
  !*** ./src/examples/js/tab.entry.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_modules_tab_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/_modules/tab.js */ "./src/js/_modules/tab.js");
/* harmony import */ var _js_modules_rescroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../js/_modules/rescroll.js */ "./src/js/_modules/rescroll.js");




var mdls = {};
mdls.rescroll = new _js_modules_rescroll_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
  offsetTop: '.pl-head'
});
mdls.rescroll.on();
mdls.tab = new _js_modules_tab_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
  wrapper: '.pl-sectionGroup',
  trigger: '.pl-tabmenu_anchor',
  target: '.pl-section',
  onLoad: function onLoad(prop) {
    setTimeout(function () {
      mdls.rescroll.scroll(prop.wrapper);
    }, 1);
  }
});
mdls.tab.on();

/***/ }),

/***/ "./src/js/_modules/polyfills/matches.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/polyfills/matches.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector;
}

/***/ }),

/***/ "./src/js/_modules/rescroll.js":
/*!*************************************!*\
  !*** ./src/js/_modules/rescroll.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Rescroll; });
/* harmony import */ var _utilities_offset_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities/offset.js */ "./src/js/_modules/utilities/offset.js");
/* harmony import */ var _vendor_rAf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_vendor/rAf.js */ "./src/js/_vendor/rAf.js");
/* harmony import */ var _vendor_rAf_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_vendor_rAf_js__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * rescroll.js
 */
// import $ from 'jquery';


var $ = window.jQuery,
    $w = $(window);

var Rescroll = /*#__PURE__*/function () {
  function Rescroll(options) {
    _classCallCheck(this, Rescroll);

    this.defaultSettings = {
      name: 'rescroll',
      offsetTop: 0,
      delay: 32
    };
    this.settings = $.extend({}, this.defaultSettings, options);
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.timeoutId = null;
    this.hash = '';
    this.eventName = "load.".concat(this.id, " hashchange.").concat(this.id);
    this.permit = true;
    this.locked = false;
  }

  _createClass(Rescroll, [{
    key: "on",
    value: function on() {
      var _this = this;

      $w.on("scroll.".concat(this.id), function () {
        _this.run();
      });
      $w.on("hashchange.".concat(this.id), function () {
        _this.permit = true;
      });
      $('html').on("click.".concat(this.id), 'a', function () {
        _this.permit = true;
      });
    }
  }, {
    key: "run",
    value: function run() {
      var settings = this.settings,
          hash = location.hash,
          that = this;
      var startTime = null;

      if (!hash || this.permit === false || this.locked === true) {
        return this;
      }

      this.hash = hash.replace(/^#(.*)/, '#$1');

      (function _try() {
        that.permit = false;
        requestAnimationFrame(function (timeStamp) {
          startTime = startTime === null ? timeStamp : startTime;

          if (timeStamp - startTime < settings.delay) {
            _try();
          } else {
            window.scrollTo(0, window.pageYoffset);
            that.scroll();
          }
        });
      })();

      return this;
    }
  }, {
    key: "scroll",
    value: function scroll(target) {
      var offsetTop = 0,
          targetElem;

      if (!target && !this.hash) {
        return this;
      }

      targetElem = target ? target : document.querySelector(this.hash);

      if (targetElem === null) {
        return this;
      }

      cancelAnimationFrame(this.timeoutId);

      if (typeof this.offsetTop === 'number') {
        offsetTop = this.offsetTop;
      } else if (typeof this.offsetTop === 'string') {
        offsetTop = _getTotalHeight(document.querySelectorAll(this.offsetTop));
      } else if (typeof this.offsetTop === 'function') {
        offsetTop = this.offsetTop.call(this, targetElem);
      }

      window.scrollTo(0, Object(_utilities_offset_js__WEBPACK_IMPORTED_MODULE_0__["default"])(targetElem).top - offsetTop);
    }
  }, {
    key: "lock",
    value: function lock() {
      this.locked = true;
    }
  }, {
    key: "unlock",
    value: function unlock() {
      this.locked = false;
    }
  }]);

  return Rescroll;
}();



function _getTotalHeight(elems) {
  var botoms = [];
  Array.prototype.forEach.call(elems, function (self) {
    botoms.push(self.getBoundingClientRect().bottom);
  });
  return Math.max.apply(null, botoms);
}

/***/ }),

/***/ "./src/js/_modules/tab.js":
/*!********************************!*\
  !*** ./src/js/_modules/tab.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Tab; });
/* harmony import */ var _utilities_closest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities/closest.js */ "./src/js/_modules/utilities/closest.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import $ from 'jquery';

var $ = window.jQuery;

var Tab = /*#__PURE__*/function () {
  function Tab(options) {
    _classCallCheck(this, Tab);

    this.defaultSettings = {
      name: 'tab',
      trigger: '',
      target: '',
      wrapper: '',
      className: 'js-selected',
      defaultIndex: 0,
      onLoad: null
    };
    this.settings = $.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.wrapperSelector = this.settings.wrapper;
    this.triggerSelector = this.settings.trigger;
    this.targetSelector = this.settings.target;
    this.triggerElemAll = document.querySelectorAll(this.triggerSelector);
    this.wrapperElemAll = document.querySelectorAll(this.wrapperSelector);
    this.selectedTrigger = null;
    this.selectedWrapper = null;
    this.selectedTarget = null;
    this.callBackforLoad = this.settings.onLoad;
    this.hash = null;
    this.windowEventName = "load.".concat(this.id, " hashchange.").concat(this.id);
    this.anchorEventName = "click.".concat(this.id);
  }

  _createClass(Tab, [{
    key: "on",
    value: function on() {
      var _this = this;

      var $w = $(window);
      $w.on(this.windowEventName, function () {
        _this.hash = location.hash || null;

        _this.runAll();

        if (typeof _this.callBackforLoad === 'function') {
          _this.callBackforLoad.call(_this, {
            trigger: _this.selectedTrigger,
            wrapper: _this.selectedWrapper,
            target: _this.selectedTarget
          });
        }
      });
      $(this.triggerElemAll).on(this.anchorEventName, function (e) {
        _this.hash = e.currentTarget.hash;
        e.preventDefault();
        history.pushState(null, null, location.pathname + _this.hash);

        _this.run(e);
      });
    }
  }, {
    key: "run",
    value: function run(e, index) {
      var indexNumber = typeof index === 'number' ? index : 0,
          triggerElem = e.currentTarget,
          wrapperElem = Object(_utilities_closest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(triggerElem, this.wrapperSelector),
          triggerElemAll = wrapperElem.querySelectorAll(this.triggerSelector),
          targetElemAll = wrapperElem.querySelectorAll(this.targetSelector),
          targetElem = wrapperElem.querySelector(this.hash);
      this.display({
        elements: triggerElemAll,
        targetElem: targetElem,
        key: 'hash',
        indexNumber: indexNumber
      });
      this.display({
        elements: targetElemAll,
        targetElem: targetElem,
        key: 'id',
        indexNumber: indexNumber
      });
    }
  }, {
    key: "runAll",
    value: function runAll(index) {
      var _this2 = this;

      var indexNumber = typeof index === 'number' ? index : 0;
      Array.prototype.forEach.call(this.wrapperElemAll, function (wrapper) {
        var targetElemAll = wrapper.querySelectorAll(_this2.targetSelector),
            triggerElemAll = wrapper.querySelectorAll(_this2.triggerSelector),
            targetElem = wrapper.querySelector(_this2.hash);

        _this2.display({
          elements: triggerElemAll,
          targetElem: targetElem,
          key: 'hash',
          indexNumber: indexNumber
        });

        _this2.display({
          elements: targetElemAll,
          targetElem: targetElem,
          key: 'id',
          indexNumber: indexNumber
        });
      });
      return this;
    }
  }, {
    key: "display",
    value: function display(arg) {
      var _this3 = this;

      var key = arg.key;
      Array.prototype.forEach.call(arg.elements, function (elem, i) {
        if (arg.targetElem === null) {
          if (i === arg.indexNumber) {
            elem.classList.add(_this3.settings.className);
          } else {
            elem.classList.remove(_this3.settings.className);
          }
        } else {
          if (_this3.hash === (key === 'id' ? '#' + elem[key] : elem[key])) {
            if (key === 'hash') {
              _this3.selectedTrigger = elem;
              _this3.selectedTarget = arg.targetElem;
              _this3.selectedWrapper = Object(_utilities_closest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arg.targetElem, _this3.wrapperSelector);
            }

            elem.classList.add(_this3.settings.className);
          } else {
            elem.classList.remove(_this3.settings.className);
          }
        }
      });
      return this;
    }
  }]);

  return Tab;
}();



/***/ }),

/***/ "./src/js/_modules/utilities/closest.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/utilities/closest.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return closest; });
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__);

function closest(elem, wrapper) {
  for (var closest = elem; closest; closest = closest.parentElement) {
    if (closest.matches(wrapper)) {
      break;
    }
  }

  return closest;
}

/***/ }),

/***/ "./src/js/_modules/utilities/offset.js":
/*!*********************************************!*\
  !*** ./src/js/_modules/utilities/offset.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return offset; });
function offset(elem) {
  var offset = {},
      rect = elem.getBoundingClientRect(),
      scTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
      scLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
  offset.top = rect.top + scTop;
  offset.left = rect.left + scLeft;
  return offset;
}

/***/ }),

/***/ "./src/js/_vendor/rAf.js":
/*!*******************************!*\
  !*** ./src/js/_vendor/rAf.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license
*/
(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
})();

/***/ })

/******/ });
//# sourceMappingURL=tab.js.map