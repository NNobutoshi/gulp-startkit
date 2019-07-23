(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _optimizedresize = _interopRequireDefault(require("../../js/_modules/optimizedresize.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {};
mdls.resize = new _optimizedresize.default();
mdls.resize.one(function () {
  console.info('one');
}, '(min-width: 980px)').turn(function () {
  console.info('(min-width: 980px)');
}, '(min-width: 980px)', 'foo').turn(function () {
  console.info('(max-width: 979px)');
}, '(max-width: 979px)').on(function () {
  console.info('(max-width: 374px)');
  mdls.resize.off('foo');
}, '(max-width: 374px)').run();

},{"../../js/_modules/optimizedresize.js":2}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

(typeof window !== "undefined" ? window['Modernizr'] : typeof global !== "undefined" ? global['Modernizr'] : null);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var counter = 0;

var OptimizedResize =
/*#__PURE__*/
function () {
  function OptimizedResize(options) {
    _classCallCheck(this, OptimizedResize);

    this.defaultSettings = {
      name: 'optimizedresize',
      delay: 16
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.eventName = "resize.".concat(this.id);
    this.callBacks = {};
    this.isRunning = false;
  }

  _createClass(OptimizedResize, [{
    key: "runCallBacksAll",
    value: function runCallBacksAll() {
      var _this = this;

      Object.keys(this.callBacks).forEach(function (key) {
        var props = _this.callBacks[key];
        var query = false;

        if (props.query) {
          query = matchMedia(props.query).matches;

          if (query === true && (props.turn === true && props.lastQuery !== query || props.one === true || !props.one && !props.turn)) {
            props.callBack.call(_this, props);
          }

          props.lastQuery = query;

          if (props.one === true && query === true) {
            _this.remove(key);
          }
        } else {
          props.callBack(_this, props);
        }
      });
      this.isRunning = false;
      return this;
    }
  }, {
    key: "add",
    value: function add(callBack, options) {
      var defaultSettings = {
        name: _getUniqueName(this.id),
        query: '',
        one: false,
        turn: false
      },
          settings = _jquery.default.extend({}, defaultSettings, options);

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
        turn: false
      });
    }
  }, {
    key: "one",
    value: function one(callBack, query, name) {
      return this.add(callBack, {
        name: name,
        query: query,
        one: true,
        turn: false
      });
    }
  }, {
    key: "turn",
    value: function turn(callBack, query, name) {
      return this.add(callBack, {
        name: name,
        query: query,
        one: false,
        turn: true
      });
    }
  }, {
    key: "setUp",
    value: function setUp() {
      var _this2 = this;

      if (!Object.keys(this.callBacks).length) {
        (0, _jquery.default)(window).on(this.eventName, function () {
          _this2.run();
        });
      }
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

  return OptimizedResize;
}();

exports.default = OptimizedResize;

function _getUniqueName(base) {
  return base + new Date().getTime() + counter++;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])

//# sourceMappingURL=resize.js.map
