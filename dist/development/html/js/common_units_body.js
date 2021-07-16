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





var AdaptiveHover = /*#__PURE__*/function () {
  function AdaptiveHover(options) {
    _classCallCheck(this, AdaptiveHover);

    this.defaultSettings = {
      name: 'adaptiveHover',
      selectorTarget: '',
      elemEventRoot: document.body,
      timeout: 400,
      range: 10
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.elemTarget = document.querySelector(this.settings.selectorTarget);
    this.elemEventRoot = this.settings.elemEventRoot;
    this.callbackForEnter = null;
    this.callbackForLeave = null;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
    this.enteringEventName = "touchstart.".concat(this.id, " mouseover.").concat(this.id);
    this.leavingEventName = "touchend.".concat(this.id, " mouseout.").concat(this.id);
    this.outSideEventName = "touchend.".concat(this.id, " click.").concat(this.id);
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_3__.default(this.elemEventRoot);
  }

  _createClass(AdaptiveHover, [{
    key: "on",
    value: function on(callbackForEnter, callbackForLeave) {
      this.callbackForEnter = callbackForEnter;
      this.callbackForLeave = callbackForLeave;
      this.evtRoot.on(this.enteringEventName, this.handleForEnter.bind(this)).on(this.leavingEventName, this.handleForLeave.bind(this)).on(this.outSideEventName, this.handleForOutSide.bind(this));
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
    key: "handleForEnter",
    value: function handleForEnter(e) {
      if (this.elemTarget.isEqualNode(e.target)) {
        this.enter(e);
      }
    }
  }, {
    key: "handleForLeave",
    value: function handleForLeave(e) {
      var settings = this.settings,
          range = settings.range,
          isOriginPoint = _isOriginPoint(_getEventObj(e), this.pageX, this.pageY, range);

      if (!isOriginPoint && this.elemTarget === e.target && this.elemTarget.contains(e.relatedTarget) === false) {
        this.leave(e, this.callbackForLeave);
      }
    }
  }, {
    key: "handleForOutSide",
    value: function handleForOutSide(e) {
      var settings = this.settings;

      if (!_isRelative(e.target, settings.selectorTarget) && this.isEntering === true) {
        this.clear();
        this.leave(e, this.callbackForLeave);
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
        }, settings.timeout);
        this.pageX = eventObj.pageX;
        this.pageY = eventObj.pageY;
        this.isEntering = true;
        this.callbackForEnter.call(this, e, this);
      }
    }
  }, {
    key: "leave",
    value: function leave(e) {
      if (this.isEntering === true) {
        clearTimeout(this.timeoutId);
        this.isEntering = false;
        this.callbackForLeave.call(this, e, this);
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
      delay: 16
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
    value: function on(callback, query, name) {
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
    value: function one(callback, query, name) {
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
    value: function turn(callback, query, name) {
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
    value: function cross(callback, query, name) {
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
          return _this.handleForSetup(e);
        });
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.evtRoot.off(this.eventName);
    }
  }, {
    key: "handleForSetup",
    value: function handleForSetup() {
      this.run();
    }
  }, {
    key: "run",
    value: function run() {
      var _this2 = this;

      if (!this.isRunning) {
        this.isRunning = true;
        requestAnimationFrame(function () {
          _this2.runCallbacksAll();
        });
      }

      return this;
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
function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */




var counter = 0;

var ScrollManager = /*#__PURE__*/function () {
  function ScrollManager(options) {
    _classCallCheck(this, ScrollManager);

    this.defaultSettings = {
      name: 'scrollManager',
      selectorOffsetTop: '',
      selectorOffsetBottom: '',
      delay: 32,
      elemEventRoot: window,
      throttle: 0,
      catchPoint: '100%'
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.elemEventRoot = this.settings.elemEventRoot;
    this.selectorOffsetTop = this.settings.selectorOffsetTop;
    this.selectorOffsetBottom = this.settings.selectorOffsetBottom;
    this.offsetTop = 0;
    this.offsetBottom = 0;
    this.callbacks = {};
    this.eventName = "scroll.".concat(this.id);
    this.isRunning = false;
    this.lastSctop = 0;
    this.lastScBottom = 0;
    this.scrollDown = null;
    this.scrollUp = null;
    this.startTime = null;
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_3__.default(this.settings.eventRoot);
  }

  _createClass(ScrollManager, [{
    key: "runCallbacksAll",
    value: function runCallbacksAll() {
      var _this = this;

      var scTop = this.scTop = this.elemEventRoot.pageYOffset,
          offsetTop = this.offsetTop = _getMaxOffset(this.selectorOffsetTop, 'top'),
          offsetBottom = this.offsetBottom = _getMaxOffset(this.selectorOffsetBottom, 'bottom'),
          vwTop = this.vwTop = scTop - offsetTop,
          vwHeight = this.vwHeight = window.innerHeight - offsetTop - offsetBottom,
          catchPoint = this.catchPoint = _calcPoint(vwHeight, this.settings.catchPoint);

      Object.keys(this.callbacks).forEach(function (key) {
        var entry = _this.callbacks[key],
            elemTarget = entry.elemTarget || document.createElement('div'),
            rect = elemTarget.getBoundingClientRect(),
            hookPoint = _calcPoint(rect.height, entry.hookPoint),
            range = catchPoint + (rect.height - hookPoint),
            scrollFrom = vwTop + catchPoint - (hookPoint + (0,_utilities_position__WEBPACK_IMPORTED_MODULE_1__.default)(elemTarget).top),
            ratio = scrollFrom / range;

        entry.observed = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()(entry.observed, {
          name: entry.name,
          target: entry.elemTarget,
          range: range,
          scroll: scrollFrom,
          ratio: ratio
        });
        entry.callback.call(_this, entry.observed, _this);
      });
      this.isRunning = false;

      if (this.scTop > this.lastSctop) {
        this.scrollDown = true;
        this.scrollUp = false;
      } else {
        this.scrollDown = false;
        this.scrollUp = true;
      }

      this.isRunning = false;
      this.lastSctop = this.scTop;
      this.lastScBottom = this.scBottom;
      return this;
    }
  }, {
    key: "add",
    value: function add(callback, elemTarget, options) {
      var defaultOptions = {
        elemTarget: elemTarget,
        name: _getUniqueName(this.id),
        flag: false,
        ovserved: {}
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
      var _this2 = this;

      if (!this.callbacks.length) {
        this.evtRoot.on(this.eventName, function () {
          return _this2.handle();
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
      var _this3 = this;

      var that = this;

      if (!this.isRunning) {
        this.isRunning = true;

        if (typeof this.settings.throttle === 'number' && this.settings.throttle > 0) {
          _throttle(this.runCallbacksAll);
        } else {
          requestAnimationFrame(function () {
            _this3.runCallbacksAll();
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



var Toggle = /*#__PURE__*/function () {
  function Toggle(options) {
    _classCallCheck(this, Toggle);

    this.defaultSettings = {
      name: 'transitiontoggle',
      selectorTrigger: '',
      selectorTarget: '',
      selectorParent: null,
      selectorEventRoot: 'body'
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.elemRoot = document.querySelector(this.settings.selectorEventRoot);
    this.elemParent = document.querySelector(this.settings.selectorParent);
    this.elemTrigger = this.elemParent.querySelector(this.settings.selectorTrigger);
    this.elemTarget = this.elemParent.querySelector(this.settings.selectorTarget);
    this.callbackForBefore = null;
    this.callbackForAfter = null;
    this.callbackForEnd = null;
    this.isChanged = false;
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_1__.default(this.elemRoot);
    this.evtTrigger = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_1__.default(this.elemTrigger);
  }

  _createClass(Toggle, [{
    key: "on",
    value: function on(callbackForBefore, callbackForAfter, callbackForEnd) {
      var _this = this;

      if (this.elemParent === null) {
        return this;
      }

      this.callbackForBefore = callbackForBefore;
      this.callbackForAfter = callbackForAfter;
      this.callbackForEnd = callbackForEnd;
      this.evtRoot.on("click.".concat(this.id), function (e) {
        return _this.handleForClick(e);
      });
      this.evtRoot.on("transitionend.".concat(this.id), function (e) {
        return _this.handleForTransitionend(e);
      });
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.elemParent = null;
      this.elemTrigger = null;
      this.elemTarget = null;
      this.callbackForBefore = null;
      this.callbackForAfter = null;
      this.evtRoot.off("click.".concat(this.id));
      return this;
    }
  }, {
    key: "handleForClick",
    value: function handleForClick(e) {
      if (this.elemTrigger.isEqualNode(e.target)) {
        if (this.isChanged === true) {
          this.after(e);
        } else {
          this.before(e);
        }
      }

      return false;
    }
  }, {
    key: "handleForTransitionend",
    value: function handleForTransitionend(e) {
      if (this.elemTarget.isEqualNode(e.target)) {
        if (typeof this.callbackForEnd === 'function') {
          this.callbackForEnd.call(this, e, this);
        }
      }

      return false;
    }
  }, {
    key: "before",
    value: function before(e) {
      this.isChanged = true;
      this.callbackForBefore.call(this, e, this);
    }
  }, {
    key: "after",
    value: function after(e) {
      this.isChanged = false;
      this.callbackForAfter.call(this, e, this);
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
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) {
        return el;
      }

      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

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
    this.timeoutId = null;
    this.hash = '';
    this.isWorking = false;
    this.enabled = false;
    this.lastScrollY = window.pageYOffset;
    this.evtRoot = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_4__.default(window);
    this.arryShoulderSelector = [];
    this.addShoulder(this.settings.selectorShoulder);
    this.eventName = {
      load: "load.".concat(this.id),
      hashChange: "hashchange.".concat(this.id),
      click: "click.".concat(this.id),
      scroll: "scroll.".concat(this.id)
    };
  }

  _createClass(Rescroll, [{
    key: "on",
    value: function on() {
      var _this = this;

      this.evtRoot.on(this.eventName.load, function (e) {
        return _this.handleForLoad(e);
      }).on(this.eventName.hashChange, function (e) {
        return _this.handleForHashChange(e);
      }).on(this.eventName.click, function (e) {
        return _this.handleForClick(e);
      }).on(this.eventName.scroll, function (e) {
        return _this.handleForScroll(e);
      });
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
    key: "handleForLoad",
    value: function handleForLoad(e) {
      this.enabled = true;
      this.preprocess(e);
    }
  }, {
    key: "handleForHashChange",
    value: function handleForHashChange(e) {
      this.enabled = true;
      this.preprocess(e);
    }
  }, {
    key: "handleForClick",
    value: function handleForClick(e) {
      var hash = e.target && e.target.hash && this.getHash(e.target.hash);

      if (!hash && !document.querySelector(hash)) {
        return;
      }

      this.enabled = true;
      this.lastScrollY = window.pageYOffset;
      e.preventDefault();
      window.history.pushState(null, null, e.target.href);
      this.preprocess(e);
    }
    /**
     * スクロールの起点になるポイントを常に取得しておく。
     */

  }, {
    key: "handleForScroll",
    value: function handleForScroll(e) {
      var that = this;
      requestAnimationFrame(function () {
        if (that.enabled === false) {
          that.lastScrollY = window.pageYOffset;
        }
      });
    }
  }, {
    key: "preprocess",
    value: function preprocess(e) {
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

      if (e.type === 'click' && e.target && e.target.hash && elemShoulder && (0,_utilities_position__WEBPACK_IMPORTED_MODULE_1__.default)(e.target).top === (0,_utilities_position__WEBPACK_IMPORTED_MODULE_1__.default)(elemShoulder).top || this.isWorking === true || this.enabled === false || !elemByHash && !elemShoulder) {
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
       * 先祖の要素でなければならない。
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
          that.lastScrollY = window.pageYOffset;
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
      var hash = string || window.location.hash || null;
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





var SimpleVideoPlay = /*#__PURE__*/function () {
  function SimpleVideoPlay(options) {
    _classCallCheck(this, SimpleVideoPlay);

    this.defaultSettings = {
      name: 'SimpleVideoPlay',
      selectorVideo: '',
      selectorOuter: '',
      classNameOfCover: 'js-video_cover',
      classNameOfCanPlay: 'js-video--canPlay',
      classNameOfPlaying: 'js-video--isPlaying',
      classNameOfPaused: 'js-video--isPaused',
      classNameOfEnded: 'js-video--isEnded'
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.isPlaying = false;
    this.elemVideo = document.querySelector(this.settings.selectorVideo);
    this.elemWrapper = this.elemVideo.closest(this.settings.selectorOuter);
    this.elemCover = document.createElement('div');
    this.src = this.elemVideo.src;
    this.evtVideo = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__.default(this.elemVideo);
    this.evtCover = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__.default(this.elemCover);
    this.init();
  }

  _createClass(SimpleVideoPlay, [{
    key: "init",
    value: function init() {
      this.elemCover.classList.add(this.settings.classNameOfCover);
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
      var _this = this;

      this.evtVideo.on("canplay.".concat(this.id), function () {
        _this.handleForCanplay();
      });
      this.evtVideo.on("play.".concat(this.id), function () {
        _this.handleForPlay();
      });
      this.evtVideo.on("pause.".concat(this.id), function () {
        _this.handleForPause();
      });
      this.evtVideo.on("ended.".concat(this.id), function () {
        _this.handleForEnded();
      });
    }
  }, {
    key: "off",
    value: function off() {
      this.evtVideo.off(".".concat(this.id));
      this.evtCover.off(".".concat(this.id));
    }
  }, {
    key: "handleForCanplay",
    value: function handleForCanplay() {
      var _this2 = this;

      this.elemWrapper.classList.add(this.settings.classNameOfCanPlay);
      this.evtCover.on("click.".concat(this.id, " touchend.").concat(this.id), function (e) {
        _this2.handleForCoverClick(e);
      });
    }
  }, {
    key: "handleForPlay",
    value: function handleForPlay() {
      this.elemWrapper.classList.add(this.settings.classNameOfPlaying);
      this.elemWrapper.classList.remove(this.settings.classNameOfPaused);
    }
  }, {
    key: "handleForPause",
    value: function handleForPause() {
      this.elemWrapper.classList.add(this.settings.classNameOfPaused);
      this.elemWrapper.classList.remove(this.settings.classNameOfPlaying);
    }
  }, {
    key: "handleForEnded",
    value: function handleForEnded() {
      this.elemWrapper.classList.add(this.settings.classNameOfEnded);
      this.elemWrapper.classList.remove(this.settings.classNameOfPaused);
      this.elemWrapper.classList.remove(this.settings.classNameOfPlaying);
    }
  }, {
    key: "handleForCoverClick",
    value: function handleForCoverClick(e) {
      e.preventDefault();

      if (this.isPlaying === false) {
        this.elemVideo.play();
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
      onLoad: null
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.selectorWrapper = this.settings.selectorWrapper;
    this.selectorTrigger = this.settings.selectorTrigger;
    this.selectorTarget = this.settings.selectorTarget;
    this.elemTriggerAll = document.querySelectorAll(this.selectorTrigger);
    this.elemWrapperAll = document.querySelectorAll(this.selectorWrapper);
    this.callbackForLoad = this.settings.onLoad;
    this.hash = null;
    this.eventNameLoad = "DOMContentLoaded.".concat(this.id, " load.").concat(this.id, " hashchange.").concat(this.id);
    this.eventNameClick = "click.".concat(this.id);
    this.evtWindow = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_2__.default(window);
  }

  _createClass(Tab, [{
    key: "on",
    value: function on() {
      var _this = this;

      this.evtWindow.on(this.eventNameLoad, function (e) {
        return _this.handleForLoad(e);
      }).on(this.eventNameClick, function (e) {
        return _this.handleForClick(e);
      });
    }
  }, {
    key: "off",
    value: function off() {
      this.evtWindow.off(".".concat(this.id));
    }
  }, {
    key: "handleForLoad",
    value: function handleForLoad(e) {
      this.runAll(e);
    }
  }, {
    key: "handleForClick",
    value: function handleForClick(e) {
      var hash = e.target && e.target.hash && this.getHash(e.target.hash);
      var elemCurrentTrigger = null;

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

      e.preventDefault();
      this.run(elemCurrentTrigger);
    }
  }, {
    key: "run",
    value: function run(elemCurrentTrigger) {
      var elemTrigger = elemCurrentTrigger,
          elemTarget = document.querySelector(this.getHash(elemTrigger.hash)),
          elemWrapper = elemTarget.closest(this.selectorWrapper),
          elemTriggerAll = elemWrapper.querySelectorAll(this.selectorTrigger),
          elemTargetAll = elemWrapper.querySelectorAll(this.selectorTarget);

      var _iterator2 = _createForOfIteratorHelper(elemTriggerAll),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var elem = _step2.value;

          if (elem === elemCurrentTrigger) {
            elem.classList.add(this.settings.className);
          } else {
            elem.classList.remove(this.settings.className);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var _iterator3 = _createForOfIteratorHelper(elemTargetAll),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _elem = _step3.value;

          if (_elem === elemTarget) {
            _elem.classList.add(this.settings.className);
          } else {
            _elem.classList.remove(this.settings.className);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "runAll",
    value: function runAll(e) {
      var hash = location.hash,
          that = this;
      var selectedWrapperByHash = null;

      var _iterator4 = _createForOfIteratorHelper(this.elemWrapperAll),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var elemWrapper = _step4.value;
          var elemTriggerAll = elemWrapper.querySelectorAll(that.selectorTrigger);
          var elemTrigger = void 0,
              elemActived = void 0;

          var _iterator5 = _createForOfIteratorHelper(elemTriggerAll),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var elem = _step5.value;

              if (elem.hash === hash) {
                elemTrigger = elem;
                selectedWrapperByHash = elemWrapper;
              }

              if (elem.classList.contains(that.settings.className)) {
                elemActived = elem;
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }

          if (!elemTriggerAll.length) {
            return true;
          }

          if (elemTrigger || !elemActived) {
            that.run(elemTrigger || elemTriggerAll[0]);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      if (typeof this.callbackForLoad === 'function') {
        this.callbackForLoad.call(null, selectedWrapperByHash, e);
      }

      return this;
    }
  }, {
    key: "getHash",
    value: function getHash(string) {
      if (string) {
        return string.replace(/^#?(.*)/, '#$1');
      } else {
        return window.location.hash.replace(/^#?(.*)/, '#$1');
      }
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
    value: function on(strEventName, callback, options) {
      this.setUp('add', strEventName, callback, options);
      return this;
    }
  }, {
    key: "off",
    value: function off(strEventName, callback) {
      this.setUp('remove', strEventName, callback);
      return this;
    }
  }, {
    key: "trigger",
    value: function trigger(strEventName) {
      this.setUp('trigger', strEventName);
      return this;
    }
  }, {
    key: "setUp",
    value: function setUp(prefix, strEventName, callback, options) {
      var _this = this;

      var that = this,
          arryEventNames = strEventName.split(' ');

      var _loop = function _loop(i, len) {
        var strEventName = arryEventNames[i],
            spritedNames = strEventName.split('.'),
            eventName = spritedNames[0],
            nameSpace = spritedNames[1];

        if (prefix === 'add' && eventName) {
          if (!_this.listeners[strEventName]) {
            _this.listeners[strEventName] = [];
          }

          _this.listeners[strEventName].push(callback);

          _this.setEventListener(prefix, eventName, callback, options);
        } // if( prefix === 'add' )


        if (prefix === 'remove') {
          var listeners = {};

          if (eventName && nameSpace) {
            listeners = _collectListeners(function (key) {
              return key === strEventName;
            });
          } else if (eventName) {
            listeners = _collectListeners(function (key) {
              return key.indexOf(eventName) === 0;
            });
          } else {
            listeners = _collectListeners(function (key) {
              return key.indexOf('.') <= key.lastIndexOf(nameSpace);
            });
          }

          for (var _i2 = 0, _Object$entries2 = Object.entries(listeners); _i2 < _Object$entries2.length; _i2++) {
            var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                key = _Object$entries2$_i[0],
                val = _Object$entries2$_i[1];

            for (var _i3 = 0, _len = val.length; _i3 < _len; _i3++) {
              if (typeof callback !== 'function' || val[_i3] === callback) {
                _this.setEventListener(prefix, key, val[_i3]);
              }
            }
          }
        } // if ( prefix === 'remove' )


        if (prefix === 'trigger') {
          if (eventName && nameSpace) {
            _collectListeners(function (key) {
              return key === strEventName;
            }, true);
          } else if (eventName) {
            _collectListeners(function (key) {
              return key.indexOf(eventName) === 0;
            }, true);
          } else {
            _collectListeners(function (key) {
              return key.indexOf('.') <= key.lastIndexOf(nameSpace);
            }, true);
          }
        } // if ( prefix === 'trigger' )

      };

      for (var i = 0, len = arryEventNames.length; i < len; i++) {
        _loop(i, len);
      } // for


      function _collectListeners(condition, calling) {
        var listeners = {};

        for (var _i = 0, _Object$entries = Object.entries(that.listeners); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              key = _Object$entries$_i[0],
              value = _Object$entries$_i[1];

          if (condition.call(null, key, value)) {
            var splitedKey = key.split('.');

            if (!listeners[splitedKey[0]]) {
              listeners[splitedKey[0]] = [];
            }

            listeners[splitedKey[0]] = listeners[splitedKey[0]].concat(value);
            delete that.listeners[key];
          }
        }

        if (calling) {
          for (var _key in listeners) {
            var arry = listeners[_key];
            arry.forEach(function (func) {
              func(null);
            });
          }
        } else {
          return listeners;
        }
      }
    }
  }, {
    key: "setEventListener",
    value: function setEventListener(prefix, eventName, callback, options) {
      var arryElements = this.elemEventer.length ? this.elemEventer : [this.elemEventer];
      Array.prototype.forEach.call(arryElements, function (elem) {
        elem["".concat(prefix, "EventListener")](eventName, callback, options);
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





var VideoGround = /*#__PURE__*/function () {
  function VideoGround(options) {
    _classCallCheck(this, VideoGround);

    this.defaultSettings = {
      name: 'videoGround',
      src: '',
      selectorVideoFrame: '',
      selectorParent: '',
      waitTime: 10000,
      aspectRatio: 720 / 1280,
      actualHeightRatio: 1 / 1,
      targetClassName: 'js--video',
      classNamePlaying: 'js--isPlaying',
      classNameDestroyed: 'js--isDestroyed',
      onDestroy: null,
      onPlay: null,
      onBefore: null,
      onLoad: null
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.elemVideo = null;
    this.elemVideoFrame = null;
    this.id = this.settings.name;
    this.isPlaying = false;
    this.destroyTimerId = null;
    this.elemVideo = _createVideo(['muted', 'playsinline', 'loop']);
    this.elemVideoFrame = document.querySelector(this.settings.selectorVideoFrame);
    this.elemParent = this.settings.selectorParent && this.elemVideoFrame !== null ? document.querySelector(this.settings.selectorParent) : this.elemVideoFrame.parentNode;
    this.evtVideo = new _utilities_eventmanager__WEBPACK_IMPORTED_MODULE_1__.default(this.elemVideo);
  }

  _createClass(VideoGround, [{
    key: "run",
    value: function run() {
      var _this = this;

      var settings = this.settings,
          elemVideo = this.elemVideo,
          elemVideoFrame = this.elemVideoFrame;

      if (elemVideoFrame === null) {
        return this;
      }

      this.autoDestroy();
      this.on();

      _eventCall(settings.onBefore);
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
                elemVideo.classList.add(settings.targetClassName);
                elemVideoFrame.appendChild(elemVideo);
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
  }, {
    key: "testPlay",
    value: function testPlay() {
      return new Promise(function (resolve) {
        var retries = 3,
            testVideo = _createVideo(['muted', 'playsinline']);

        var timeoutId = null,
            currentTry = 0;
        testVideo.play();

        (function _try() {
          currentTry = currentTry + 1;
          clearTimeout(timeoutId);
          timeoutId = null;

          if (testVideo.paused === false || currentTry > retries) {
            resolve(!testVideo.paused);
            return;
          }

          timeoutId = setTimeout(function () {
            _try();
          }, 160);
        })();
      });
    }
  }, {
    key: "on",
    value: function on() {
      var _this2 = this;

      this.evtVideo.on("play.".concat(this.id), function () {
        _this2.handleForPlay();
      });
      this.evtVideo.on("canplay.".concat(this.id), function (e) {
        _this2.handleForCanPlay(e);
      });
      return this;
    }
  }, {
    key: "handleForPlay",
    value: function handleForPlay() {
      var settings = this.settings;
      clearTimeout(this.destroyTimerId);
      this.destroyTimerId = null;
      this.isPlaying = true;
      document.body.classList.add(settings.classNamePlaying);

      _eventCall(settings.onPlay);
    }
  }, {
    key: "handleForCanPlay",
    value: function handleForCanPlay(e) {
      var settings = this.settings;
      this.elemVideo.play();

      _eventCall(settings.onLoad);

      this.evtVideo.off("canplay.".concat(this.id));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var settings = this.settings,
          elemBody = document.querySelector('body');
      clearTimeout(this.destroyTimerId);
      elemBody.classList.remove(settings.classNamePlaying);
      elemBody.classList.add(settings.classNameDestroyed);

      if (this.elemVideoFrame.querySelector(settings.targetClassName) !== null) {
        this.elemVideoFrame.removeChild(this.elemVideo);
      }

      _eventCall(this.settings.onDestroy);

      this.evtVideo.off(".".concat(this.id));
      return this;
    }
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
    }
  }]);

  return VideoGround;
}();



function _eventCall(f) {
  if (typeof f === 'function') {
    f.call(this);
  }
}

function _createVideo(props) {
  var elemVideo = document.createElement('video');

  for (var i = 0, len = props.length; i < len; i++) {
    elemVideo.setAttribute(props[i], '');
    elemVideo[props[i]] = true;
  }

  return elemVideo;
}

/***/ })

}]);
//# sourceMappingURL=../sourcemaps/js/common_units_body.js.map