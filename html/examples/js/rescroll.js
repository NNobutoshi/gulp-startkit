(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _rescroll = _interopRequireDefault(require("../../js/_modules/rescroll.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mdls = {};
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

/*!
 * rescroll.js
 */
const $w = (0, _jquery.default)(window);

class Rescroll {
  constructor(options) {
    this.defaultSettings = {
      name: 'rescroll',
      offsetTop: 0,
      delay: 300
    };
    this.eventName = `load.${this.id} hashchange.${this.id}`;
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.timeoutId = null;
    this.flag = true;
    this.hash = '';
  }

  on() {
    $w.on(this.eventName, () => {
      this.run();
    });
  }

  run() {
    const settings = this.settings,
          hash = location.hash,
          that = this;
    let start = null;
    clearTimeout(this.timeoutId);

    if (!hash) {
      return this;
    }

    this.hash = '#' + hash.replace(/^#/, '');
    $w.scrollTop($w.scrollTop());
    this.timeoutId = requestAnimationFrame(_timer);

    function _timer(timestamp) {
      let progress;

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

  scroll(target) {
    const targetElem = target ? target : document.querySelector(this.hash);
    let offsetTop;

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

}

exports.default = Rescroll;

function _getTotalHeight(elem) {
  let total = 0;
  Array.prototype.forEach.call(elem, self => {
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
  const offset = {},
        rect = elem.getBoundingClientRect(),
        scTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
        scLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
  offset.top = rect.top + scTop;
  offset.left = rect.left + scLeft;
  return offset;
}

},{}]},{},[1])

//# sourceMappingURL=rescroll.js.map
