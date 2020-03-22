(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

var _transitiontoggle = _interopRequireDefault(require("../../js/_modules/transitiontoggle.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {};
mdls.toggle = new _transitiontoggle.default({
  selectorTrigger: '.pl-list_btn',
  selectorTarget: '.pl-list_inner',
  selectorIndicator: '.pl-list'
});
mdls.toggle.on(function (e, inst) {
  var $target = (0, _jquery.default)(inst.elemTarget);
  clearTimeout(inst.timeoutId);
  $target.css({
    'height': $target.find('.pl-list_list').outerHeight(true) + 'px'
  });
  (0, _jquery.default)(inst.elemIndicator).addClass('js-list--isOpening');
}, function (e, inst) {
  (0, _jquery.default)(inst.elemTarget).css({
    'height': ''
  });
  inst.timeoutId = setTimeout(function () {
    (0, _jquery.default)(inst.elemIndicator).removeClass('js-list--isOpening');
  }, 100);
}, function (e, inst) {
  var $parent = (0, _jquery.default)(inst.elemIndicator);
  console.info('end');

  if (inst.isChanged === true) {
    $parent.addClass('js-list--isOpen');
  } else {
    $parent.removeClass('js-list--isOpen');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../js/_modules/transitiontoggle.js":2}],2:[function(require,module,exports){
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

var Toggle =
/*#__PURE__*/
function () {
  function Toggle(options) {
    _classCallCheck(this, Toggle);

    this.defaultSettings = {
      name: 'transitiontoggle',
      selectorTrigger: '',
      selectorTarget: '',
      selectorIndicator: null,
      selectorEventRoot: 'body'
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
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
          $root = (0, _jquery.default)(this.eventRoot);
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
      (0, _jquery.default)(this.eventRoot).off(".".concat(this.id), this.target);
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

exports.default = Toggle;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])

//# sourceMappingURL=accordion.js.map
