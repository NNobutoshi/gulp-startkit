(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

var _rescroll = _interopRequireDefault(require("../../js/_modules/rescroll.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {};
mdls.rescroll = new _rescroll.default({
  offsetTop: '.pl-localNav'
});
mdls.rescroll.on();
(0, _jquery.default)('.pl-localNav_testLink').on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  window.scrollTo(0, 1000);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../js/_modules/rescroll.js":2}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

var _offset = _interopRequireDefault(require("./utilities/offset.js"));

require("../_vendor/rAf.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var $w = (0, _jquery.default)(window);

var Rescroll =
/*#__PURE__*/
function () {
  function Rescroll(options) {
    _classCallCheck(this, Rescroll);

    this.defaultSettings = {
      name: 'rescroll',
      offsetTop: 0,
      delay: 32
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
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
      (0, _jquery.default)('html').on("click.".concat(this.id), 'a', function () {
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

      window.scrollTo(0, (0, _offset.default)(targetElem).top - offsetTop);
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

exports.default = Rescroll;

function _getTotalHeight(elems) {
  var botoms = [];
  Array.prototype.forEach.call(elems, function (self) {
    botoms.push(self.getBoundingClientRect().bottom);
  });
  return Math.max.apply(null, botoms);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../_vendor/rAf.js":4,"./utilities/offset.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = offset;

function offset(elem) {
  var offset = {},
      rect = elem.getBoundingClientRect(),
      scTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
      scLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
  offset.top = rect.top + scTop;
  offset.left = rect.left + scLeft;
  return offset;
}

},{}],4:[function(require,module,exports){
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

//# sourceMappingURL=rescroll.js.map
