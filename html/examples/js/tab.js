(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _tab = _interopRequireDefault(require("../../js/_modules/tab.js"));

var _rescroll = _interopRequireDefault(require("../../js/_modules/rescroll.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {};
mdls.rescroll = new _rescroll.default({
  offsetTop: '.pl-head'
});
mdls.rescroll.on();
mdls.tab = new _tab.default({
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

},{"../../js/_modules/rescroll.js":3,"../../js/_modules/tab.js":4}],2:[function(require,module,exports){
"use strict";

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector;
}

},{}],3:[function(require,module,exports){
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
    this.isWorking = false;
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
        _this.isWorking = false;
      });
      (0, _jquery.default)('body').on("click.".concat(this.id), 'a', function (e) {
        var a = e.currentTarget,
            l = location;

        if (a.hash === l.hash && a.host === l.host && a.pathname === l.pathname) {
          _this.isWorking = false;
        }
      });
    }
  }, {
    key: "run",
    value: function run() {
      var settings = this.settings,
          hash = location.hash,
          that = this;
      var startTime = null;

      if (!hash || this.isWorking === true || this.locked === true) {
        return this;
      }

      this.hash = hash.replace(/^#(.*)/, '#$1');

      (function _try() {
        requestAnimationFrame(function (timeStamp) {
          that.isWorking = true;
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
    botoms.push(self.getBoundingClientRect.bottom);
  });
  return Math.max.apply(null, botoms);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../_vendor/rAf.js":7,"./utilities/offset.js":6}],4:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

var _closest = _interopRequireDefault(require("./utilities/closest.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tab =
/*#__PURE__*/
function () {
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
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
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

      var $w = (0, _jquery.default)(window);
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
      (0, _jquery.default)(this.triggerElemAll).on(this.anchorEventName, function (e) {
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
          wrapperElem = (0, _closest.default)(triggerElem, this.wrapperSelector),
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
              _this3.selectedWrapper = (0, _closest.default)(arg.targetElem, _this3.wrapperSelector);
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

exports.default = Tab;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utilities/closest.js":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = closest;

require("../polyfills/matches.js");

function closest(elem, wrapper) {
  for (var closest = elem; closest; closest = closest.parentElement) {
    if (closest.matches(wrapper)) {
      break;
    }
  }

  return closest;
}

},{"../polyfills/matches.js":2}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

//# sourceMappingURL=tab.js.map
