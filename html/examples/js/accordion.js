(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

var _transitiontoggle = _interopRequireDefault(require("../../js/_modules/transitiontoggle.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mdls = {};
mdls.toggle = new _transitiontoggle.default({
  trigger: '.pl-list_btn',
  target: '.pl-list_inner',
  toAddClass: '#page'
});
mdls.toggle.on(function (e, instance) {
  console.info('open');
  var $target = (0, _jquery.default)(instance.elemTarget),
      $parent = (0, _jquery.default)(instance.elemToAddClass),
      height = $target.find('.pl-list_list').outerHeight(true);
  $target.css({
    'height': height + 'px'
  });
  $parent.addClass('js-pl-list-isOpening');
}, function (e, instance) {
  console.info('close');
  var $target = (0, _jquery.default)(instance.elemTarget),
      $parent = (0, _jquery.default)(instance.elemToAddClass);
  $target.css({
    'height': ''
  });
  setTimeout(function () {
    $parent.removeClass('js-pl-list-isOpening');
  }, 100);
}, function (e, instance) {
  var $parent = (0, _jquery.default)(instance.elemToAddClass);

  if (instance.isOpen === true) {
    $parent.addClass('js-pl-list-isOpen');
  } else {
    $parent.removeClass('js-pl-list-isOpen');
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
      trigger: '',
      target: '',
      toAddClass: null,
      eventRoot: document.querySelector('body')
    };
    this.settings = _jquery.default.extend({}, this.defaultSettings, options);
    this.id = this.settings.name;
    this.trigger = this.settings.trigger;
    this.target = this.settings.target;
    this.eventRoot = this.settings.eventRoot;
    this.elemToAddClass = document.querySelector(this.settings.toAddClass);
    this.elemTrigger = null;
    this.elemTarget = null;
    this.eventName = "click.".concat(this.id);
    this.callBackForOpen = null;
    this.callBackForClose = null;
    this.isOpen = false;
  }

  _createClass(Toggle, [{
    key: "on",
    value: function on(callBackForOpen, callBackForClose, callBackForEnd) {
      var _this = this;

      var $root = (0, _jquery.default)(this.eventRoot);
      var isOpen = false;
      if (this.elemToAddClass === null) return this;
      this.elemTrigger = this.elemToAddClass.querySelector(this.trigger);
      this.elemTarget = this.elemToAddClass.querySelector(this.target);
      this.callBackForOpen = callBackForOpen;
      this.callBackForClose = callBackForClose;
      $root.on(this.eventName, this.trigger, function (e) {
        if (_this.isOpen === true) {
          _this.handleForClose(e);
        } else {
          _this.handleForOpen(e);
        }
      });
      $root.on("transitionend.".concat(this.id), this.target, function (e) {
        if (isOpen !== _this.isOpen) {
          if (typeof callBackForEnd === 'function') {
            callBackForEnd.call(_this, e, _this);
          }

          isOpen = _this.isOpen;
        }
      });
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.elemToAddClass = null;
      this.elemTrigger = null;
      this.elemTarget = null;
      this.callBackForOpen = null;
      this.callBackForClose = null;
      (0, _jquery.default)(this.eventRoot).off("transitionend.".concat(this.id), this.target);
      return this;
    }
  }, {
    key: "handleForOpen",
    value: function handleForOpen(e) {
      this.open(e);
    }
  }, {
    key: "handleForClose",
    value: function handleForClose(e) {
      this.close(e);
    }
  }, {
    key: "open",
    value: function open(e) {
      this.isOpen = true;
      this.callBackForOpen.call(this, e, this);
    }
  }, {
    key: "close",
    value: function close(e) {
      this.isOpen = false;
      this.callBackForClose.call(this, e, this);
    }
  }]);

  return Toggle;
}();

exports.default = Toggle;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])

//# sourceMappingURL=accordion.js.map
