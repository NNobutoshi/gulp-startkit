(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'; // import $ from 'jquery';

var _scrollmanager = _interopRequireDefault(require("../../js/_modules/scrollmanager.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const
//   mdls = {}
// ;
// mdls.scrollManager = new ScrollManager( {
//   throttle : 0
// } );
// mdls.scrollManager
//   .on( document.querySelector( '.pl-inviewTarget' ), ( ovserved ) => {
//     console.time( 'scroll' );
//     if ( ovserved.ratio > 0 && ovserved.ratio <= 1 ) {
//       ovserved.inView = true;
//       ovserved.target.classList.add( 'js-isInView' );
//     } else {
//       ovserved.target.classList.remove( 'js-isInView' );
//     }
//     console.timeEnd( 'scroll' );
//   } )
// ;
var options = {
  root: window.documentBody,
  rootMargin: '0px',
  threshold: 0
};
var ovserver = new IntersectionObserver(function (what) {
  console.info(what);
}, options);
ovserver.observe(document.querySelector('.pl-inviewTarget'));

},{"../../js/_modules/scrollmanager.js":2}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

require("../_vendor/rAf.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var counter = 0;

var ScrollManager =
/*#__PURE__*/
function () {
  function ScrollManager(options) {
    _classCallCheck(this, ScrollManager);

    this.defaultSettings = {
      name: 'scrollManager',
      offsetTop: 0,
      offsetBottom: 0,
      delay: 32,
      eventRoot: window,
      throttle: 0
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
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
          scBottom = this.scBottom = scTop + window.innerHeight,
          offsetTop = this.offsetTop = _getTotalHeight(this.settings.offsetTop),
          offsetBottom = this.offsetBottom = _getTotalHeight(this.settings.offsetBottom),
          vwTop = this.vwTop = scTop - offsetTop,
          vwBottom = this.vwBottom = scBottom - this.offsetBottom,
          vwHeight = this.vwHeight = window.innerHeight - offsetTop - offsetBottom;

      Object.keys(this.callBacks).forEach(function (key) {
        var entry = _this.callBacks[key],
            targetElem = entry.targetElem,
            rect = targetElem.getBoundingClientRect(),
            range = rect.height + vwHeight,
            scrollFromRectTop = vwBottom - (vwTop + rect.top),
            ratio = scrollFromRectTop / range;
        entry.observed = _jquery.default.extend(entry.observed, {
          name: entry.name,
          target: entry.targetElem,
          range: range,
          scroll: scrollFromRectTop,
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
    value: function add(targetElem, callBack, options) {
      var defaultOptions = {
        targetElem: targetElem,
        name: _getUniqueName(this.id),
        flag: false,
        ovserved: {}
      },
          entry = _jquery.default.extend({}, defaultOptions, options);

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
    value: function on(targetElem, callBack, options) {
      return this.add(targetElem, callBack, options);
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
        (0, _jquery.default)(this.eventRoot).on(this.eventName, function () {
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

exports.default = ScrollManager;

function _getTotalHeight(arg) {
  var elem,
      total = 0;

  if (typeof arg === 'number') {
    total = arg;
  } else if (arg === 'string') {
    elem = document.querySelectorAll(arg);
    Array.prototype.forEach.call(elem, function (self) {
      total = total + (0, _jquery.default)(self).outerHeight(true);
    });
  }

  return total;
}

function _getUniqueName(base) {
  return base + new Date().getTime() + counter++;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../_vendor/rAf.js":3}],3:[function(require,module,exports){
"use strict";

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

},{}]},{},[1])

//# sourceMappingURL=inview.js.map
