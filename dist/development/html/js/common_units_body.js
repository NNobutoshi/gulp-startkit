(self["webpackChunkproject_example"] = self["webpackChunkproject_example"] || []).push([["./js/common_units_body"],{

/***/ "./src/js/_modules/adaptivehover.js":
/*!******************************************!*\
  !*** ./src/js/_modules/adaptivehover.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AdaptiveHover; }
/* harmony export */ });
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_closest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/closest.js */ "./src/js/_modules/utilities/closest.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities/events */ "./src/js/_modules/utilities/events.js");
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
      target: '',
      timeout: 400,
      range: 10,
      eventRoot: document.body
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_2___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.target = null;
    this.eventRoot = this.settings.eventRoot;
    this.callBackForEnter = null;
    this.callBackForLeave = null;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
    this.enteringEventName = 'touchstart mouseover';
    this.leavingEventName = 'touchend mouseout';
    this.outSideEventName = 'touchend click';
  }

  _createClass(AdaptiveHover, [{
    key: "on",
    value: function on(callBackForEnter, callBackForLeave) {
      var settings = this.settings;
      new _utilities_events__WEBPACK_IMPORTED_MODULE_3__.default(this, this.eventRoot);
      this.callBackForEnter = callBackForEnter;
      this.callBackForLeave = callBackForLeave;
      this.target = document.querySelector(settings.target);
      this.eventRoot.on(this.enteringEventName, this.handleForEnter);
      this.eventRoot.on(this.leavingEventName, this.handleForLeave);
      this.eventRoot.on(this.outSideEventName, this.handleForOutSide);
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.clear();
      this.eventRoot.off(this.enteringEventName, this.handleForEnter);
      this.eventRoot.off(this.leavingEventName, this.handleForLeave);
      this.eventRoot.off(this.outSideEventName, this.handleForOutSide);
      return this;
    }
  }, {
    key: "handleForEnter",
    value: function handleForEnter(e) {
      if (this.target.isEqualNode(e.target)) {
        this.enter(e);
      }
    }
  }, {
    key: "handleForLeave",
    value: function handleForLeave(e) {
      var settings = this.settings,
          range = settings.range,
          isOriginPoint = _isOriginPoint(_getEventObj(e), this.pageX, this.pageY, range);

      if (!isOriginPoint && this.target === e.target && this.target.contains(e.relatedTarget) === false) {
        this.leave(e, this.callBackForLeave);
      }
    }
  }, {
    key: "handleForOutSide",
    value: function handleForOutSide(e) {
      var settings = this.settings;

      if (!_isRelative(settings.target, e.target) && this.isEntering === true) {
        this.clear();
        this.leave(e, this.callBackForLeave);
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
        this.callBackForEnter.call(this, e, this);
      }
    }
  }, {
    key: "leave",
    value: function leave(e) {
      if (this.isEntering === true) {
        clearTimeout(this.timeoutId);
        this.isEntering = false;
        this.callBackForLeave.call(this, e, this);
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

function _isRelative(ancestor, elem) {
  return elem.matches(ancestor) || (0,_utilities_closest_js__WEBPACK_IMPORTED_MODULE_1__.default)(elem, ancestor);
}

function _getEventObj(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}

/***/ }),

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
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(callBack) {
  if (typeof callBack === 'function') {
    callBack();
  }
}

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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Locate = /*#__PURE__*/function () {
  function Locate(options) {
    _classCallCheck(this, Locate);

    this.defaultSettings = {
      name: 'locate',
      target: '',
      indexRegex: /index\.[^/]+?$/
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.targetSelector = this.settings.target;
    this.target = document.querySelectorAll(this.targetSelector);
    this.currentItem = null;
  }

  _createClass(Locate, [{
    key: "run",
    value: function run(callBack) {
      var hostName = location.host,
          wPathname = location.pathname.replace(this.settings.indexRegex, ''),
          targets = this.target;

      for (var i = 0, len = targets.length; i < len; i++) {
        var self = targets[i],
            aPathname = self.pathname.replace(this.settings.indexRegex, ''),
            aHost = self.host;

        if (hostName !== aHost) {
          continue;
        } else if (aPathname === wPathname) {
          this.currentItem = self;
        }
      }

      if (typeof callBack === 'function') {
        callBack.call(this, this);
      }

      return this;
    }
  }]);

  return Locate;
}();



/***/ }),

/***/ "./src/js/_modules/optimizedresize.js":
/*!********************************************!*\
  !*** ./src/js/_modules/optimizedresize.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ OptimizedResize; }
/* harmony export */ });
/* harmony import */ var _vendor_rAf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_vendor/rAf.js */ "./src/js/_vendor/rAf.js");
/* harmony import */ var _vendor_rAf_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_vendor_rAf_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/events */ "./src/js/_modules/utilities/events.js");
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
    this.callBacks = {};
    this.isRunning = false;
    this.eventName = 'resize';
  }

  _createClass(OptimizedResize, [{
    key: "runCallBacksAll",
    value: function runCallBacksAll() {
      for (var key in this.callBacks) {
        var props = this.callBacks[key];
        var query = false;

        if (!props.query) {
          props.callBack.call(this, props);
          props.lastQuery = query;
          continue;
        }

        query = window.matchMedia(props.query).matches;

        if ( // turn
        props.turn === true && query === true && props.lastQuery !== query || // one
        props.one === true && query === true || // cross
        props.cross === true && (query === true && props.lastQuery === false || query === false && props.lastQuery === true) || // on
        query === true && !props.one && !props.turn && !props.cross) {
          props.callBack.call(this, props);
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
    value: function add(callBack, options) {
      var settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_1___default()({}, {
        // default
        name: _getUniqueName(this.id),
        query: '',
        one: false,
        turn: false,
        cross: false
      }, options);
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
      if (!Object.keys(this.callBacks).length) {
        new _utilities_events__WEBPACK_IMPORTED_MODULE_2__.default(this, window);
        window.on(this.eventName, this.handleForSetup);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      window.off(this.eventName, this.handleForSetup);
    }
  }, {
    key: "handleForSetup",
    value: function handleForSetup() {
      this.run();
    }
  }, {
    key: "run",
    value: function run() {
      var _this = this;

      if (!this.isRunning) {
        this.isRunning = true;
        requestAnimationFrame(function () {
          _this.runCallBacksAll();
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
/* harmony import */ var _utilities_offset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/offset */ "./src/js/_modules/utilities/offset.js");
/* harmony import */ var _vendor_rAf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_vendor/rAf */ "./src/js/_vendor/rAf.js");
/* harmony import */ var _vendor_rAf__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_vendor_rAf__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities/events */ "./src/js/_modules/utilities/events.js");
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
      offsetTop: 0,
      delay: 32
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.timeoutId = null;
    this.hash = '';
    this.eneble = true;
    this.locked = true;
    this.scrollCounter = 0;
    this.lastCounter = null;
  }

  _createClass(Rescroll, [{
    key: "on",
    value: function on() {
      new _utilities_events__WEBPACK_IMPORTED_MODULE_3__.default(this, window);
      window.on('scroll', this.handleForScroll);
      window.on('DOMContentLoaded hashchange', this.handleForHashChange);
      window.on('click', this.handleForClick);
    }
  }, {
    key: "handleForScroll",
    value: function handleForScroll() {
      this.run();
    }
  }, {
    key: "handleForHashChange",
    value: function handleForHashChange() {
      this.unlock();
    }
  }, {
    key: "handleForClick",
    value: function handleForClick(e) {
      if (e.target.tagName.toLowerCase() === 'a' && e.target.hash) {
        this.unlock();
      }
    }
  }, {
    key: "run",
    value: function run() {
      var hash = location.hash,
          that = this;

      if (!hash || this.locked === true) {
        return this;
      }

      this.scrollCounter++;
      this.hash = hash.replace(/^#(.*)/, '#$1');

      (function _try() {
        that.eneble = false;
        that.timeoutId = requestAnimationFrame(function () {
          if (that.scrollCounter !== that.lastCounter) {
            _try();

            that.lastCounter = that.scrollCounter;
          } else {
            that.lastCounter = null;
            that.scrollCounter = 0;
            that.scroll();
            that.lock();
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

      window.scrollTo(0, (0,_utilities_offset__WEBPACK_IMPORTED_MODULE_1__.default)(targetElem).top - offsetTop);
    }
  }, {
    key: "lock",
    value: function lock() {
      window.scrollTo(0, window.pageYOffset);
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
  var bottoms = [];
  Array.prototype.forEach.call(elems, function (self) {
    bottoms.push(self.getBoundingClientRect().bottom);
  });
  return Math.max.apply(null, bottoms);
}

/***/ }),

/***/ "./src/js/_modules/scrollmanager.js":
/*!******************************************!*\
  !*** ./src/js/_modules/scrollmanager.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ScrollManager; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_offset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/offset */ "./src/js/_modules/utilities/offset.js");
/* harmony import */ var _vendor_rAf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_vendor/rAf */ "./src/js/_vendor/rAf.js");
/* harmony import */ var _vendor_rAf__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_vendor_rAf__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities/events */ "./src/js/_modules/utilities/events.js");
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
      topOffsetsSelector: '',
      bottomOffsetsSelector: '',
      delay: 32,
      eventRoot: window,
      throttle: 0,
      catchPoint: '100%'
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.topOffsetsSelector = this.settings.topOffsetsSelector;
    this.bottomOffsetsSelector = this.settings.bottomOffsetsSelector;
    this.offsetTop = 0;
    this.offsetBottom = 0;
    this.callBacks = {};
    this.eventName = 'scroll';
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
            scrollFrom = vwTop + catchPoint - (hookPoint + (0,_utilities_offset__WEBPACK_IMPORTED_MODULE_1__.default)(targetElem).top),
            ratio = scrollFrom / range;

        entry.observed = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()(entry.observed, {
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
    value: function add(callBack, targetElem, options) {
      var defaultOptions = {
        targetElem: targetElem,
        name: _getUniqueName(this.id),
        flag: false,
        ovserved: {}
      },
          entry = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, defaultOptions, options);
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
      if (!this.callBacks.length) {
        new _utilities_events__WEBPACK_IMPORTED_MODULE_3__.default(this, this.eventRoot);
        this.eventRoot.on(this.eventName, this.handle);
      }

      return this;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.eventRoot.off(this.eventName, this.handle);
      return this;
    }
  }, {
    key: "handle",
    value: function handle() {
      var _this2 = this;

      var that = this;
      console.info('handleOk');

      if (!this.isRunning) {
        this.isRunning = true;

        if (typeof this.settings.throttle === 'number' && this.settings.throttle > 0) {
          _throttle(this.runCallBacksAll);
        } else {
          requestAnimationFrame(function () {
            _this2.runCallBacksAll();
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
/* harmony import */ var _js_modules_utilities_closest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../js/_modules/utilities/closest */ "./src/js/_modules/utilities/closest.js");
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/events */ "./src/js/_modules/utilities/events.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var SimpleVideoPlay = /*#__PURE__*/function () {
  function SimpleVideoPlay(options) {
    _classCallCheck(this, SimpleVideoPlay);

    this.defaultSettings = {
      name: 'SimpleVideoPlay',
      videoSelector: '',
      outerSelector: '',
      classNameOfCover: 'js-video_cover',
      classNameOfCanPlay: 'js-video--canPlay',
      classNameOfPlaying: 'js-video--isPlaying',
      classNameOfPaused: 'js-video--isPaused',
      classNameOfEnded: 'js-video--isEnded'
    };
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
    this.elemVideo = document.querySelector(this.settings.videoSelector);
    this.elemWrapper = (0,_js_modules_utilities_closest__WEBPACK_IMPORTED_MODULE_1__.default)(this.elemVideo, this.settings.outerSelector);
    this.id = this.settings.name;
    this.isPlaying = false;
    this.src = this.elemVideo.src;
    this.elemCover = document.createElement('div');
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
      new _utilities_events__WEBPACK_IMPORTED_MODULE_2__.default(this, this.elemVideo);
      new _utilities_events__WEBPACK_IMPORTED_MODULE_2__.default(this, this.elemCover);
      this.elemVideo.on('canplay', this.handleForCanplay);
      this.elemVideo.on('play', this.handleForPlay);
      this.elemVideo.on('pause', this.handleForPause);
      this.elemVideo.on('ended', this.handleForEnded);
    }
  }, {
    key: "off",
    value: function off() {
      this.elemVideo.off('canplay', this.handleForCanplay);
      this.elemVideo.off('play', this.handleForPlay);
      this.elemVideo.off('pause', this.handleForPause);
      this.elemVideo.off('ended', this.handleForEnded);
      this.elemCover.off('click touchend', this.handleForCoverClick);
    }
  }, {
    key: "handleForCanplay",
    value: function handleForCanplay() {
      this.elemWrapper.classList.add(this.settings.classNameOfCanPlay);
      this.elemCover.on('click touchend', this.handleForCoverClick);
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
/* harmony import */ var _utilities_closest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/closest */ "./src/js/_modules/utilities/closest.js");
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/events */ "./src/js/_modules/utilities/events.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





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
    this.settings = lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default()({}, this.defaultSettings, options);
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
    this.windowEventName = 'DOMContentLoaded hashchange';
    this.anchorEventName = 'click';
  }

  _createClass(Tab, [{
    key: "on",
    value: function on() {
      var _this = this;

      new _utilities_events__WEBPACK_IMPORTED_MODULE_2__.default(this, window);
      window.on(this.windowEventName, this.handleForWindowEvent);
      Array.prototype.forEach.call(this, function (elem) {
        new _utilities_events__WEBPACK_IMPORTED_MODULE_2__.default(_this, elem);
        elem.on(_this.anchorEventName, _this.handleForAnchorEvent);
      });
    }
  }, {
    key: "off",
    value: function off() {
      var _this2 = this;

      window.off(this.windowEventName, this.handleForWindowEvent);
      Array.prototype.forEach.call(this, function (elem) {
        elem.off(_this2.anchorEventName, _this2.handleForAnchorEvent);
      });
    }
  }, {
    key: "handleForWindowEvent",
    value: function handleForWindowEvent() {
      this.hash = location.hash || null;
      this.runAll();

      if (typeof this.callBackforLoad === 'function') {
        this.callBackforLoad.call(this, {
          trigger: this.selectedTrigger,
          wrapper: this.selectedWrapper,
          target: this.selectedTarget
        });
      }
    }
  }, {
    key: "handleForAnchorEvent",
    value: function handleForAnchorEvent(e) {
      this.hash = e.currentTarget.hash;
      e.preventDefault();
      history.pushState(null, null, location.pathname + this.hash);
      this.run(e);
    }
  }, {
    key: "run",
    value: function run(e, index) {
      var indexNumber = typeof index === 'number' ? index : 0,
          triggerElem = e.currentTarget,
          wrapperElem = (0,_utilities_closest__WEBPACK_IMPORTED_MODULE_1__.default)(triggerElem, this.wrapperSelector),
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
      var _this3 = this;

      var indexNumber = typeof index === 'number' ? index : 0;
      Array.prototype.forEach.call(this.wrapperElemAll, function (wrapper) {
        var targetElemAll = wrapper.querySelectorAll(_this3.targetSelector),
            triggerElemAll = wrapper.querySelectorAll(_this3.triggerSelector),
            targetElem = wrapper.querySelector(_this3.hash);

        _this3.display({
          elements: triggerElemAll,
          targetElem: targetElem,
          key: 'hash',
          indexNumber: indexNumber
        });

        _this3.display({
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
      var _this4 = this;

      var key = arg.key;
      Array.prototype.forEach.call(arg.elements, function (elem, i) {
        if (arg.targetElem === null) {
          if (i === arg.indexNumber) {
            elem.classList.add(_this4.settings.className);
          } else {
            elem.classList.remove(_this4.settings.className);
          }
        } else {
          if (_this4.hash === (key === 'id' ? '#' + elem[key] : elem[key])) {
            if (key === 'hash') {
              _this4.selectedTrigger = elem;
              _this4.selectedTarget = arg.targetElem;
              _this4.selectedWrapper = (0,_utilities_closest__WEBPACK_IMPORTED_MODULE_1__.default)(arg.targetElem, _this4.wrapperSelector);
            }

            elem.classList.add(_this4.settings.className);
          } else {
            elem.classList.remove(_this4.settings.className);
          }
        }
      });
      return this;
    }
  }]);

  return Tab;
}();



/***/ }),

/***/ "./src/js/_modules/transitiontoggle.js":
/*!*********************************************!*\
  !*** ./src/js/_modules/transitiontoggle.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Toggle; }
/* harmony export */ });
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mergeWith */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mergeWith__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/events */ "./src/js/_modules/utilities/events.js");
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
    this.eventRoot = this.settings.selectorEventRoot;
    this.elemParent = document.querySelector(this.settings.selectorParent);
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callBackForBefore = null;
    this.callBackForAfter = null;
    this.callBackForEnd = null;
    this.isChanged = false;
  }

  _createClass(Toggle, [{
    key: "on",
    value: function on(callBackForBefore, callBackForAfter, callBackForEnd) {
      var settings = this.settings;
      this.elemRoot = document.querySelector(this.eventRoot);

      if (this.elemParent === null) {
        return this;
      }

      new _utilities_events__WEBPACK_IMPORTED_MODULE_1__.default(this, this.elemRoot);
      this.elemTrigger = this.elemParent.querySelector(settings.selectorTrigger);
      this.elemTarget = this.elemParent.querySelector(settings.selectorTarget);
      this.callBackForBefore = callBackForBefore;
      this.callBackForAfter = callBackForAfter;
      this.callBackForEnd = callBackForEnd;
      this.elemRoot.on('click', this.handleForClick);
      this.elemRoot.on('transitionend', this.handleForTransitionend);
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.elemParent = null;
      this.elemTrigger = null;
      this.elemTarget = null;
      this.callBackForBefore = null;
      this.callBackForAfter = null;
      this.elemRoot.off('click', this.handleForClick);
      this.elemRoot.off('transitionend', this.handleForTransitionend);
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
    }
  }, {
    key: "handleForTransitionend",
    value: function handleForTransitionend(e) {
      if (this.elemTarget.isEqualNode(e.target) && this.isChanged === false) {
        if (typeof this.callBackForEnd === 'function') {
          this.callBackForEnd.call(this, e, this);
        }
      }
    }
  }, {
    key: "before",
    value: function before(e) {
      this.isChanged = true;
      this.callBackForBefore.call(this, e, this);
    }
  }, {
    key: "after",
    value: function after(e) {
      this.isChanged = false;
      this.callBackForAfter.call(this, e, this);
    }
  }]);

  return Toggle;
}();



/***/ }),

/***/ "./src/js/_modules/utilities/closest.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/utilities/closest.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ closest; }
/* harmony export */ });
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__);

function closest(elem, wrapper) {
  var closest = elem;

  for (; closest; closest = closest.parentElement) {
    if (closest.matches(wrapper)) {
      break;
    }
  }

  return closest;
}

/***/ }),

/***/ "./src/js/_modules/utilities/events.js":
/*!*********************************************!*\
  !*** ./src/js/_modules/utilities/events.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Events; }
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Events = /*#__PURE__*/function () {
  function Events(obj, target) {
    _classCallCheck(this, Events);

    target = target || document;
    target.on = Element.prototype.on = this.on;
    target.off = Element.prototype.off = this.off;
    target._bindObject = obj;
  }

  _createClass(Events, [{
    key: "on",
    value: function on(eventName, callBack, options) {
      callBack = callBack.bind(this._bindObject);

      _runOnOff('add', eventName, this, callBack, options);
    }
  }, {
    key: "off",
    value: function off(eventName, callBack) {
      callBack = callBack.bind(this._bindObject);

      _runOnOff('remove', eventName, this, callBack);
    }
  }]);

  return Events;
}();



function _runOnOff(state, eventName, eventElem, callBack, options) {
  var events = [];

  if (eventName.indexOf(' ') > -1) {
    events = eventName.split(' ');
  } else {
    events.push(eventName);
  }

  for (var i = 0, len = events.length; i < len; i++) {
    eventElem["".concat(state, "EventListener")](events[i], callBack, options);
  }
}

/***/ }),

/***/ "./src/js/_modules/utilities/offset.js":
/*!*********************************************!*\
  !*** ./src/js/_modules/utilities/offset.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ offset; }
/* harmony export */ });
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

/***/ "./src/js/_modules/utilities/parents.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/utilities/parents.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ closest; }
/* harmony export */ });
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__);

function closest(elem, selector, wrapper) {
  var parents = [];
  var parent = elem.parentElement;
  wrapper = wrapper || 'body';

  while (!parent.matches(wrapper)) {
    if (parent.matches(selector)) {
      console.info('matches');
      parents.push(parent);
    }

    parent = parent.parentElement;
  }

  return parents;
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
/* harmony import */ var core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");
/* harmony import */ var core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities/events */ "./src/js/_modules/utilities/events.js");
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
      new _utilities_events__WEBPACK_IMPORTED_MODULE_3__.default(this, this.elemVideo);
      this.elemVideo.on('play', this.handleForPlay);
      this.elemVideo.on('canplay', this.handleForCanPlay);
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

      this.off('canplay', this.handleForCanPlay);
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

      return this;
    }
  }, {
    key: "autoDestroy",
    value: function autoDestroy() {
      var _this2 = this;

      this.destroyTimerId = setTimeout(function () {
        clearTimeout(_this2.destroyTimerId);
        _this2.destroyTimerId = null;

        _this2.destroy();
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