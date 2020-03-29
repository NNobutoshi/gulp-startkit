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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/examples/js/accordion.bundle.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/examples/js/accordion.bundle.js":
/*!*********************************************!*\
  !*** ./src/examples/js/accordion.bundle.js ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_modules_transitiontoggle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/_modules/transitiontoggle.js */ "./src/js/_modules/transitiontoggle.js");
 // import $ from 'jquery';


var mdls = {},
    $ = window.jQuery;
mdls.toggle = new _js_modules_transitiontoggle_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
  selectorTrigger: '.pl-list_btn',
  selectorTarget: '.pl-list_inner',
  selectorIndicator: '.pl-list'
});
mdls.toggle.on(function (e, inst) {
  var $target = $(inst.elemTarget);
  clearTimeout(inst.timeoutId);
  $target.css({
    'height': $target.find('.pl-list_list').outerHeight(true) + 'px'
  });
  $(inst.elemIndicator).addClass('js-list--isOpening');
}, function (e, inst) {
  $(inst.elemTarget).css({
    'height': ''
  });
  inst.timeoutId = setTimeout(function () {
    $(inst.elemIndicator).removeClass('js-list--isOpening');
  }, 100);
}, function (e, inst) {
  var $parent = $(inst.elemIndicator);
  console.info('end');

  if (inst.isChanged === true) {
    $parent.addClass('js-list--isOpen');
  } else {
    $parent.removeClass('js-list--isOpen');
  }
});

/***/ }),

/***/ "./src/js/_modules/transitiontoggle.js":
/*!*********************************************!*\
  !*** ./src/js/_modules/transitiontoggle.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Toggle; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
// import $ from 'jquery';
var $ = window.jQuery;

var Toggle = /*#__PURE__*/function () {
  function Toggle(options) {
    _classCallCheck(this, Toggle);

    this.defaultSettings = {
      name: 'transitiontoggle',
      selectorTrigger: '',
      selectorTarget: '',
      selectorIndicator: null,
      selectorEventRoot: 'body'
    };
    this.settings = $.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.eventRoot = this.settings.selectorEventRoot;
    this.elemIndicator = document.querySelector(this.settings.selectorIndicator);
    this.elemTrigger = null;
    this.elemTarget = null;
    this.eventName = "click.".concat(this.id);
    this.callBackForBefore = null;
    this.callBackForAfter = null;
    this.isChanged = false;
  }

  _createClass(Toggle, [{
    key: "on",
    value: function on(callBackForBefore, callBackForAfter, callBackForEnd) {
      var _this = this;

      var settings = this.settings,
          $root = $(this.eventRoot);
      var isChanged = false;

      if (this.elemIndicator === null) {
        return this;
      }

      this.elemTrigger = this.elemIndicator.querySelector(settings.selectorTrigger);
      this.elemTarget = this.elemIndicator.querySelector(settings.selectorTarget);
      this.callBackForBefore = callBackForBefore;
      this.callBackForAfter = callBackForAfter;
      $root.on(this.eventName, settings.selectorTrigger, function (e) {
        if (_this.isChanged === true) {
          _this.handleForAfter(e);
        } else {
          _this.handleForBefore(e);
        }
      });
      $root.on("transitionend.".concat(this.id), this.target, function (e) {
        if (isChanged !== _this.isChanged) {
          if (typeof callBackForEnd === 'function') {
            callBackForEnd.call(_this, e, _this);
          }

          isChanged = _this.isChanged;
        }
      });
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.elemIndicator = null;
      this.elemTrigger = null;
      this.elemTarget = null;
      this.callBackForBefore = null;
      this.callBackForAfter = null;
      $(this.eventRoot).off(".".concat(this.id), this.target);
      return this;
    }
  }, {
    key: "handleForBefore",
    value: function handleForBefore(e) {
      this.open(e);
    }
  }, {
    key: "handleForAfter",
    value: function handleForAfter(e) {
      this.close(e);
    }
  }, {
    key: "open",
    value: function open(e) {
      this.isChanged = true;
      this.callBackForBefore.call(this, e, this);
    }
  }, {
    key: "close",
    value: function close(e) {
      this.isChanged = false;
      this.callBackForAfter.call(this, e, this);
    }
  }]);

  return Toggle;
}();



/***/ })

/******/ });
//# sourceMappingURL=accordion.js.map