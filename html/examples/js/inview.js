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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/examples/js/inview.entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/examples/js/inview.entry.js":
/*!*****************************************!*\
  !*** ./src/examples/js/inview.entry.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_modules_scrollmanager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/_modules/scrollmanager.js */ "./src/js/_modules/scrollmanager.js");
 // import $ from 'jquery';


var mdls = {};
mdls.scrollManager = new _js_modules_scrollmanager_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
  throttle: 0
});
mdls.scrollManager.on(function (ovserved) {
  if (ovserved.ratio > 0 && ovserved.ratio <= 1) {
    ovserved.inView = true;
    ovserved.target.classList.add('js-isInView');
  } else {
    ovserved.target.classList.remove('js-isInView');
  }
}, document.querySelector('.pl-inviewTarget'), {
  hookPoint: 0
});

/***/ }),

/***/ "./src/js/_modules/scrollmanager.js":
/*!******************************************!*\
  !*** ./src/js/_modules/scrollmanager.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ScrollManager; });
/* harmony import */ var _utilities_offset_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities/offset.js */ "./src/js/_modules/utilities/offset.js");
/* harmony import */ var _vendor_rAf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_vendor/rAf.js */ "./src/js/_vendor/rAf.js");
/* harmony import */ var _vendor_rAf_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_vendor_rAf_js__WEBPACK_IMPORTED_MODULE_1__);
function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
// import $ from 'jquery';


var $ = window.jQuery;
var counter = 0;

var ScrollManager = /*#__PURE__*/function () {
  function ScrollManager(options) {
    _classCallCheck(this, ScrollManager);

    this.defaultSettings = {
      name: 'scrollManager',
      topOffsetsSelector: '',
      bottomOffsetsSelector: '',
      delay: 32,
      eventRoot: window,
      throttle: 0,
      catchPoint: '100%'
    };
    this.settings = $.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.topOffsetsSelector = this.settings.topOffsetsSelector;
    this.bottomOffsetsSelector = this.settings.bottomOffsetsSelector;
    this.offsetTop = 0;
    this.offsetBottom = 0;
    this.callBacks = {};
    this.eventName = "scroll.".concat(this.id);
    this.eventRoot = this.settings.eventRoot;
    this.isRunning = false;
    this.lastSctop = 0;
    this.lastScBottom = 0;
    this.scrollDown = null;
    this.scrollUp = null;
    this.startTime = null;
  }

  _createClass(ScrollManager, [{
    key: "runCallBacksAll",
    value: function runCallBacksAll() {
      var _this = this;

      var scTop = this.scTop = this.eventRoot.pageYOffset,
          offsetTop = this.offsetTop = _getMaxOffset(this.topOffsetsSelector, 'top'),
          offsetBottom = this.offsetBottom = _getMaxOffset(this.bottomOffsetsSelector, 'bottom'),
          vwTop = this.vwTop = scTop - offsetTop,
          vwHeight = this.vwHeight = window.innerHeight - offsetTop - offsetBottom,
          catchPoint = this.catchPoint = _calcPoint(vwHeight, this.settings.catchPoint);

      Object.keys(this.callBacks).forEach(function (key) {
        var entry = _this.callBacks[key],
            targetElem = entry.targetElem || document.createElement('div'),
            rect = targetElem.getBoundingClientRect(),
            hookPoint = _calcPoint(rect.height, entry.hookPoint),
            range = catchPoint + (rect.height - hookPoint),
            scrollFrom = vwTop + catchPoint - (hookPoint + Object(_utilities_offset_js__WEBPACK_IMPORTED_MODULE_0__["default"])(targetElem).top),
            ratio = scrollFrom / range;

        entry.observed = $.extend(entry.observed, {
          name: entry.name,
          target: entry.targetElem,
          range: range,
          scroll: scrollFrom,
          ratio: ratio
        });
        entry.callBack.call(_this, entry.observed, _this);
      });
      this.isRunning = false;

      if (this.scTop > this.lastSctop) {
        this.scrollDown = true;
        this.scrollUp = false;
      } else {
        this.isScrollDown = false;
        this.scrollUp = true;
      }

      this.isRunning = false;
      this.lastSctop = this.scTop;
      this.lastScBottom = this.scBottom;
      return this;
    }
  }, {
    key: "add",
    value: function add(callBack, targetElem, options) {
      var defaultOptions = {
        targetElem: targetElem,
        name: _getUniqueName(this.id),
        flag: false,
        ovserved: {}
      },
          entry = $.extend({}, defaultOptions, options);
      entry.callBack = callBack;
      this.setUp();
      this.callBacks[entry.name] = entry;
      return this;
    }
  }, {
    key: "remove",
    value: function remove(name) {
      delete this.callBacks[name];
      return this;
    }
  }, {
    key: "on",
    value: function on(callBack, targetElem, options) {
      return this.add(callBack, targetElem, options);
    }
  }, {
    key: "off",
    value: function off(name) {
      return this.remove(name);
    }
  }, {
    key: "setUp",
    value: function setUp() {
      var _this2 = this;

      if (!this.callBacks.length) {
        $(this.eventRoot).on(this.eventName, function () {
          _this2.handle();
        });
      }

      return this;
    }
  }, {
    key: "handle",
    value: function handle() {
      var _this3 = this;

      var that = this;

      if (!this.isRunning) {
        this.isRunning = true;

        if (typeof this.settings.throttle === 'number' && this.settings.throttle > 0) {
          _throttle(this.runCallBacksAll);
        } else {
          requestAnimationFrame(function () {
            _this3.runCallBacksAll();
          });
        }
      }

      return this;

      function _throttle(func) {
        requestAnimationFrame(function (timeStamp) {
          if (that.startTime === null) {
            that.startTime = timeStamp;
          }

          if (timeStamp - that.startTime > that.settings.throttle) {
            that.startTime = null;
            func.call(that);
          } else {
            _throttle(func);
          }
        });
      }
    }
  }]);

  return ScrollManager;
}();



function _getMaxOffset(selector, pos) {
  var ret = 0,
      arry = [];
  var elements;

  if (typeof selector === 'number') {
    ret = (_readOnlyError("ret"), selector);
  } else if (selector && typeof selector === 'string') {
    elements = document.querySelectorAll(selector);
    Array.prototype.forEach.call(elements, function (self) {
      var style;

      if (!self) {
        return;
      }

      style = window.getComputedStyle(self);

      if (style.position !== 'fixed') {
        return;
      }

      if (pos === 'bottom') {
        arry.push(self.getBoundingClientRect().top);
      } else {
        arry.push(self.getBoundingClientRect().bottom);
      }
    });
  }

  if (ret.length) {
    ret = (_readOnlyError("ret"), Math.max.apply(null, ret));
  }

  return ret;
}

function _getUniqueName(base) {
  return base + new Date().getTime() + counter++;
}

function _calcPoint(base, val) {
  var ret = 0;

  if (typeof val === 'string') {
    if (val.indexOf('%') > -1) {
      ret = base * parseInt(val, 10) / 100;
    } else {
      ret = parseInt(val, 10);
    }
  } else if (typeof val === 'number') {
    ret = val;
  }

  return ret;
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
//# sourceMappingURL=inview.js.map