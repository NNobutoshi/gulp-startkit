/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/examples/js/simplevideoplay.entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/examples/js/simplevideoplay.entry.js":
/*!**************************************************!*\
  !*** ./src/examples/js/simplevideoplay.entry.js ***!
  \**************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_modules_simplevideoplay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/_modules/simplevideoplay.js */ "./src/js/_modules/simplevideoplay.js");



new _js_modules_simplevideoplay_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
  outerSelector: '.pl-videoPlayer_outer',
  videoSelector: '.pl-videoPlayer_video'
});

/***/ }),

/***/ "./src/js/_modules/polyfills/matches.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/polyfills/matches.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector;
}

/***/ }),

/***/ "./src/js/_modules/simplevideoplay.js":
/*!********************************************!*\
  !*** ./src/js/_modules/simplevideoplay.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SimpleVideoPlay; });
/* harmony import */ var _js_modules_utilities_closest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/_modules/utilities/closest.js */ "./src/js/_modules/utilities/closest.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import $ from 'jquery';

var $ = window.jQuery;

var SimpleVideoPlay = /*#__PURE__*/function () {
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
    this.settings = $.extend({}, this.defaultSettings, options);

    if (this.settings.videoSelector === '' && this.settings.videoOuterSelector === '') {
      // error
      console.info('e');
    }

    this.elemVideo = document.querySelector(this.settings.videoSelector);
    this.elemWrapper = Object(_js_modules_utilities_closest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this.elemVideo, this.settings.outerSelector);
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

      $(this.elemVideo).on("canplay.".concat(this.id), function () {
        _this.elemWrapper.classList.add(_this.settings.classNameOfCanPlay);

        $(_this.elemCover).on("click.".concat(_this.id, " touchend.").concat(_this.id), function (e) {
          e.preventDefault();

          if (_this.isPlaying === false) {
            _this.elemVideo.play();
          }
        });
      });
      $(this.elemVideo).on("play.".concat(this.id), function () {
        _this.elemWrapper.classList.add(_this.settings.classNameOfPlaying);

        _this.elemWrapper.classList.remove(_this.settings.classNameOfPaused);
      });
      $(this.elemVideo).on("pause.".concat(this.id), function () {
        _this.elemWrapper.classList.add(_this.settings.classNameOfPaused);

        _this.elemWrapper.classList.remove(_this.settings.classNameOfPlaying);
      });
      $(this.elemVideo).on("ended.".concat(this.id), function () {
        _this.elemWrapper.classList.add(_this.settings.classNameOfEnded);

        _this.elemWrapper.classList.remove(_this.settings.classNameOfPaused);

        _this.elemWrapper.classList.remove(_this.settings.classNameOfPlaying);
      });
    }
  }]);

  return SimpleVideoPlay;
}();



/***/ }),

/***/ "./src/js/_modules/utilities/closest.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/utilities/closest.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return closest; });
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__);

function closest(elem, wrapper) {
  for (var closest = elem; closest; closest = closest.parentElement) {
    if (closest.matches(wrapper)) {
      break;
    }
  }

  return closest;
}

/***/ })

/******/ });
//# sourceMappingURL=simplevideoplay.js.map