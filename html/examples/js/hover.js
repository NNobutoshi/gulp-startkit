(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

var _adaptivehover = _interopRequireDefault(require("../../js/_modules/adaptivehover.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {};
mdls.hover = new _adaptivehover.default({
  target: '.pl-hoverTarget'
});
mdls.hover.on(function (e, instance) {
  (0, _jquery.default)(instance.target).addClass('js-hover');
}, function (e, instance) {
  (0, _jquery.default)(instance.target).removeClass('js-hover');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../js/_modules/adaptivehover.js":2}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

(typeof window !== "undefined" ? window['Modernizr'] : typeof global !== "undefined" ? global['Modernizr'] : null);

require("./polyfills/matches.js");

var _closest = _interopRequireDefault(require("./utilities/closest.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AdaptiveHover =
/*#__PURE__*/
function () {
  function AdaptiveHover(options) {
    _classCallCheck(this, AdaptiveHover);

    this.defaultSettings = {
      name: 'adaptiveHover',
      target: '',
      timeout: 400,
      range: 10,
      eventRoot: document.querySelectorAll('body')[0]
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.target = null;
    this.eventRoot = this.settings.eventRoot;
    this.enteringEventName = '';
    this.leavingEventName = '';
    this.callBackForEnter = null;
    this.callBackForLeave = null;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
  }

  _createClass(AdaptiveHover, [{
    key: "on",
    value: function on(callBackForEnter, callBackForLeave) {
      var _this = this;

      var settings = this.settings,
          $root = (0, _jquery.default)(this.eventRoot);
      this.enteringEventName = "touchstart.".concat(this.id, " mouseenter.").concat(this.id);
      this.leavingEventName = "touchend.".concat(this.id, " mouseleave.").concat(this.id);
      this.callBackForEnter = callBackForEnter;
      this.callBackForLeave = callBackForLeave;
      this.target = document.querySelectorAll(settings.target)[0];
      $root.on(this.enteringEventName, settings.target, function (e) {
        _this.handleForEnter(e);
      });
      $root.on(this.leavingEventName, settings.target, function (e) {
        _this.handleForLeave(e);
      });
      $root.on("touchend.".concat(this.id, " click.").concat(this.id), function (e) {
        if (!_isRelative(settings.target, e.target) && _this.isEntering === true) {
          _this.clear();

          _this.leave(e, _this.callBackForLeave);
        }
      });
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      var settings = this.settings,
          $root = (0, _jquery.default)(this.eventRoot);
      this.clear();
      $root.off(this.enteringEventName, settings.target);
      $root.off(this.leavingEventName, settings.target);
      $root.off("touchend.".concat(this.id, " click.").concat(this.id));
      return this;
    }
  }, {
    key: "handleForEnter",
    value: function handleForEnter(e) {
      this.enter(e);
    }
  }, {
    key: "handleForLeave",
    value: function handleForLeave(e) {
      var settings = this.settings,
          range = settings.range,
          isOriginPoint = _isOriginPoint(_getEventObj(e), this.pageX, this.pageY, range);

      if (!isOriginPoint) {
        this.leave(e, this.callBackForLeave);
      }
    }
  }, {
    key: "enter",
    value: function enter(e) {
      var _this2 = this;

      var eventObj = _getEventObj(e),
          settings = this.settings;

      if (this.isEntering === false) {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(function () {
          return _this2.clear();
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

exports.default = AdaptiveHover;

function _isOriginPoint(eventObj, pageX, pageY, range) {
  return eventObj.pageX > pageX - range && eventObj.pageX < pageX + range && eventObj.pageY > pageY - range && eventObj.pageY < pageY + range;
}

function _isRelative(ancestor, elem) {
  return elem.matches(ancestor) || (0, _closest.default)(elem, ancestor);
}

function _getEventObj(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./polyfills/matches.js":3,"./utilities/closest.js":4}],3:[function(require,module,exports){
"use strict";

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector;
}

},{}],4:[function(require,module,exports){
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

},{"../polyfills/matches.js":3}]},{},[1])

//# sourceMappingURL=hover.js.map
