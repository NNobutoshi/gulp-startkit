(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

var _locate = _interopRequireDefault(require("../../js/_modules/locate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {},
    TARGETSELECTOR = '.pl-nav_anchor';
mdls.locate = new _locate.default({
  target: TARGETSELECTOR
});
(0, _jquery.default)(TARGETSELECTOR).on('click', function (e) {
  history.pushState(null, null, e.currentTarget.href);
  (0, _jquery.default)('.pl-nav_item').removeClass('js-current');
  (0, _jquery.default)(mdls.locate.run().currentItem).parents('.pl-nav_item').addClass('js-current');
  e.preventDefault();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../js/_modules/locate.js":2}],2:[function(require,module,exports){
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

var Locate =
/*#__PURE__*/
function () {
  function Locate(options) {
    _classCallCheck(this, Locate);

    this.defaultSettings = {
      name: 'locate',
      target: '',
      indexRegex: /index\.[^/]+?$/
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.targetSelector = this.settings.target;
    this.target = document.querySelectorAll(this.targetSelector);
    this.currentItem = null;
  }

  _createClass(Locate, [{
    key: "run",
    value: function run() {
      var _this = this;

      var hostName = location.host,
          wPathname = location.pathname.replace(this.settings.indexRegex, '');
      Array.prototype.forEach.call(this.target, function (self) {
        var aPathname = self.pathname.replace(_this.settings.indexRegex, ''),
            aHost = self.host;

        if (hostName !== aHost) {
          return _this;
        } else {
          if (aPathname === wPathname) {
            _this.currentItem = self;
          }
        }
      });
      return this;
    }
  }]);

  return Locate;
}();

exports.default = Locate;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])

//# sourceMappingURL=locate.js.map
