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
      delay: 300
    };
    this.eventName = "load.".concat(this.id, " hashchange.").concat(this.id);
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.timeoutId = null;
    this.flag = true;
    this.hash = '';
  }

  _createClass(Rescroll, [{
    key: "on",
    value: function on() {
      var _this = this;

      $w.on(this.eventName, function () {
        _this.run();
      });
    }
  }, {
    key: "run",
    value: function run() {
      var settings = this.settings,
          hash = location.hash,
          that = this;
      var start = null;
      clearTimeout(this.timeoutId);

      if (!hash) {
        return this;
      }

      this.hash = '#' + hash.replace(/^#/, '');
      $w.scrollTop($w.scrollTop());
      this.timeoutId = requestAnimationFrame(_timer);

      function _timer(timestamp) {
        var progress;

        if (!start) {
          start = timestamp;
        }

        progress = timestamp - start;

        if (progress < settings.delay) {
          that.timeoutId = requestAnimationFrame(_timer);
        } else {
          that.scroll();
        }
      }
    }
  }, {
    key: "scroll",
    value: function scroll(target) {
      var offsetTop, targetElem;

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
      }

      scrollTo(0, (0, _offset.default)(targetElem).top - offsetTop);
    }
  }]);

  return Rescroll;
}();

exports.default = Rescroll;

function _getTotalHeight(elem) {
  var total = 0;
  Array.prototype.forEach.call(elem, function (self) {
    total = total + (0, _jquery.default)(self).outerHeight(true);
  });
  return total;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utilities/offset.js":6}],4:[function(require,module,exports){
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
    this.callBackforLoad = typeof this.settings.onLoad === 'function' ? this.settings.onLoad : null;
    this.hash = null;
  }

  _createClass(Tab, [{
    key: "on",
    value: function on() {
      var _this = this;

      var $w = (0, _jquery.default)(window);
      $w.on("load.".concat(this.id, " hashchange.").concat(this.id), function (e) {
        _this.hash = location.hash || null;

        _this.runAll(e);

        if (_this.callBackforLoad) {
          _this.callBackforLoad.call(_this, {
            trigger: _this.selectedTrigger,
            wrapper: _this.selectedWrapper,
            target: _this.selectedTarget
          });
        }
      });
      (0, _jquery.default)(this.triggerElemAll).on("click.".concat(this.id), function (e) {
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
    value: function runAll(e, index) {
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

},{}]},{},[1])

//# sourceMappingURL=tab.js.map
