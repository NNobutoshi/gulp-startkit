(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _simplevideoplay = _interopRequireDefault(require("../../js/_modules/simplevideoplay.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _simplevideoplay.default({
  outerSelector: '.pl-videoPlayer_outer',
  videoSelector: '.pl-videoPlayer_video'
});

},{"../../js/_modules/simplevideoplay.js":3}],2:[function(require,module,exports){
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

var _closest = _interopRequireDefault(require("../../js/_modules/utilities/closest.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SimpleVideoPlay =
/*#__PURE__*/
function () {
  function SimpleVideoPlay(options) {
    _classCallCheck(this, SimpleVideoPlay);

    this.defaultSettings = {
      name: 'SimpleVideoPlay',
      videoSelector: '',
      outerSelector: '',
      classNameOfCover: 'js-video_cover',
      classNameOfCanPlay: 'js-video--canPlay',
      classNameOfPlaying: 'js-video--isPlaying',
      classNameOfPaused: 'js-video--isPaused',
      classNameOfEnded: 'js-video--isEnded'
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);

    if (this.settings.videoSelector === '' && this.settings.videoOuterSelector === '') {
      // error
      console.info('e');
    }

    this.elemVideo = document.querySelector(this.settings.videoSelector);
    this.elemWrapper = (0, _closest.default)(this.elemVideo, this.settings.outerSelector);
    this.id = this.settings.name;
    this.isPlaying = false;
    this.src = this.elemVideo.src;
    this.elemCover = document.createElement('div');
    this.init();
  }

  _createClass(SimpleVideoPlay, [{
    key: "init",
    value: function init() {
      this.elemCover.classList.add(this.settings.classNameOfCover);
      this.elemWrapper.appendChild(this.elemCover);

      if (this.elemVideo.poster) {
        this.elemCover.style.backgroundImage = "url(".concat(this.elemVideo.poster, ")");
      }

      this.on();
      this.elemVideo.load();
    }
  }, {
    key: "on",
    value: function on() {
      var _this = this;

      (0, _jquery.default)(this.elemVideo).on("canplay.".concat(this.id), function () {
        _this.elemWrapper.classList.add(_this.settings.classNameOfCanPlay);

        (0, _jquery.default)(_this.elemCover).on("click.".concat(_this.id, " touchend.").concat(_this.id), function (e) {
          e.preventDefault();

          if (_this.isPlaying === false) {
            _this.elemVideo.play();
          }
        });
      });
      (0, _jquery.default)(this.elemVideo).on("play.".concat(this.id), function () {
        _this.elemWrapper.classList.add(_this.settings.classNameOfPlaying);

        _this.elemWrapper.classList.remove(_this.settings.classNameOfPaused);
      });
      (0, _jquery.default)(this.elemVideo).on("pause.".concat(this.id), function () {
        _this.elemWrapper.classList.add(_this.settings.classNameOfPaused);

        _this.elemWrapper.classList.remove(_this.settings.classNameOfPlaying);
      });
      (0, _jquery.default)(this.elemVideo).on("ended.".concat(this.id), function () {
        _this.elemWrapper.classList.add(_this.settings.classNameOfEnded);

        _this.elemWrapper.classList.remove(_this.settings.classNameOfPaused);

        _this.elemWrapper.classList.remove(_this.settings.classNameOfPlaying);
      });
    }
  }]);

  return SimpleVideoPlay;
}();

exports.default = SimpleVideoPlay;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../js/_modules/utilities/closest.js":4}],4:[function(require,module,exports){
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

},{"../polyfills/matches.js":2}]},{},[1])

//# sourceMappingURL=simplevideoplay.js.map
