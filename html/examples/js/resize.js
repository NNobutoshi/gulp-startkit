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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/examples/js/resize.bundle.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/examples/js/resize.bundle.js":
/*!******************************************!*\
  !*** ./src/examples/js/resize.bundle.js ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_modules_optimizedresize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/_modules/optimizedresize.js */ "./src/js/_modules/optimizedresize.js");



var mdls = {};
mdls.resize = new _js_modules_optimizedresize_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
mdls.counter = 0;
mdls.resize.one(function (inst) {
  document.querySelector('.pl-test_one').textContent = inst.query;
}, '(min-width: 980px)').turn(function (inst) {
  document.querySelector('.pl-test_turn').textContent = inst.query;
}, '(min-width: 980px)', 'foo').turn(function (inst) {
  document.querySelector('.pl-test_turn').textContent = inst.query;
}, '(max-width: 979px)').on(function (inst) {
  document.querySelector('.pl-test_on').textContent = "".concat(inst.query, " == ").concat(mdls.counter++);
}, '(max-width: 374px)').cross(function () {
  console.info('cross');
}, '(max-width: 1000px)').run();

/***/ }),

/***/ "./src/js/_modules/optimizedresize.js":
/*!********************************************!*\
  !*** ./src/js/_modules/optimizedresize.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return OptimizedResize; });
/* harmony import */ var _vendor_rAf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_vendor/rAf.js */ "./src/js/_vendor/rAf.js");
/* harmony import */ var _vendor_rAf_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_vendor_rAf_js__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * optimizedresize.js
 * Inspired by https://developer.mozilla.org
 */
// import $ from 'jquery';

var $ = window.jQuery;
var counter = 0;

var OptimizedResize = /*#__PURE__*/function () {
  function OptimizedResize(options) {
    _classCallCheck(this, OptimizedResize);

    this.defaultSettings = {
      name: 'optimizedresize',
      delay: 16
    };
    this.settings = $.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.callBacks = {};
    this.isRunning = false;
    this.eventName = "resize.".concat(this.id);
  }

  _createClass(OptimizedResize, [{
    key: "runCallBacksAll",
    value: function runCallBacksAll() {
      var _this = this;

      Object.keys(this.callBacks).forEach(function (key) {
        var props = _this.callBacks[key];
        var query = false;

        if (props.query) {
          query = matchMedia(props.query).matches;

          if (query === true && (props.turn === true && props.lastQuery !== query || props.one === true || !props.one && !props.turn && !props.cross) || query === true && props.lastQuery === false || query === false && props.lastQuery === true) {
            props.callBack.call(_this, props);
          }

          props.lastQuery = query;

          if (props.one === true && query === true) {
            _this.remove(key);
          }
        } else {
          props.callBack.call(_this, props);
        }
      });
      this.isRunning = false;
      return this;
    }
  }, {
    key: "add",
    value: function add(callBack, options) {
      var defaultSettings = {
        name: _getUniqueName(this.id),
        query: '',
        one: false,
        turn: false
      },
          settings = $.extend({}, defaultSettings, options);
      settings.callBack = callBack;
      this.setUp();
      this.callBacks[settings.name] = settings;
      return this;
    }
  }, {
    key: "remove",
    value: function remove(name) {
      delete this.callBacks[name];
    }
  }, {
    key: "off",
    value: function off(name) {
      this.remove(name);
    }
  }, {
    key: "on",
    value: function on(callBack, query, name) {
      return this.add(callBack, {
        name: name,
        query: query,
        one: false,
        turn: false,
        cross: false
      });
    }
  }, {
    key: "one",
    value: function one(callBack, query, name) {
      return this.add(callBack, {
        name: name,
        query: query,
        one: true,
        turn: false,
        cross: false
      });
    }
  }, {
    key: "turn",
    value: function turn(callBack, query, name) {
      return this.add(callBack, {
        name: name,
        query: query,
        one: false,
        turn: true,
        cross: false
      });
    }
  }, {
    key: "cross",
    value: function cross(callBack, query, name) {
      return this.add(callBack, {
        name: name,
        query: query,
        one: false,
        turn: false,
        cross: true
      });
    }
  }, {
    key: "setUp",
    value: function setUp() {
      var _this2 = this;

      if (!Object.keys(this.callBacks).length) {
        $(window).on(this.eventName, function () {
          _this2.run();
        });
      }
    }
  }, {
    key: "run",
    value: function run() {
      var _this3 = this;

      if (!this.isRunning) {
        this.isRunning = true;
        requestAnimationFrame(function () {
          _this3.runCallBacksAll();
        });
      }

      return this;
    }
  }]);

  return OptimizedResize;
}();



function _getUniqueName(base) {
  return base + new Date().getTime() + counter++;
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
//# sourceMappingURL=resize.js.map