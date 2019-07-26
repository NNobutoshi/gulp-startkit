(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _rescroll = _interopRequireDefault(require("../../js/_modules/rescroll.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {};
mdls.rescroll = new _rescroll.default({
  offsetTop: '.pl-localNav'
});
mdls.rescroll.on();

},{"../../js/_modules/rescroll.js":2}],2:[function(require,module,exports){
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
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.timeoutId = null;
    this.hash = '';
    this.eventName = "load.".concat(this.id, " hashchange.").concat(this.id);
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
      cancelAnimationFrame(this.timeoutId);

      if (!hash) {
        return this;
      }

      this.hash = '#' + hash.replace(/^#/, '');
      $w.scrollTop($w.scrollTop());
      this.timeoutId = requestAnimationFrame(function () {
        _timer();
      });

      function _timer(timestamp) {
        var progress;

        if (!start) {
          start = timestamp;
        }

        progress = timestamp - start;

        if (progress < settings.delay) {
          that.timeoutId = requestAnimationFrame(function () {
            _timer();
          });
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

},{"./utilities/offset.js":3}],3:[function(require,module,exports){
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

//# sourceMappingURL=rescroll.js.map
