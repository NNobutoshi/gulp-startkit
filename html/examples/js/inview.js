(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

var _scrollmanager = _interopRequireDefault(require("../../js/_modules/scrollmanager.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {};
mdls.scroll = new _scrollmanager.default();
mdls.scroll.inview(document.querySelectorAll('.pl-inviewTarget')[0], function (props) {
  if (props.inview === true) {
    (0, _jquery.default)(props.inviewTarget).addClass('js-isInView');
  } else {
    (0, _jquery.default)(props.inviewTarget).removeClass('js-isInView');
  }
}).run();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../js/_modules/scrollmanager.js":2}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

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
      delay: 16,
      eventRoot: window
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.offsetTop = this.settings.offsetTop;
    this.offsetBottom = this.settings.offsetBottom;
    this.callBacks = {};
    this.eventName = "scroll.".concat(this.id);
    this.eventRoot = this.settings.eventRoot;
    this.isRunning = false;
    this.lastSctop = 0;
    this.lastScBottom = 0;
    this.isScrollDown = null;
  }

  _createClass(ScrollManager, [{
    key: "runCallBacksAll",
    value: function runCallBacksAll() {
      var _this = this;

      var vwTop = this.eventRoot.pageYOffset,
          vwBottom = vwTop + window.innerHeight;
      var offsetTop = 0,
          offsetBottom = 0;

      if (typeof this.offsetTop === 'number') {
        offsetTop = this.offsetTop;
      } else if (typeof this.offsetTop === 'string') {
        offsetTop = _getTotalHeight(document.querySelectorAll(this.offsetTop));
      }

      if (typeof this.offsetBottom === 'number') {
        offsetBottom = this.offsetBottom;
      } else if (typeof this.offsetBottom === 'string') {
        offsetBottom = _getTotalHeight(document.querySelectorAll(this.offsetTop));
      }

      this.isScrollDown = vwTop > this.lastSctop;
      this.scTop = vwTop;
      this.scBottom = vwBottom;
      Object.keys(this.callBacks).forEach(function (key) {
        var props = _this.callBacks[key];
        var target = props.inviewTarget,
            rect,
            targetOffsetTop,
            targetOffsetBottom;

        if (target && target !== null) {
          rect = target.getBoundingClientRect();
          targetOffsetTop = rect.top + vwTop;
          targetOffsetBottom = rect.bottom + vwTop;

          if (targetOffsetTop < vwBottom - offsetBottom && targetOffsetBottom > vwTop + offsetTop) {
            props.inview = true;
          } else {
            props.inview = false;
          }
        }

        return props.callBack.call(_this, props, _this);
      });
      this.isRunning = false;
      this.lastSctop = scTop;
      this.lastScBottom = scBottom;
      return this;
    }
  }, {
    key: "add",
    value: function add(callBack, options) {
      var defaultSttings = {
        name: _getUniqueName(this.id),
        flag: false
      },
          settings = _jquery.default.extend({}, defaultSttings, options);

      settings.callBack = callBack;
      this.setUp();
      this.callBacks[settings.name] = settings;
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
    value: function on(callBack, options) {
      return this.add(callBack, options);
    }
  }, {
    key: "inview",
    value: function inview(target, callBack, options) {
      return this.add(callBack, options || {
        inviewTarget: target
      });
    }
  }, {
    key: "setUp",
    value: function setUp() {
      var _this2 = this;

      if (!this.callBacks.length) {
        (0, _jquery.default)(this.eventRoot).on(this.eventName, function () {
          _this2.run();
        });
      }

      return this;
    }
  }, {
    key: "run",
    value: function run() {
      var _this3 = this;

      if (!this.isRunning) {
        this.isRunning = true;

        if (requestAnimationFrame) {
          requestAnimationFrame(function () {
            _this3.runCallBacksAll();
          });
        } else {
          setTimeout(function () {
            _this3.runCallBacksAll();
          }, this.settintgs.delay);
        }
      }

      return this;
    }
  }]);

  return ScrollManager;
}();

exports.default = ScrollManager;

function _getTotalHeight(elem) {
  var total = 0;
  Array.prototype.forEach.call(elem, function (self) {
    total = total + (0, _jquery.default)(self).outerHeight(true);
  });
  return total;
}

function _getUniqueName(base) {
  return base + new Date().getTime() + counter++;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])

//# sourceMappingURL=inview.js.map
