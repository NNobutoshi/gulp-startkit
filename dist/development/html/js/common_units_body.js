(self["webpackChunkproject_example"] = self["webpackChunkproject_example"] || []).push([["./js/common_units_body"],{

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
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ua-parser-js */ "./node_modules/ua-parser-js/src/ua-parser.js");
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ua_parser_js__WEBPACK_IMPORTED_MODULE_0__);

var uaParser = new (ua_parser_js__WEBPACK_IMPORTED_MODULE_0___default())();
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(className) {
  var elemHtml = document.documentElement,
      browser = uaParser.getBrowser();
  elemHtml.classList.add(className);
  elemHtml.classList.add(browser.name + browser.major);
}

/***/ }),

/***/ "./src/js/_modules/foo.js":
/*!********************************!*\
  !*** ./src/js/_modules/foo.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(callback) {
  if (typeof callback === 'function') {
    callback();
  }
}

/***/ }),

/***/ "./src/js/_modules/libs/adaptivehover.js":
/*!***********************************************!*\
  !*** ./src/js/_modules/libs/adaptivehover.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AdaptiveHover; }
/* harmony export */ });
/* harmony import */ var _polyfills_matches__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/matches */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_matches__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polyfills_matches__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _polyfills_closest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../polyfills/closest */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/eventmanager */ "./src/js/_modules/utilities/eventmanager.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * adaptivehover.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */




var doc = document;

var AdaptiveHover = /*#__PURE__*/function () {
  function AdaptiveHover(options) {
    _classCallCheck(this, AdaptiveHover);

    this.defaultSettings = {
      name: 'adaptiveHover',
      selectorTarget: '',
      selectorEventRoot: 'body',
      delayTime: 400,
      range: 10
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.selectorTarget = this.settings.selectorTarget;
    this.selectorEvetnRoot = this.settings.selectorEventRoot;
    this.elemTarget = doc.querySelector(this.selectorTarget);
    this.elemEventRoot = doc.querySelector(this.selectorEventRoot);
    this.callbackEnter = null;
    this.callbackLeave = null;
    this.eventNameEnter = "touchstart.".concat(this.id, " mouseover.").concat(this.id);
    this.eventNameLeave = "touchend.".concat(this.id, " mouseout.").concat(this.id);
    this.eventNameOutside = "touchend.".concat(this.id, " click.").concat(this.id);
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_3__.default(this.elemEventRoot);
  }

  _createClass(AdaptiveHover, [{
    key: "on",
    value: function on(callbackEnter, callbackLeave) {
      this.callbackEnter = callbackEnter;
      this.callbackLeave = callbackLeave;
      this.evtRoot.on(this.eventNameEnter, this.selectorTarget, this.handleEnter.bind(this)).on(this.eventNameLeave, this.selectorTarget, this.handleLeave.bind(this)).on(this.eventNameOutside, this.handleOutSide.bind(this));
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.clear();
      this.evtRoot.off(".".concat(this.id));
      return this;
    }
  }, {
    key: "handleEnter",
    value: function handleEnter(e) {
      this.enter(e);
    }
  }, {
    key: "handleLeave",
    value: function handleLeave(e, target) {
      var settings = this.settings,
          range = settings.range,
          isOriginPoint = _isOriginPoint(_getEventObj(e), this.pageX, this.pageY, range);

      if (!isOriginPoint && this.elemTarget === target && this.elemTarget.contains(e.relatedTarget) === false) {
        this.leave(e, this.callbackLeave);
      }
    }
  }, {
    key: "handleOutSide",
    value: function handleOutSide(e) {
      var settings = this.settings;

      if (!_isRelative(e.target, settings.selectorTarget) && this.isEntering === true) {
        this.clear();
        this.leave(e, this.callbackLeave);
      }
    }
  }, {
    key: "enter",
    value: function enter(e) {
      var _this = this;

      var eventObj = _getEventObj(e),
          settings = this.settings;

      if (this.isEntering === false) {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(function () {
          return _this.clear();
        }, settings.delayTime);
        this.pageX = eventObj.pageX;
        this.pageY = eventObj.pageY;
        this.isEntering = true;
        this.callbackEnter.call(this, e, this);
      }
    }
  }, {
    key: "leave",
    value: function leave(e) {
      if (this.isEntering === true) {
        clearTimeout(this.timeoutId);
        this.isEntering = false;
        this.callbackLeave.call(this, e, this);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      this.pageX = null;
      this.pageY = null;
    }
  }]);

  return AdaptiveHover;
}();



function _isOriginPoint(eventObj, pageX, pageY, range) {
  return eventObj.pageX > pageX - range && eventObj.pageX < pageX + range && eventObj.pageY > pageY - range && eventObj.pageY < pageY + range;
}

function _isRelative(elem, ancestor) {
  return elem.matches(ancestor) || elem.closest(ancestor);
}

function _getEventObj(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}

/***/ }),

/***/ "./src/js/_modules/libs/optimizedresize.js":
/*!*************************************************!*\
  !*** ./src/js/_modules/libs/optimizedresize.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ OptimizedResize; }
/* harmony export */ });
/* harmony import */ var _vendor_raf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_vendor/raf */ "./src/js/_vendor/raf.js");
/* harmony import */ var _vendor_raf__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_vendor_raf__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/eventmanager */ "./src/js/_modules/utilities/eventmanager.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * optimizedresize.js
 * Inspired by https://developer.mozilla.org
 */



var uniqueNumber = 0;

var OptimizedResize = /*#__PURE__*/function () {
  function OptimizedResize(options) {
    _classCallCheck(this, OptimizedResize);

    this.defaultSettings = {
      name: 'optimizedresize',
      delayTime: 100
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.callbacks = {};
    this.isRunning = false;
    this.eventName = "resize.".concat(this.id);
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__.default(window);
  }

  _createClass(OptimizedResize, [{
    key: "runCallbacksAll",
    value: function runCallbacksAll() {
      for (var key in this.callbacks) {
        var props = this.callbacks[key];
        var query = false;

        if (!props.query) {
          props.callback.call(this, props);
          props.lastQuery = query;
          continue;
        }

        query = window.matchMedia(props.query).matches;

        if ( // turn
        props.turn === true && query === true && props.lastQuery !== query || // one
        props.one === true && query === true || // cross
        props.cross === true && (query === true && props.lastQuery === false || query === false && props.lastQuery === true) || // on
        query === true && !props.one && !props.turn && !props.cross) {
          props.callback.call(this, props);
        }

        props.lastQuery = query;

        if (props.one === true && query === true) {
          this.remove(key);
        }
      } // for loop


      this.isRunning = false;
      return this;
    }
  }, {
    key: "add",
    value: function add(callback, options) {
      var settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1___default()({}, {
        // default
        name: _getUniqueName(this.id),
        query: '',
        one: false,
        turn: false,
        cross: false
      }, options);
      settings.callback = callback;
      this.setUp();
      this.callbacks[settings.name] = settings;
      return this;
    }
  }, {
    key: "remove",
    value: function remove(name) {
      delete this.callbacks[name];
    }
  }, {
    key: "off",
    value: function off(name) {
      this.remove(name);
    }
  }, {
    key: "on",
    value: function on(query, callback, name) {
      if (typeof query === 'function') {
        var _ref = [query, callback, ''];
        callback = _ref[0];
        name = _ref[1];
        query = _ref[2];
      }

      return this.add(callback, {
        name: name,
        query: query,
        one: false,
        turn: false,
        cross: false
      });
    }
  }, {
    key: "one",
    value: function one(query, callback, name) {
      return this.add(callback, {
        name: name,
        query: query,
        one: true,
        turn: false,
        cross: false
      });
    }
  }, {
    key: "turn",
    value: function turn(query, callback, name) {
      return this.add(callback, {
        name: name,
        query: query,
        one: false,
        turn: true,
        cross: false
      });
    }
  }, {
    key: "cross",
    value: function cross(query, callback, name) {
      return this.add(callback, {
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
      var _this = this;

      if (!Object.keys(this.callbacks).length) {
        this.evtRoot.on(this.eventName, function (e) {
          return _this.handleSetup(e);
        });
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.evtRoot.off(this.eventName);
    }
  }, {
    key: "handleSetup",
    value: function handleSetup() {
      this.run();
    }
  }, {
    key: "run",
    value: function run() {
      var delayTime = this.settings.delayTime,
          func = this.runCallbacksAll.bind(this);
      var startTime = null;

      if (this.isRunning === true) {
        return this;
      }

      this.isRunning = true;

      if (typeof delayTime === 'number' && delayTime > 0) {
        requestAnimationFrame(_throttle);
      } else {
        requestAnimationFrame(func);
      }

      return this;

      function _throttle(timeStamp) {
        if (startTime === null) {
          startTime = timeStamp;
        }

        if (timeStamp - startTime >= delayTime) {
          func();
        } else {
          requestAnimationFrame(_throttle);
        }
      }
    }
  }]);

  return OptimizedResize;
}();



function _getUniqueName(base) {
  return base + new Date().getTime() + uniqueNumber++;
}

/***/ }),

/***/ "./src/js/_modules/libs/scrollmanager.js":
/*!***********************************************!*\
  !*** ./src/js/_modules/libs/scrollmanager.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ScrollManager; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_position__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/position */ "./src/js/_modules/utilities/position.js");
/* harmony import */ var _vendor_raf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_vendor/raf */ "./src/js/_vendor/raf.js");
/* harmony import */ var _vendor_raf__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_vendor_raf__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/eventmanager */ "./src/js/_modules/utilities/eventmanager.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */




var doc = document;
var counter = 0;

var ScrollManager = /*#__PURE__*/function () {
  function ScrollManager(options) {
    _classCallCheck(this, ScrollManager);

    this.defaultSettings = {
      name: 'scrollManager',
      selectorOffsetTop: '',
      selectorOffsetBottom: '',
      selectorEventRoot: '',
      delayTime: 0,
      catchPoint: '100%'
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.selectorEventRoot = this.settings.selectorEventRoot;
    this.selectorOffsetTop = this.settings.selectorOffsetTop;
    this.selectorOffsetBottom = this.settings.selectorOffsetBottom;
    this.elemEventRoot = this.selectorEventRoot && doc.querySelector(this.selectorEventRoot) || window;
    this.callbacks = {};
    this.eventName = "scroll.".concat(this.id);
    this.isRunning = false;
    this.lastSctop = 0;
    this.scrollDown = null;
    this.scrollUp = null;
    this.startTime = null;
    this.catchPoint = this.settings.catchPoint;
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_3__.default(this.elemEventRoot);
  }

  _createClass(ScrollManager, [{
    key: "runCallbacksAll",
    value: function runCallbacksAll() {
      var scTop = this.elemEventRoot.pageYOffset,
          vwHeight = this.elemEventRoot.innerHeight;

      for (var key in this.callbacks) {
        var entry = this.callbacks[key],
            selectorOffsetTop = entry.selectorOffsetTop || this.selectorOffsetTop,
            selectorOffsetBottom = entry.selectorOffsetBottom || this.selectorOffsetBottom,
            offsetTop = _getMaxOffset(selectorOffsetTop, vwHeight, 'top'),
            offsetBottom = _getMaxOffset(selectorOffsetBottom, vwHeight, 'bottom'),
            vwTop = scTop + offsetTop,
            vwBottom = vwHeight - offsetTop - offsetBottom,
            catchPoint = _calcPoint(vwBottom, this.catchPoint),
            elemTarget = entry.elemTarget || document.createElement('div'),
            rect = elemTarget.getBoundingClientRect(),
            hookPoint = _calcPoint(rect.height, entry.observed.hookPoint || entry.hookPoint),
            range = catchPoint + (rect.height - hookPoint),
            scrollFrom = vwTop + catchPoint - (hookPoint + (0,_utilities_position__WEBPACK_IMPORTED_MODULE_1__.default)(elemTarget).top),
            ratio = scrollFrom / range;

        entry.observed = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()(entry.observed, {
          name: entry.name,
          target: entry.elemTarget,
          range: range,
          scroll: scrollFrom,
          ratio: ratio,
          catched: ratio >= 0 && ratio <= 1
        });
        entry.callback.call(this, entry.observed, this);
      } // for


      this.isRunning = false;

      if (scTop > this.lastSctop) {
        this.scrollDown = true;
        this.scrollUp = false;
      } else {
        this.scrollDown = false;
        this.scrollUp = true;
      }

      this.isRunning = false;
      this.lastSctop = scTop;
      return this;
    }
  }, {
    key: "add",
    value: function add(callback, elemTarget, options) {
      var defaultOptions = {
        name: _getUniqueName(this.id),
        elemTarget: elemTarget,
        flag: false,
        observed: {}
      },
          entry = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, defaultOptions, options);
      entry.callback = callback;
      this.setUp();
      this.callbacks[entry.name] = entry;
      return this;
    }
  }, {
    key: "remove",
    value: function remove(name) {
      delete this.callbacks[name];
      return this;
    }
  }, {
    key: "on",
    value: function on(callback, elemTarget, options) {
      return this.add(callback, elemTarget, options);
    }
  }, {
    key: "off",
    value: function off(name) {
      return this.remove(name);
    }
  }, {
    key: "setUp",
    value: function setUp() {
      var _this = this;

      if (!this.callbacks.length) {
        this.evtRoot.on(this.eventName, function () {
          return _this.handle();
        });
      }

      return this;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.evtRoot.off(this.eventName);
      return this;
    }
  }, {
    key: "handle",
    value: function handle() {
      var func = this.runCallbacksAll.bind(this),
          delayTime = this.settings.delayTime;
      var startTime = null;

      if (this.isRunning === true) {
        return;
      }

      this.isRunning = true;

      if (typeof delayTime === 'number' && delayTime > 0) {
        requestAnimationFrame(_throttle);
      } else {
        requestAnimationFrame(func);
      }

      return this;

      function _throttle(timeStamp) {
        if (startTime === null) {
          startTime = timeStamp;
        }

        if (timeStamp - startTime >= delayTime) {
          func();
        } else {
          requestAnimationFrame(_throttle);
        }
      }
    }
  }]);

  return ScrollManager;
}();



function _getMaxOffset(selector, vwHeight, pos) {
  var elems = selector && document.querySelectorAll(selector),
      _ref = pos === 'top' ? ['bottom', 'max'] : ['top', 'min'],
      _ref2 = _slicedToArray(_ref, 2),
      base = _ref2[0],
      maxOrMin = _ref2[1];

  var ret = 0,
      arryPositionNumber = [];

  if (!elems) {
    return ret;
  }

  var _iterator = _createForOfIteratorHelper(elems),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var elem = _step.value;

      if (window.getComputedStyle(elem).position === 'fixed') {
        arryPositionNumber.push(elem.getBoundingClientRect()[base]);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  ret = Math[maxOrMin].apply(null, arryPositionNumber);
  ret = pos === 'bottom' ? vwHeight - ret : ret;
  return ret < 0 ? 0 : ret;
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

/***/ "./src/js/_modules/libs/transitiontoggle.js":
/*!**************************************************!*\
  !*** ./src/js/_modules/libs/transitiontoggle.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Toggle; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/eventmanager */ "./src/js/_modules/utilities/eventmanager.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */


var doc = document;

var Toggle = /*#__PURE__*/function () {
  function Toggle(options) {
    _classCallCheck(this, Toggle);

    this.defaultSettings = {
      name: 'transitiontoggle',
      selectorTrigger: '',
      selectorTarget: '',
      selectorParent: '',
      selectorEventRoot: 'body'
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.selectorTrigger = this.settings.selectorTrigger;
    this.selectorTarget = this.settings.selectorTarget;
    this.selectorParent = this.settings.selectorParent;
    this.elemRoot = doc.querySelector(this.settings.selectorEventRoot);
    this.elemTrigger = doc.querySelector(this.selectorTrigger);
    this.elemTarget = doc.querySelector(this.selectorTarget);
    this.elemParent = this.selectorParent && doc.querySelector(this.selectorParent);
    this.elemParent = this.elemParent || this.elemTrigger.parentNode;
    this.callbackBefore = null;
    this.callbackAfter = null;
    this.callbackFinish = null;
    this.isChanged = false;
    this.eventNameStart = "click.".concat(this.id);
    this.eventNameFinish = "transitionend.".concat(this.id);
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_1__.default(this.elemRoot);
  }

  _createClass(Toggle, [{
    key: "on",
    value: function on(callbacks) {
      this.callbackBefore = callbacks.before.bind(this);
      this.callbackAfter = callbacks.after.bind(this);
      this.callbackFinish = callbacks.finish.bind(this);
      this.evtRoot.on(this.eventNameStart, this.selectorTrigger, this.handleStart.bind(this)).on(this.eventNameFinish, this.selectorTarget, this.handleFinish.bind(this));
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.elemParent = null;
      this.elemTrigger = null;
      this.elemTarget = null;
      this.callbackBefore = null;
      this.callbackAfter = null;
      this.callbackFinish = null;
      this.evtRoot.off('.' + this.id);
      return this;
    }
  }, {
    key: "handleStart",
    value: function handleStart(e) {
      if (this.isChanged === true) {
        this.after(e);
      } else {
        this.before(e);
      }

      return false;
    }
  }, {
    key: "handleFinish",
    value: function handleFinish(e) {
      if (typeof this.callbackFinish === 'function') {
        this.callbackFinish.call(this, e, this);
      }

      return false;
    }
  }, {
    key: "before",
    value: function before(e) {
      this.isChanged = true;
      this.callbackBefore.call(this, e, this);
    }
  }, {
    key: "after",
    value: function after(e) {
      this.isChanged = false;
      this.callbackAfter.call(this, e, this);
    }
  }]);

  return Toggle;
}();



/***/ }),

/***/ "./src/js/_modules/locate.js":
/*!***********************************!*\
  !*** ./src/js/_modules/locate.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Locate; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_parents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/parents */ "./src/js/_modules/utilities/parents.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var Locate = /*#__PURE__*/function () {
  function Locate(options) {
    _classCallCheck(this, Locate);

    this.defaultSettings = {
      name: 'locate',
      selectorTarget: '',
      selectorParents: '',
      indexRegex: /index\.[^/]+?$/
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.selectorTarget = this.settings.selectorTarget;
    this.selectorParents = this.settings.selectorParents;
    this.elemTargets = document.querySelectorAll(this.selectorTarget);
    this.elemCurrent = null;
    this.elemParents = null;
  }

  _createClass(Locate, [{
    key: "run",
    value: function run(callback) {
      var hostName = location.host,
          wPathname = location.pathname.replace(this.settings.indexRegex, ''),
          elemTargets = this.elemTargets;

      for (var i = 0, len = elemTargets.length; i < len; i++) {
        var elem = elemTargets[i],
            aPathname = elem.pathname.replace(this.settings.indexRegex, ''),
            aHost = elem.host;

        if (hostName !== aHost) {
          continue;
        } else if (aPathname === wPathname) {
          this.elemCurrent = elem;
          this.elemParents = (0,_utilities_parents__WEBPACK_IMPORTED_MODULE_1__.default)(this.elemCurrent, this.selectorParents, 'body');
        }
      }

      if (typeof callback === 'function') {
        callback.call(this, this);
      }

      return this;
    }
  }]);

  return Locate;
}();



/***/ }),

/***/ "./src/js/_modules/polyfills/closest.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/polyfills/closest.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _matches_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_matches_js__WEBPACK_IMPORTED_MODULE_0__);


if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var elem = this;

    do {
      if (Element.prototype.matches.call(elem, s)) {
        return elem;
      }

      elem = elem.parentElement || elem.parentNode;
    } while (elem !== null && elem.nodeType === 1);

    return null;
  };
}

/***/ }),

/***/ "./src/js/_modules/polyfills/matches.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/polyfills/matches.js ***!
  \**********************************************/
/***/ (function() {

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector;
}

/***/ }),

/***/ "./src/js/_modules/rescroll.js":
/*!*************************************!*\
  !*** ./src/js/_modules/rescroll.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Rescroll; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_position__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/position */ "./src/js/_modules/utilities/position.js");
/* harmony import */ var _polyfills_closest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./polyfills/closest */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _vendor_raf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_vendor/raf */ "./src/js/_vendor/raf.js");
/* harmony import */ var _vendor_raf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_vendor_raf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utilities/eventmanager */ "./src/js/_modules/utilities/eventmanager.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * rescroll.js
 */






var Rescroll = /*#__PURE__*/function () {
  function Rescroll(options) {
    _classCallCheck(this, Rescroll);

    this.defaultSettings = {
      name: 'rescroll',
      exclude: '',
      offsetTop: 0,
      selectorShoulder: null,

      /* スクロール先を肩代わりする要素 */
      animation: true,

      /* 所謂スムーススクロール */
      animeOption: {
        duration: 1000,
        easing: function easing(pos) {
          return 1 - Math.pow(1 - pos, 5);
        }
      }
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.isWorking = false;
    this.enabled = false;
    this.lastScrollY = window.pageYOffset;
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_4__.default(window);
    this.arryShoulderSelector = [];
    this.addShoulder(this.settings.selectorShoulder);
    this.eventNameLoad = "load.".concat(this.id);
    this.eventNameHashChange = "hashchange.".concat(this.id);
    this.eventNameClick = "click.".concat(this.id);
    this.eventNameScroll = "scroll.".concat(this.id);
  }

  _createClass(Rescroll, [{
    key: "on",
    value: function on() {
      this.evtRoot.on(this.eventNameLoad, this.handleLoad.bind(this)).on(this.eventNameHashChange, this.handleHashChange.bind(this)).on(this.eventNameClick, 'a', this.handleClick.bind(this)).on(this.eventNameScroll, this.handleScroll.bind(this));
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.evtRoot.off(".".concat(this.id));
      this.lastScrollY = null;
      this.enabled = false;
      this.isWorking = false;
      return this;
    }
  }, {
    key: "handleLoad",
    value: function handleLoad(e) {
      this.enabled = true;
      this.preprocess(e);
    }
  }, {
    key: "handleHashChange",
    value: function handleHashChange(e) {
      this.enabled = true;
      this.preprocess(e);
    }
  }, {
    key: "handleClick",
    value: function handleClick(e, target) {
      var hash = target && target.hash && this.getHash(target.hash);

      if (!hash && !document.querySelector(hash)) {
        return;
      }

      this.enabled = true;
      this.lastScrollY = window.pageYOffset;
      e.preventDefault();
      window.history.pushState(null, null, target.href);
      this.preprocess(e, target);
    }
    /**
     * スクロールの起点になるポイントを常に取得しておく。
     */

  }, {
    key: "handleScroll",
    value: function handleScroll(e) {
      var that = this;
      requestAnimationFrame(function () {
        if (that.enabled === false) {
          that.lastScrollY = window.pageYOffset;
        }
      });
    }
  }, {
    key: "preprocess",
    value: function preprocess(e, target) {
      var that = this;

      var hash = this.getHash(),
          arryShoulder = this.arryShoulderSelector,
          elemByHash = hash ? document.querySelector(hash) : null,
          elemShoulder = arryShoulder.length && elemByHash && _getShoulderElement(elemByHash);

      var lastScrollY = this.lastScrollY,
          currentScrollY = window.pageYOffset;
      /**
       * クリックされたA要素とジャンプ先を肩代わりする要素のY座標が同一であれば、
       * or すでに実行中であれば、
       * or 実行が許可されていなければ、
       * or ジャンプ先を肩代わりする要素も、hash をセレクターにして得られた要素も、どちらもなければ、
       * return
       */

      if (e.type === 'click' && target && target.hash && elemShoulder && (0,_utilities_position__WEBPACK_IMPORTED_MODULE_1__.default)(target).top === (0,_utilities_position__WEBPACK_IMPORTED_MODULE_1__.default)(elemShoulder).top || this.isWorking === true || this.enabled === false || !elemByHash && !elemShoulder) {
        this.isWorking = false;
        return this;
      }
      /**
       * デフォルトのスクロールを終えるのを待って改めてスクロールさせる
       * hashchange やload のevent でキャンセルできないため。
       */


      (function _retry() {
        requestAnimationFrame(function () {
          if (currentScrollY !== lastScrollY) {
            lastScrollY = currentScrollY;

            _retry();
          } else {
            that.isWorking = true;
            lastScrollY = null;

            if (that.settings.animation) {
              that.animatedScroll(elemShoulder || elemByHash);
            } else {
              that.scroll(elemShoulder || elemByHash);
            }
          }
        });
      })();

      return this;
      /**
       * スクロール先を肩代わりする要素を取得する。
       * 先祖の要素で限定。
       */

      function _getShoulderElement(elemTarget) {
        var arry = that.arryShoulderSelector;
        var elemClosest = null;

        if (!elemTarget) {
          return elemClosest;
        }

        for (var i = 0, len = arry.length; i < len; i++) {
          elemClosest = elemTarget.closest(arry[i]);

          if (elemClosest) {
            break;
          }
        }

        return elemClosest;
      }
    }
    /**
     * 通常のスクロール
     */

  }, {
    key: "scroll",
    value: function scroll(elemTarget) {
      var finishPoint = (0,_utilities_position__WEBPACK_IMPORTED_MODULE_1__.default)(elemTarget).top - this.offset();
      window.scrollTo(0, this.lastScrollY);
      window.scrollTo(0, finishPoint);
      this.isWorking = false;
      this.enabled = false;
      this.lastScrollY = finishPoint;
    }
    /**
     * スムーススクロール
     */

  }, {
    key: "animatedScroll",
    value: function animatedScroll(elemTarget) {
      var that = this;
      var duration = this.settings.animeOption.duration,
          easing = this.settings.animeOption.easing,
          startPoint = this.lastScrollY,
          finishPoint = (0,_utilities_position__WEBPACK_IMPORTED_MODULE_1__.default)(elemTarget).top - this.offset(),
          range = finishPoint - startPoint;
      var currentPoint = 0,
          startTime = null;
      window.scrollTo(0, startPoint);
      requestAnimationFrame(_scrollStep);

      function _scrollStep(time) {
        startTime = startTime || time;
        currentPoint = startPoint + range * easing.call(null, (time - startTime) / duration);
        window.scrollTo(0, currentPoint);

        if (time - startTime < duration) {
          requestAnimationFrame(_scrollStep);
        } else {
          that.isWorking = false;
          that.enabled = false;
          that.lastScrollY = finishPoint;
          window.scrollTo(0, finishPoint);
        }
      }

      return this;
    }
    /**
     * ビューポート上部でfixed されている要素等の、スクロール量から差し引かなければならないオフセットを取得する
     */

  }, {
    key: "offset",
    value: function offset() {
      var offsetTop = 0;

      if (typeof this.offsetTop === 'number') {
        offsetTop = this.offsetTop;
      } else if (typeof this.offsetTop === 'string') {
        offsetTop = _getMaxOffset(document.querySelectorAll(this.offsetTop));
      } else if (typeof this.offsetTop === 'function') {
        offsetTop = this.offsetTop.call(this, this);
      }

      return offsetTop;
    }
  }, {
    key: "getHash",
    value: function getHash(string) {
      var hash = string || window.location.hash;
      return hash && hash.replace(/^#?(.*)/, '#$1');
    }
  }, {
    key: "addShoulder",
    value: function addShoulder(selector) {
      if (selector && typeof selector === 'string') {
        this.arryShoulderSelector.push(selector);
      }
    }
  }]);

  return Rescroll;
}();



function _getMaxOffset(elems) {
  var bottoms = [];

  var _iterator = _createForOfIteratorHelper(elems),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var elem = _step.value;
      bottoms.push(elem.getBoundingClientRect().bottom);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return Math.max.apply(null, bottoms);
}

/***/ }),

/***/ "./src/js/_modules/simplevideoplay.js":
/*!********************************************!*\
  !*** ./src/js/_modules/simplevideoplay.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SimpleVideoPlay; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _polyfills_closest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfills/closest */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/eventmanager */ "./src/js/_modules/utilities/eventmanager.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var doc = document;

var SimpleVideoPlay = /*#__PURE__*/function () {
  function SimpleVideoPlay(options) {
    _classCallCheck(this, SimpleVideoPlay);

    this.defaultSettings = {
      name: 'SimpleVideoPlay',
      selectorVideo: '',
      selectorOuter: '',
      onBefore: null,
      onPlayBefore: null,
      onPlay: null,
      onPause: null,
      onEnd: null
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.selectorVideo = this.settings.selectorVideo;
    this.selectorOuter = this.settings.selectorOuter;
    this.elemVideo = doc.querySelector(this.selectorVideo);
    this.elemWrapper = this.elemVideo.closest(this.selectorOuter);
    this.elemCover = doc.createElement('div');
    this.evtNamecanPlay = "canplay.".concat(this.id);
    this.evtNamePlay = "play.".concat(this.id);
    this.evtNamePause = "pause.".concat(this.id);
    this.evtNameEnded = "ended.".concat(this.id);
    this.evtNameCoverClick = "click.".concat(this.id, " touchend.").concat(this.id);
    this.src = this.elemVideo.src;
    this.isPlaying = false;
    this.evtVideo = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__.default(this.elemVideo);
    this.evtCover = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__.default(this.elemCover);
    this.init();
  }

  _createClass(SimpleVideoPlay, [{
    key: "init",
    value: function init() {
      this.eventCall(this.settings.onBefore);
      this.elemWrapper.appendChild(this.elemCover);

      if (this.elemVideo.poster) {
        this.elemCover.style.backgroundImage = "url(".concat(this.elemVideo.poster, ")");
      }

      this.on();
      this.elemVideo.load();
    }
  }, {
    key: "on",
    value: function on() {
      this.evtVideo.on(this.evtNamecanPlay, this.handleCanplay.bind(this));
      this.evtVideo.on(this.evtNamePlay, this.handlePlay.bind(this));
      this.evtVideo.on(this.evtNamePause, this.handlePause.bind(this));
      this.evtVideo.on(this.evtNameEnded, this.handleEnded.bind(this));
    }
  }, {
    key: "off",
    value: function off() {
      this.evtVideo.off(".".concat(this.id));
      this.evtCover.off(".".concat(this.id));
    }
  }, {
    key: "handleCanplay",
    value: function handleCanplay() {
      this.eventCall(this.settings.onPlayBefore);
      this.evtCover.on(this.evtNameCoverClick, this.handleCoverClick.bind(this));
    }
  }, {
    key: "handlePlay",
    value: function handlePlay() {
      this.eventCall(this.settings.onPlay);
    }
  }, {
    key: "handlePause",
    value: function handlePause() {
      this.eventCall(this.settings.onPause);
    }
  }, {
    key: "handleEnded",
    value: function handleEnded() {
      this.eventCall(this.settings.onEnd);
    }
  }, {
    key: "handleCoverClick",
    value: function handleCoverClick(e) {
      e.preventDefault();

      if (this.isPlaying === false) {
        this.elemVideo.play();
      }
    }
  }, {
    key: "eventCall",
    value: function eventCall(func) {
      if (typeof func === 'function') {
        func.call(this, this);
      }
    }
  }]);

  return SimpleVideoPlay;
}();



/***/ }),

/***/ "./src/js/_modules/tab.js":
/*!********************************!*\
  !*** ./src/js/_modules/tab.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Tab; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _polyfills_closest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfills/closest */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/eventmanager */ "./src/js/_modules/utilities/eventmanager.js");


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var doc = document;

var Tab = /*#__PURE__*/function () {
  function Tab(options) {
    _classCallCheck(this, Tab);

    this.defaultSettings = {
      name: 'tab',
      selectorTrigger: '',
      selectorTarget: '',
      selectorWrapper: '',
      className: 'js-selected',
      defaultIndex: 0,
      onAllChange: null,
      onChange: null
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.selectorWrapper = this.settings.selectorWrapper;
    this.selectorTrigger = this.settings.selectorTrigger;
    this.selectorTarget = this.settings.selectorTarget;
    this.elemTriggerAll = doc.querySelectorAll(this.selectorTrigger);
    this.elemWrapperAll = doc.querySelectorAll(this.selectorWrapper);
    this.callbackAllChange = this.settings.onAllChange;
    this.callbackChange = this.settings.onChange;
    this.eventNameLoad = "DOMContentLoaded.".concat(this.id, " load.").concat(this.id, " hashchange.").concat(this.id);
    this.eventNameClick = "click.".concat(this.id);
    this.evtWindow = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__.default(window);
  }
  /**
   * click event はwindow に登録
   * trigger( タブメニュー ) 以外で、ページ内に該当のリンクが有る可能性を想定。
   */


  _createClass(Tab, [{
    key: "on",
    value: function on() {
      var _this = this;

      this.evtWindow.on(this.eventNameLoad, function (e, target) {
        return _this.handleLoad(e, target);
      }).on(this.eventNameClick, 'a', function (e, target) {
        return _this.handleClick(e, target);
      });
    }
  }, {
    key: "off",
    value: function off() {
      this.evtWindow.off(".".concat(this.id));
    }
  }, {
    key: "handleLoad",
    value: function handleLoad(e) {
      this.runAll(e);
    }
    /**
     * click された要素のhash と同じ値をもつtrigger をthis.elemTriggerAll から選出し、
     * this.run に引数として渡して実行。
     */

  }, {
    key: "handleClick",
    value: function handleClick(e, target) {
      var hash = target && target.hash && this.getHash(target.hash);
      var elemCurrentTrigger = null;
      e.preventDefault();

      if (!hash) {
        return;
      }

      var _iterator = _createForOfIteratorHelper(this.elemTriggerAll),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var elem = _step.value;

          if (hash === this.getHash(elem.hash)) {
            elemCurrentTrigger = elem;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (elemCurrentTrigger === null) {
        return;
      }

      this.run(elemCurrentTrigger);
    }
    /**
     * trigger と target を内包するwrapper 単位の実行。
     */

  }, {
    key: "run",
    value: function run(elemCurrentTrigger) {
      var elemTarget = doc.querySelector(this.getHash(elemCurrentTrigger.hash)),
          elemWrapper = elemTarget.closest(this.selectorWrapper),
          elemTriggerAll = elemWrapper.querySelectorAll(this.selectorTrigger),
          elemTargetAll = elemWrapper.querySelectorAll(this.selectorTarget);

      _setClassName(elemTriggerAll, elemCurrentTrigger, this.settings.className);

      _setClassName(elemTargetAll, elemTarget, this.settings.className);

      if (typeof this.callbackChange === 'function') {
        this.callbackChange.call(this, elemWrapper, this);
      }

      return this;

      function _setClassName(elemAll, elemTarget, className) {
        var _iterator2 = _createForOfIteratorHelper(elemAll),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var elem = _step2.value;

            if (elem === elemTarget) {
              elem.classList.add(className);
            } else {
              elem.classList.remove(className);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }
    /**
     * 全wrapper 要素毎の実行
     */

  }, {
    key: "runAll",
    value: function runAll() {
      var hash = this.getHash() // location.href のハッシュを取得
      ;
      var selectedWrapperByHash = null;

      var _iterator3 = _createForOfIteratorHelper(this.elemWrapperAll),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var elemWrapper = _step3.value;
          var elemTriggerAll = elemWrapper.querySelectorAll(this.selectorTrigger);
          var elemCurrentTrigger = void 0,
              elemActived = void 0;

          if (!elemTriggerAll.length) {
            continue;
          }

          var _iterator4 = _createForOfIteratorHelper(elemTriggerAll),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var elem = _step4.value;

              if (this.getHash(elem.hash) === hash) {
                elemCurrentTrigger = elem;
                selectedWrapperByHash = elemWrapper;
              }

              if (elem.classList.contains(this.settings.className)) {
                elemActived = elem;
              }
            } // for

            /**
             * location.href のhash を持つtrigger が無く、かつすでに選択済みのtrigger があれば、
             * ループの頭から
             */

          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          if (!elemCurrentTrigger && elemActived) {
            continue;
          }

          this.run(elemCurrentTrigger || elemTriggerAll[this.settings.defaultIndex]);
        } // for

      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      if (typeof this.callbackAllChange === 'function') {
        this.callbackAllChange.call(this, selectedWrapperByHash, this);
      }

      return this;
    }
  }, {
    key: "getHash",
    value: function getHash(string) {
      var hash = string || window.location.hash;
      return hash && hash.replace(/^#?(.*)/, '#$1');
    }
  }]);

  return Tab;
}();



/***/ }),

/***/ "./src/js/_modules/utilities/eventmanager.js":
/*!***************************************************!*\
  !*** ./src/js/_modules/utilities/eventmanager.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ EventManager; }
/* harmony export */ });
/* harmony import */ var _polyfills_closest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/closest */ "./src/js/_modules/polyfills/closest.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var EventManager = /*#__PURE__*/function () {
  function EventManager(elemEventer) {
    _classCallCheck(this, EventManager);

    this.listeners = {};
    this.elemEventer = elemEventer || document;
  }

  _createClass(EventManager, [{
    key: "on",
    value: function on(fullEventTypeNames, selectorTarget, listener, options) {
      if (typeof selectorTarget === 'function') {
        var _ref = [listener, selectorTarget, null];
        options = _ref[0];
        listener = _ref[1];
        selectorTarget = _ref[2];
      }

      this.setUp('add', fullEventTypeNames, selectorTarget, listener, options);
      return this;
    }
  }, {
    key: "off",
    value: function off(fullEventTypeNames, listener) {
      this.setUp('remove', fullEventTypeNames, null, listener);
      return this;
    }
  }, {
    key: "trigger",
    value: function trigger(fullEventTypeNames) {
      this.setUp('trigger', fullEventTypeNames);
      return this;
    }
    /**
     * 半角スペースで区切られた、複数分の、name space を含むfull のtype name 毎に処理。
     * "add"、"remove"、"trigger"と、渡されたprefix 引数で処理を分ける。
     */

  }, {
    key: "setUp",
    value: function setUp(prefix, fullEventTypeNames, selectorTarget, listener, options) {
      var _this = this;

      var that = this;
      fullEventTypeNames.split(' ').forEach(function (fullEventTypeName) {
        var _fullEventTypeName$sp = fullEventTypeName.split('.'),
            _fullEventTypeName$sp2 = _slicedToArray(_fullEventTypeName$sp, 2),
            eventType = _fullEventTypeName$sp2[0],
            nameSpace = _fullEventTypeName$sp2[1];

        var objListeners, mapListener, target;
        /**
         *  name space を含めたfull のevent type 名をキーに、
         *  listener を配列に格納したものを値にしたオブジェクトをthis.listeners に格納。
         *  同時にname space を取り除いたevent type 名でaddEventListnerに登録。
         */

        if (prefix === 'add' && eventType && typeof listener === 'function') {
          mapListener = new Map();
          mapListener.set(listener, function (e) {
            if (selectorTarget && typeof selectorTarget === 'string') {
              target = e.target.closest(selectorTarget);

              if (!target) {
                return;
              }
            }

            listener(e, target);
          });

          if (!_this.listeners[fullEventTypeName]) {
            _this.listeners[fullEventTypeName] = [];
          }

          _this.listeners[fullEventTypeName].push(mapListener);

          _this.setEventListener(prefix, eventType, mapListener.get(listener), options);
        } // if( prefix === 'add' )

        /**
         * this.listeners の中からそのkeyに、渡された引数fullEventTypeNames がフルで一致するもの、
         * event type 名だけが渡され、それが部分的に含まれるもの、
         * name space だけが渡され、それが部分的に含まれるものを収集。
         */


        if (prefix === 'remove' || prefix === 'trigger') {
          objListeners = _collectListeners(function (key) {
            return eventType && nameSpace && key === fullEventTypeName || eventType && key.indexOf(eventType) === 0 || nameSpace && !eventType && key.indexOf(".".concat(nameSpace)) >= 0;
          });
          /**
           * 収集したobject の中からprefix 引数に応じて、"remove" で、removeEventListener"の登録。
           * "trigger"でそのままlistner を実行。
           */

          var _loop = function _loop() {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
                typeName = _Object$entries$_i[0],
                arrListeners = _Object$entries$_i[1];

            if (prefix === 'remove') {
              delete that.listeners[typeName];
            }

            arrListeners.forEach(function (mapListener) {
              if (prefix === 'remove' && (!listener || mapListener.has(listener))) {
                _this.setEventListener(prefix, typeName, mapListener.values().next().value);
              } else if (prefix === 'trigger') {
                mapListener.values().next().value();
              }
            });
          };

          for (var _i2 = 0, _Object$entries = Object.entries(objListeners); _i2 < _Object$entries.length; _i2++) {
            _loop();
          }
        } // if ( prefix === 'remove' || prefix === 'trigger' )

      });
      /**
       * this.listeners の中から渡されたcondition 関数でtrue を返すkey と値を格納したobject を返す。
       */

      function _collectListeners(condition) {
        var objListeners = {};

        for (var _i3 = 0, _Object$entries2 = Object.entries(that.listeners); _i3 < _Object$entries2.length; _i3++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
              fullTypeName = _Object$entries2$_i[0],
              arrListeners = _Object$entries2$_i[1];

          if (condition.call(null, fullTypeName, arrListeners)) {
            var _fullTypeName$split = fullTypeName.split('.'),
                _fullTypeName$split2 = _slicedToArray(_fullTypeName$split, 1),
                typeName = _fullTypeName$split2[0];

            if (!objListeners[typeName]) {
              objListeners[typeName] = [];
            }

            objListeners[typeName] = objListeners[typeName].concat(arrListeners);
          }
        }

        return objListeners;
      }
    }
  }, {
    key: "setEventListener",
    value: function setEventListener(prefix, eventType, listener, options) {
      var arrElements = this.elemEventer.length ? Array.from(this.elemEventer) : [this.elemEventer];
      arrElements.forEach(function (elem) {
        elem["".concat(prefix, "EventListener")](eventType, listener, options);
      });
    }
  }]);

  return EventManager;
}();



/***/ }),

/***/ "./src/js/_modules/utilities/parents.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/utilities/parents.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ parents; }
/* harmony export */ });
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__);

function parents(elem, selector, wrapper) {
  var parents = [];
  var parent = elem.parentElement;
  wrapper = wrapper || 'body';

  while (!parent.matches(wrapper)) {
    if (parent.matches(selector)) {
      parents.push(parent);
    }

    parent = parent.parentElement;
  }

  return parents;
}

/***/ }),

/***/ "./src/js/_modules/utilities/position.js":
/*!***********************************************!*\
  !*** ./src/js/_modules/utilities/position.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ position; }
/* harmony export */ });
function position(elem) {
  var pos = {},
      rect = elem.getBoundingClientRect(),
      scTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
      scLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
  pos.top = rect.top + scTop;
  pos.left = rect.left + scLeft;
  return pos;
}

/***/ }),

/***/ "./src/js/_modules/videoground.js":
/*!****************************************!*\
  !*** ./src/js/_modules/videoground.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ VideoGround; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/eventmanager */ "./src/js/_modules/utilities/eventmanager.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var doc = document;

var VideoGround = /*#__PURE__*/function () {
  function VideoGround(options) {
    _classCallCheck(this, VideoGround);

    this.defaultSettings = {
      name: 'videoGround',
      src: '',
      waitTime: 10000,
      aspectRatio: 720 / 1280,
      actualHeightRatio: 1 / 1,
      selectorParent: '',
      selectorVideoFrame: '',
      attrVideo: ['muted', 'playsinline', 'loop'],
      onPlay: null,
      onPlayBefore: null,
      onLoad: null,
      onDestroy: null
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.selectorParent = this.settings.selectorParent;
    this.selectorVideoFrame = this.settings.selectorVideoFrame;
    this.elemVideo = _createVideo(this.settings.attrVideo);
    this.elemVideoFrame = doc.querySelector(this.selectorVideoFrame);
    this.elemParent = this.selectorParent && doc.querySelector(this.selectorParent);
    this.elemParent = this.elemParent || this.elemVideoFrame.parentNode;
    this.evtNamePlay = "play.".concat(this.id);
    this.evtNameCanPlay = "canplay.".concat(this.id);
    this.isPlaying = false;
    this.destroyTimerId = null;
    this.evtVideo = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_1__.default(this.elemVideo);
  }
  /**
   * play()が可能か事前に調べ、結果を待って各種設定、実行。
   * 無効の場合 this.destroy() 。
   */


  _createClass(VideoGround, [{
    key: "run",
    value: function run() {
      var _this = this;

      var settings = this.settings,
          elemVideo = this.elemVideo,
          elemVideoFrame = this.elemVideoFrame;
      this.autoDestroy();
      this.on();
      this.eventCall(settings.onBefore);
      /* eslint space-before-function-paren: 0 */

      _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.testPlay();

              case 2:
                _context.t0 = _context.sent;

                if (!(_context.t0 === false)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", _this.destroy());

              case 5:
                elemVideo.src = settings.src;
                elemVideoFrame.appendChild(elemVideo);

                _this.eventCall(settings.onPlayBefore);

                elemVideo.load();

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();

      return this;
    }
    /**
     * play()で再生が可能かどうか、ダミーのvideo を作成し、結果を返す
     */

  }, {
    key: "testPlay",
    value: function testPlay() {
      var _this2 = this;

      return new Promise(function (resolve) {
        var retries = 3,
            testVideo = _createVideo(_this2.settings.attrVideo);

        var timeoutId = null,
            currentTry = 0;
        testVideo.play();

        (function _try() {
          currentTry += 1;
          clearTimeout(timeoutId);
          timeoutId = null;

          if (testVideo.paused === false || currentTry > retries) {
            resolve(!testVideo.paused);
            return;
          }

          timeoutId = setTimeout(_try, 160);
        })();
      });
    }
  }, {
    key: "on",
    value: function on() {
      this.evtVideo.on(this.evtNamePlay, this.handlePlay.bind(this));
      this.evtVideo.on(this.evtNameCanPlay, this.handleCanPlay.bind(this));
      return this;
    }
  }, {
    key: "handlePlay",
    value: function handlePlay(e) {
      var settings = this.settings;
      clearTimeout(this.destroyTimerId);
      this.destroyTimerId = null;
      this.isPlaying = true;
      this.eventCall(settings.onPlay);
      this.evtVideo.off(this.evtNameCanPlay);
    }
  }, {
    key: "handleCanPlay",
    value: function handleCanPlay(e) {
      var settings = this.settings;
      this.elemVideo.play();
      this.eventCall(settings.onLoad);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var settings = this.settings;
      clearTimeout(this.destroyTimerId);

      if (this.elemVideoFrame.querySelector(settings.classNameTarget) !== null) {
        this.elemVideoFrame.removeChild(this.elemVideo);
      }

      this.eventCall(settings.onDestroy);
      this.evtVideo.off(".".concat(this.id));
      return this;
    }
    /**
     * 待機時間を過ぎれば、this.destroy() 。
     */

  }, {
    key: "autoDestroy",
    value: function autoDestroy() {
      var _this3 = this;

      this.destroyTimerId = setTimeout(function () {
        clearTimeout(_this3.destroyTimerId);
        _this3.destroyTimerId = null;

        _this3.destroy();
      }, this.settings.waitTime);
    }
    /**
     * ojbect-fit の代替。
     */

  }, {
    key: "resize",
    value: function resize() {
      var settings = this.settings,
          frameWidth = this.elemParent.offsetWidth,
          frameHeight = this.elemParent.offsetHeight,
          frameAspectRatio = frameHeight / frameWidth;

      if (frameAspectRatio > settings.aspectRatio) {
        this.elemVideo.style.width = 'auto';
        this.elemVideo.style.height = frameHeight * settings.actualHeightRatio + 'px';
      } else {
        this.elemVideo.style.width = 100 + '%';
        this.elemVideo.style.height = 'auto';
      }

      return this;
    }
  }, {
    key: "eventCall",
    value: function eventCall(func) {
      if (typeof func === 'function') {
        func.call(this, this);
      }
    }
  }]);

  return VideoGround;
}();



function _createVideo(props) {
  var elemVideo = doc.createElement('video');

  for (var i = 0, len = props.length; i < len; i++) {
    elemVideo.setAttribute(props[i], '');
    elemVideo[props[i]] = true;
  }

  return elemVideo;
}

/***/ })

}]);
//# sourceMappingURL=../sourcemaps/js/common_units_body.js.map