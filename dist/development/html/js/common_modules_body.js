(self["webpackChunkproject_example"] = self["webpackChunkproject_example"] || []).push([["./js/common_modules_body"],{

/***/ "./node_modules/ev-emitter/ev-emitter.js":
/*!***********************************************!*\
  !*** ./node_modules/ev-emitter/ev-emitter.js ***!
  \***********************************************/
/***/ (function(module) {

/**
 * EvEmitter v2.1.1
 * Lil' event emitter
 * MIT License
 */

( function( global, factory ) {
  // universal module definition
  if (  true && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

function EvEmitter() {}

let proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) return this;

  // set events hash
  let events = this._events = this._events || {};
  // set listeners array
  let listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( !listeners.includes( listener ) ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) return this;

  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  let onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  let onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  let listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) return this;

  let index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  let listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) return this;

  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice( 0 );
  args = args || [];
  // once stuff
  let onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( let listener of listeners ) {
    let isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
  return this;
};

return EvEmitter;

} ) );


/***/ }),

/***/ "./node_modules/imagesloaded/imagesloaded.js":
/*!***************************************************!*\
  !*** ./node_modules/imagesloaded/imagesloaded.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
 * imagesLoaded v5.0.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) {
  // universal module definition
  if (  true && module.exports ) {
    // CommonJS
    module.exports = factory( window, __webpack_require__(/*! ev-emitter */ "./node_modules/ev-emitter/ev-emitter.js") );
  } else {
    // browser global
    window.imagesLoaded = factory( window, window.EvEmitter );
  }

} )( typeof window !== 'undefined' ? window : this,
    function factory( window, EvEmitter ) {

let $ = window.jQuery;
let console = window.console;

// -------------------------- helpers -------------------------- //

// turn element or nodeList into an array
function makeArray( obj ) {
  // use object if already an array
  if ( Array.isArray( obj ) ) return obj;

  let isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  // convert nodeList to array
  if ( isArrayLike ) return [ ...obj ];

  // array of single index
  return [ obj ];
}

// -------------------------- imagesLoaded -------------------------- //

/**
 * @param {[Array, Element, NodeList, String]} elem
 * @param {[Object, Function]} options - if function, use as callback
 * @param {Function} onAlways - callback function
 * @returns {ImagesLoaded}
 */
function ImagesLoaded( elem, options, onAlways ) {
  // coerce ImagesLoaded() without new, to be new ImagesLoaded()
  if ( !( this instanceof ImagesLoaded ) ) {
    return new ImagesLoaded( elem, options, onAlways );
  }
  // use elem as selector string
  let queryElem = elem;
  if ( typeof elem == 'string' ) {
    queryElem = document.querySelectorAll( elem );
  }
  // bail if bad element
  if ( !queryElem ) {
    console.error(`Bad element for imagesLoaded ${queryElem || elem}`);
    return;
  }

  this.elements = makeArray( queryElem );
  this.options = {};
  // shift arguments if no options set
  if ( typeof options == 'function' ) {
    onAlways = options;
  } else {
    Object.assign( this.options, options );
  }

  if ( onAlways ) this.on( 'always', onAlways );

  this.getImages();
  // add jQuery Deferred object
  if ( $ ) this.jqDeferred = new $.Deferred();

  // HACK check async to allow time to bind listeners
  setTimeout( this.check.bind( this ) );
}

ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

ImagesLoaded.prototype.getImages = function() {
  this.images = [];

  // filter & find items if we have an item selector
  this.elements.forEach( this.addElementImages, this );
};

const elementNodeTypes = [ 1, 9, 11 ];

/**
 * @param {Node} elem
 */
ImagesLoaded.prototype.addElementImages = function( elem ) {
  // filter siblings
  if ( elem.nodeName === 'IMG' ) {
    this.addImage( elem );
  }
  // get background image on element
  if ( this.options.background === true ) {
    this.addElementBackgroundImages( elem );
  }

  // find children
  // no non-element nodes, #143
  let { nodeType } = elem;
  if ( !nodeType || !elementNodeTypes.includes( nodeType ) ) return;

  let childImgs = elem.querySelectorAll('img');
  // concat childElems to filterFound array
  for ( let img of childImgs ) {
    this.addImage( img );
  }

  // get child background images
  if ( typeof this.options.background == 'string' ) {
    let children = elem.querySelectorAll( this.options.background );
    for ( let child of children ) {
      this.addElementBackgroundImages( child );
    }
  }
};

const reURL = /url\((['"])?(.*?)\1\)/gi;

ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
  let style = getComputedStyle( elem );
  // Firefox returns null if in a hidden iframe https://bugzil.la/548397
  if ( !style ) return;

  // get url inside url("...")
  let matches = reURL.exec( style.backgroundImage );
  while ( matches !== null ) {
    let url = matches && matches[2];
    if ( url ) {
      this.addBackground( url, elem );
    }
    matches = reURL.exec( style.backgroundImage );
  }
};

/**
 * @param {Image} img
 */
ImagesLoaded.prototype.addImage = function( img ) {
  let loadingImage = new LoadingImage( img );
  this.images.push( loadingImage );
};

ImagesLoaded.prototype.addBackground = function( url, elem ) {
  let background = new Background( url, elem );
  this.images.push( background );
};

ImagesLoaded.prototype.check = function() {
  this.progressedCount = 0;
  this.hasAnyBroken = false;
  // complete if no images
  if ( !this.images.length ) {
    this.complete();
    return;
  }

  /* eslint-disable-next-line func-style */
  let onProgress = ( image, elem, message ) => {
    // HACK - Chrome triggers event before object properties have changed. #83
    setTimeout( () => {
      this.progress( image, elem, message );
    } );
  };

  this.images.forEach( function( loadingImage ) {
    loadingImage.once( 'progress', onProgress );
    loadingImage.check();
  } );
};

ImagesLoaded.prototype.progress = function( image, elem, message ) {
  this.progressedCount++;
  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
  // progress event
  this.emitEvent( 'progress', [ this, image, elem ] );
  if ( this.jqDeferred && this.jqDeferred.notify ) {
    this.jqDeferred.notify( this, image );
  }
  // check if completed
  if ( this.progressedCount === this.images.length ) {
    this.complete();
  }

  if ( this.options.debug && console ) {
    console.log( `progress: ${message}`, image, elem );
  }
};

ImagesLoaded.prototype.complete = function() {
  let eventName = this.hasAnyBroken ? 'fail' : 'done';
  this.isComplete = true;
  this.emitEvent( eventName, [ this ] );
  this.emitEvent( 'always', [ this ] );
  if ( this.jqDeferred ) {
    let jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
    this.jqDeferred[ jqMethod ]( this );
  }
};

// --------------------------  -------------------------- //

function LoadingImage( img ) {
  this.img = img;
}

LoadingImage.prototype = Object.create( EvEmitter.prototype );

LoadingImage.prototype.check = function() {
  // If complete is true and browser supports natural sizes,
  // try to check for image status manually.
  let isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    // report based on naturalWidth
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    return;
  }

  // If none of the checks above matched, simulate loading on detached element.
  this.proxyImage = new Image();
  // add crossOrigin attribute. #204
  if ( this.img.crossOrigin ) {
    this.proxyImage.crossOrigin = this.img.crossOrigin;
  }
  this.proxyImage.addEventListener( 'load', this );
  this.proxyImage.addEventListener( 'error', this );
  // bind to image as well for Firefox. #191
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.proxyImage.src = this.img.currentSrc || this.img.src;
};

LoadingImage.prototype.getIsImageComplete = function() {
  // check for non-zero, non-undefined naturalWidth
  // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
  return this.img.complete && this.img.naturalWidth;
};

LoadingImage.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  let { parentNode } = this.img;
  // emit progress with parent <picture> or self <img>
  let elem = parentNode.nodeName === 'PICTURE' ? parentNode : this.img;
  this.emitEvent( 'progress', [ this, elem, message ] );
};

// ----- events ----- //

// trigger specified handler for event type
LoadingImage.prototype.handleEvent = function( event ) {
  let method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

LoadingImage.prototype.onload = function() {
  this.confirm( true, 'onload' );
  this.unbindEvents();
};

LoadingImage.prototype.onerror = function() {
  this.confirm( false, 'onerror' );
  this.unbindEvents();
};

LoadingImage.prototype.unbindEvents = function() {
  this.proxyImage.removeEventListener( 'load', this );
  this.proxyImage.removeEventListener( 'error', this );
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

// -------------------------- Background -------------------------- //

function Background( url, element ) {
  this.url = url;
  this.element = element;
  this.img = new Image();
}

// inherit LoadingImage prototype
Background.prototype = Object.create( LoadingImage.prototype );

Background.prototype.check = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.img.src = this.url;
  // check if image is already complete
  let isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    this.unbindEvents();
  }
};

Background.prototype.unbindEvents = function() {
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

Background.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.element, message ] );
};

// -------------------------- jQuery -------------------------- //

ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
  jQuery = jQuery || window.jQuery;
  if ( !jQuery ) return;

  // set local variable
  $ = jQuery;
  // $().imagesLoaded()
  $.fn.imagesLoaded = function( options, onAlways ) {
    let instance = new ImagesLoaded( this, options, onAlways );
    return instance.jqDeferred.promise( $( this ) );
  };
};
// try making plugin
ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

return ImagesLoaded;

} );


/***/ }),

/***/ "./src/js/_modules/accordion.js":
/*!**************************************!*\
  !*** ./src/js/_modules/accordion.js ***!
  \**************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Accordion; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var _libs_transitiontoggle_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./libs/transitiontoggle.js */ "./src/js/_modules/libs/transitiontoggle.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }















function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var d = document;
var Accordion = /*#__PURE__*/function () {
  function Accordion(options) {
    _classCallCheck(this, Accordion);
    var defaultSettings = this.defaultSettings = {
        name: 'accordion',
        selectorParent: '',
        selectorTrigger: '',
        selectorTarget: '',
        selectorCloser: '',
        selectorOpener: '',
        selectorEventRoot: 'body',
        elemParentAll: null,
        elemEventRoot: null,
        eventNameStart: 'touchend.{name} click.{name}',
        eventNameFinish: 'transitionend.{name}',
        toggleHeihgt: true,
        otherClosing: false,
        propertyTargetTransition: 'height'
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_16__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorParentAll = settings.selectorParent;
    this.selectorTrigger = settings.selectorTrigger;
    this.selectorTarget = settings.selectorTarget;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.selectorCloser = settings.selectorCloser;
    this.selectorOpener = settings.selectorOpener;
    this.elemParentAll = settings.elemParentAll || d.querySelectorAll(this.selectorParentAll);
    this.elemEventRoot = settings.elemEventRoot || d.querySelector(this.selectorEventRoot);
    this.eventRoot = null;
    this.eventNameStart = settings.eventNameStart.replaceAll('{name}', this.id);
    this.eventNameFinish = settings.eventNameFinish.replaceAll('{name}', this.id);
    this.toggles = [];
    this.setUp();
  }
  return _createClass(Accordion, [{
    key: "setUp",
    value: function setUp() {
      var _this = this;
      Array.prototype.forEach.call(this.elemParentAll, function (elemParent, index) {
        var toggle = new _libs_transitiontoggle_js__WEBPACK_IMPORTED_MODULE_15__["default"]({
          name: _this.id + index,
          elemParent: elemParent,
          elemTrigger: elemParent.querySelector(_this.selectorTrigger),
          elemTarget: elemParent.querySelector(_this.selectorTarget),
          toggleHeight: _this.settings.toggleHeight,
          propertyTargetTransition: _this.settings.propertyTargetTransition
        });
        _this.toggles.push(toggle);
      });
    }
  }, {
    key: "on",
    value: function on(callbacks) {
      var _this2 = this;
      this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_17__["default"](this.elemEventRoot);
      this.callbackBefore = callbacks.before;
      this.callbackAfter = callbacks.after;
      this.callbackFinish = callbacks.finish;
      this.eventRoot.on(this.eventNameStart, this.selectorTrigger, this.handleStart.bind(this)).on(this.eventNameFinish, this.selectorTarget, this.handleFinish.bind(this));
      if (this.selectorCloser) {
        this.eventRoot.on(this.eventNameStart, this.selectorCloser, this.handleAllafter.bind(this));
      }
      if (this.selectorOpener) {
        this.eventRoot.on(this.eventNameStart, this.selectorOpener, this.handleAllBefore.bind(this));
      }
      this.toggles.forEach(function (toggle, index) {
        toggle.callbackBefore = _this2.callbackBefore.bind(toggle);
        toggle.callbackAfter = _this2.callbackAfter.bind(toggle);
        toggle.callbackFinish = _this2.callbackFinish.bind(toggle);
      });
      return this;
    }
  }, {
    key: "handleStart",
    value: function handleStart(e, elemEventTarget) {
      var _this3 = this;
      this.toggles.forEach(function (toggle) {
        if (toggle.elemTrigger === elemEventTarget) {
          toggle.handleStart(e);
          return false;
        } else if (_this3.settings.otherClosing === true && toggle.isChanged === true) {
          toggle.after(e);
        }
      });
    }
  }, {
    key: "handleFinish",
    value: function handleFinish(e, elemEventTarget) {
      this.toggles.forEach(function (toggle) {
        if (toggle.elemTarget === elemEventTarget) {
          toggle.handleFinish(e);
          return false;
        }
      });
    }
  }, {
    key: "handleAllafter",
    value: function handleAllafter() {
      this.toggles.forEach(function (toggle) {
        if (toggle.isChanged === true) {
          toggle.after();
        }
      });
    }
  }, {
    key: "handleAllBefore",
    value: function handleAllBefore() {
      this.toggles.forEach(function (toggle) {
        if (toggle.isChanged === false) {
          toggle.before();
        }
      });
    }
  }]);
}();


/***/ }),

/***/ "./src/js/_modules/adjust.js":
/*!***********************************!*\
  !*** ./src/js/_modules/adjust.js ***!
  \***********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ua-parser-js */ "./node_modules/ua-parser-js/src/main/ua-parser.mjs");


var uAParser = new ua_parser_js__WEBPACK_IMPORTED_MODULE_1__.UAParser();
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(className) {
  var elemHtml = document.documentElement,
    browser = uAParser.getBrowser();
  elemHtml.classList.add(className);
  elemHtml.classList.add(browser.name + browser.major);
}

/***/ }),

/***/ "./src/js/_modules/foo.js":
/*!********************************!*\
  !*** ./src/js/_modules/foo.js ***!
  \********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(callback) {
  if (typeof callback === 'function') {
    callback();
  }
}

/***/ }),

/***/ "./src/js/_modules/libs/adaptivehover.js":
/*!***********************************************!*\
  !*** ./src/js/_modules/libs/adaptivehover.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AdaptiveHover; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_timers_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/web.timers.js */ "./node_modules/core-js/modules/web.timers.js");
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }















function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*!
 * adaptivehover.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */





var d = document;
var AdaptiveHover = /*#__PURE__*/function () {
  function AdaptiveHover(options) {
    _classCallCheck(this, AdaptiveHover);
    var defaultSettings = this.defaultSettings = {
        name: 'adaptiveHover',
        selectorTarget: '',
        selectorEventRoot: 'body',
        elemTarget: null,
        elemActive: null,
        elemEventRoot: window,
        eventNameEnter: 'touchstart.{name} mouseover.{name}',
        eventNameLeave: 'touchend.{name} mouseout.{name}',
        eventNameOutside: 'touchend.{name} click.{name}',
        delayTime: 500,
        coverage: 20
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorTarget = settings.selectorTarget;
    this.selectorEvetnRoot = settings.selectorEventRoot;
    this.elemTarget = settings.elemTarget || d.querySelector(this.selectorTarget);
    this.elemEventRoot = settings.elemEventRoot || d.querySelector(this.selectorEventRoot);
    this.eventNameEnter = settings.eventNameEnter.replaceAll('{name}', this.id);
    this.eventNameLeave = settings.eventNameLeave.replaceAll('{name}', this.id);
    this.eventNameOutside = settings.eventNameOutside.replaceAll('{name}', this.id);
    this.callbackEnter = null;
    this.callbackLeave = null;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
    this.eventRoot = null;
  }
  return _createClass(AdaptiveHover, [{
    key: "on",
    value: function on(callbackEnter, callbackLeave) {
      this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_18__["default"](this.elemEventRoot);
      this.callbackEnter = callbackEnter;
      this.callbackLeave = callbackLeave;
      this.eventRoot.on(this.eventNameEnter, this.selectorTarget, this.handleEnter.bind(this)).on(this.eventNameLeave, this.selectorTarget, this.handleLeave.bind(this)).on(this.eventNameOutside, this.handleOutSide.bind(this));
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.clear();
      this.evtRoot.off(".".concat(this.id));
      return this;
    }
  }, {
    key: "handleEnter",
    value: function handleEnter(e, target) {
      this.enter(e, target);
    }
  }, {
    key: "handleLeave",
    value: function handleLeave(e, target) {
      var coverage = this.settings.coverage,
        isOriginPoint = _isOriginPoint(_getEventObj(e), this.pageX, this.pageY, coverage);
      if (!isOriginPoint && this.elemActive === target && this.elemActive.contains(e.relatedTarget) === false && target.contains(e.relatedTarget) === false) {
        this.leave(e, target);
      }
    }
  }, {
    key: "handleOutSide",
    value: function handleOutSide(e) {
      if (!_isRelative(e.target, this.settings.selectorTarget) && this.isEntering === true) {
        this.clear();
        this.leave(e, this.elemActive);
      }
    }
  }, {
    key: "enter",
    value: function enter(e, target) {
      var _this = this;
      var eventObj = _getEventObj(e);
      if (this.isEntering === true && this.elemActive !== target) {
        this.leave(e, this.elemActive);
      }
      if (this.isEntering === false) {
        clearTimeout(this.timeoutId);
        this.elemActive = target;
        this.timeoutId = setTimeout(function () {
          return _this.clear();
        }, this.settings.delayTime);
        this.pageX = eventObj.pageX;
        this.pageY = eventObj.pageY;
        this.isEntering = true;
        this.callbackEnter.call(this, e, this, target);
      }
    }
  }, {
    key: "leave",
    value: function leave(e, target) {
      if (this.isEntering === true) {
        clearTimeout(this.timeoutId);
        this.isEntering = false;
        this.callbackLeave.call(this, e, this, target);
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
}();

function _isOriginPoint(eventObj, pageX, pageY, range) {
  return eventObj.pageX > pageX - range && eventObj.pageX < pageX + range && eventObj.pageY > pageY - range && eventObj.pageY < pageY + range;
}
function _isRelative(elem, ancestor) {
  return elem.matches(ancestor) || elem.closest(ancestor);
}
function _getEventObj(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}

/***/ }),

/***/ "./src/js/_modules/libs/eventmanager.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/libs/eventmanager.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ EventManager; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.concat.js */ "./node_modules/core-js/modules/es.array.concat.js");
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.from.js */ "./node_modules/core-js/modules/es.array.from.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_map_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.map.js */ "./node_modules/core-js/modules/es.map.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_entries_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.object.entries.js */ "./node_modules/core-js/modules/es.object.entries.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }



















function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var EventManager = /*#__PURE__*/function () {
  function EventManager(elemEventer) {
    _classCallCheck(this, EventManager);
    this.listeners = {};
    this.elemEventer = elemEventer || document;
  }
  return _createClass(EventManager, [{
    key: "on",
    value: function on(fullEventTypeNames, selectorTarget, listener, options) {
      if (typeof selectorTarget === 'function') {
        var _ref = [listener, selectorTarget, null];
        options = _ref[0];
        listener = _ref[1];
        selectorTarget = _ref[2];
      }
      this.setUp('add', fullEventTypeNames, selectorTarget, listener, options);
      return this;
    }
  }, {
    key: "off",
    value: function off(fullEventTypeNames, listener) {
      this.setUp('remove', fullEventTypeNames, null, listener);
      return this;
    }
  }, {
    key: "trigger",
    value: function trigger(fullEventTypeNames) {
      this.setUp('trigger', fullEventTypeNames);
      return this;
    }

    /**
     * 半角スペースで区切られた、複数分の、name space を含むfull のtype name 毎に処理。
     * "add"、"remove"、"trigger"と、渡されたprefix 引数で処理を分ける。
     */
  }, {
    key: "setUp",
    value: function setUp(prefix, fullEventTypeNames, selectorTarget, listener, options) {
      var _this = this;
      var that = this;
      fullEventTypeNames.split(' ').forEach(function (fullEventTypeName) {
        var _fullEventTypeName$sp = fullEventTypeName.split('.'),
          _fullEventTypeName$sp2 = _slicedToArray(_fullEventTypeName$sp, 2),
          eventType = _fullEventTypeName$sp2[0],
          nameSpace = _fullEventTypeName$sp2[1];
        var objListeners, mapListener, target;

        /**
         *  name space を含めたfull のevent type 名をキーに、
         *  listener を配列に格納したものを値にしたオブジェクトをthis.listeners に格納。
         *  同時にname space を取り除いたevent type 名でaddEventListnerに登録。
         */
        if (prefix === 'add' && eventType && typeof listener === 'function') {
          mapListener = new Map();
          mapListener.set(listener, function (e) {
            if (selectorTarget && typeof selectorTarget === 'string') {
              target = e.target.closest(selectorTarget);
              if (!target) {
                return;
              }
            }
            listener(e, target);
          });
          if (!_this.listeners[fullEventTypeName]) {
            _this.listeners[fullEventTypeName] = [];
          }
          _this.listeners[fullEventTypeName].push(mapListener);
          _this.setEventListener(prefix, eventType, mapListener.get(listener), options);
        } // if( prefix === 'add' )

        /**
         * this.listeners の中からそのkeyに、渡された引数fullEventTypeNames がフルで一致するもの、
         * event type 名だけが渡され、それが部分的に含まれるもの、
         * name space だけが渡され、それが部分的に含まれるものを収集。
         */
        if (prefix === 'remove' || prefix === 'trigger') {
          objListeners = _collectListeners(function (key) {
            return eventType && nameSpace && fullEventTypeName === key || eventType && !nameSpace && key.indexOf(eventType) === 0 || !eventType && nameSpace && key.indexOf(".".concat(nameSpace)) >= 0;
          });

          /**
           * 収集したobject の中からprefix 引数に応じて、"remove" で、removeEventListener"の登録。
           * "trigger"でそのままlistner を実行。
           */
          var _loop = function _loop() {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              typeName = _Object$entries$_i[0],
              arrListeners = _Object$entries$_i[1];
            if (prefix === 'remove') {
              delete that.listeners[typeName];
            }
            arrListeners.forEach(function (mapListener) {
              if (prefix === 'remove' && (!listener || mapListener.has(listener))) {
                _this.setEventListener(prefix, typeName, mapListener.values().next().value);
              } else if (prefix === 'trigger') {
                mapListener.values().next().value();
              }
            });
          };
          for (var _i = 0, _Object$entries = Object.entries(objListeners); _i < _Object$entries.length; _i++) {
            _loop();
          }
        } // if ( prefix === 'remove' || prefix === 'trigger' )
      });

      /**
       * this.listeners の中から渡されたcondition 関数でtrue を返すkey と値を格納したobject を返す。
       */
      function _collectListeners(condition) {
        var objListeners = {};
        for (var _i2 = 0, _Object$entries2 = Object.entries(that.listeners); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            fullTypeName = _Object$entries2$_i[0],
            arrListeners = _Object$entries2$_i[1];
          if (condition.call(null, fullTypeName, arrListeners)) {
            var _fullTypeName$split = fullTypeName.split('.'),
              _fullTypeName$split2 = _slicedToArray(_fullTypeName$split, 1),
              typeName = _fullTypeName$split2[0];
            if (!objListeners[typeName]) {
              objListeners[typeName] = [];
            }
            objListeners[typeName] = objListeners[typeName].concat(arrListeners);
          }
        }
        return objListeners;
      }
    }
  }, {
    key: "setEventListener",
    value: function setEventListener(prefix, eventType, listener, options) {
      var arrElements = this.elemEventer.length ? Array.from(this.elemEventer) : [this.elemEventer];
      arrElements.forEach(function (elem) {
        elem["".concat(prefix, "EventListener")](eventType, listener, options);
      });
    }
  }]);
}();


/***/ }),

/***/ "./src/js/_modules/libs/optimizedresize.js":
/*!*************************************************!*\
  !*** ./src/js/_modules/libs/optimizedresize.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ OptimizedResize; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.object.keys.js */ "./node_modules/core-js/modules/es.object.keys.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var _vendor_raf_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../_vendor/raf.js */ "./src/js/_vendor/raf.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }















function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*!
 * optimizedresize.js
 * Inspired by https://developer.mozilla.org
 */




var d = document;
var uniqueNumber = 0;
var OptimizedResize = /*#__PURE__*/function () {
  function OptimizedResize(options) {
    _classCallCheck(this, OptimizedResize);
    var defaultSettings = this.defaultSettings = {
        name: 'optimizedresize',
        selectorEventRoot: '',
        elemEventRoot: window,
        eventName: 'resize.{name}',
        delayTime: 10
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_16__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemEventRoot = settings.elemEventRoot || d.querySelector(this.selectorEventRoot);
    this.callbacks = {};
    this.isRunning = false;
    this.eventName = settings.eventName.replaceAll('{name}', this.id);
    this.eventRoot = null;
  }
  return _createClass(OptimizedResize, [{
    key: "runCallbacksAll",
    value: function runCallbacksAll() {
      for (var key in this.callbacks) {
        var props = this.callbacks[key];
        var query = false;
        if (!props.query) {
          props.callback.call(this, props);
          props.lastQuery = query;
          continue;
        }
        query = window.matchMedia(props.query).matches;
        if (
        // turn
        props.turn === true && query === true && props.lastQuery !== query ||
        // one
        props.one === true && query === true ||
        // cross
        props.cross === true && (query === true && props.lastQuery === false || query === false && props.lastQuery === true) ||
        // on
        query === true && !props.one && !props.turn && !props.cross) {
          props.callback.call(this, props);
        }
        props.lastQuery = query;
        if (props.one === true && query === true) {
          this.remove(key);
        }
      } // for loop

      this.isRunning = false;
      return this;
    }
  }, {
    key: "add",
    value: function add(callback, options) {
      var settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_16__({}, {
        // default
        name: _getUniqueName(this.id),
        query: '',
        one: false,
        turn: false,
        cross: false
      }, options);
      settings.callback = callback;
      this.setUp();
      this.callbacks[settings.name] = settings;
      return this;
    }
  }, {
    key: "remove",
    value: function remove(name) {
      delete this.callbacks[name];
    }
  }, {
    key: "off",
    value: function off(name) {
      this.remove(name);
    }
  }, {
    key: "on",
    value: function on(query, callback, name) {
      if (typeof query === 'function') {
        var _ref = [query, callback, ''];
        callback = _ref[0];
        name = _ref[1];
        query = _ref[2];
      }
      return this.add(callback, {
        name: name,
        query: query,
        one: false,
        turn: false,
        cross: false
      });
    }
  }, {
    key: "one",
    value: function one(query, callback, name) {
      return this.add(callback, {
        name: name,
        query: query,
        one: true,
        turn: false,
        cross: false
      });
    }
  }, {
    key: "turn",
    value: function turn(query, callback, name) {
      return this.add(callback, {
        name: name,
        query: query,
        one: false,
        turn: true,
        cross: false
      });
    }
  }, {
    key: "cross",
    value: function cross(query, callback, name) {
      return this.add(callback, {
        name: name,
        query: query,
        one: false,
        turn: false,
        cross: true
      });
    }
  }, {
    key: "setUp",
    value: function setUp() {
      var _this = this;
      if (!Object.keys(this.callbacks).length) {
        this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_17__["default"](this.elemEventRoot);
        this.eventRoot.on(this.eventName, function (e) {
          return _this.handleSetup(e);
        });
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.evtRoot.off(this.eventName);
    }
  }, {
    key: "handleSetup",
    value: function handleSetup() {
      this.run();
    }
  }, {
    key: "run",
    value: function run() {
      var delayTime = this.settings.delayTime,
        func = this.runCallbacksAll.bind(this);
      var startTime = null;
      if (this.isRunning === true) {
        return this;
      }
      this.isRunning = true;
      if (typeof delayTime === 'number' && delayTime > 0) {
        requestAnimationFrame(_throttle);
      } else {
        requestAnimationFrame(func);
      }
      return this;
      function _throttle(timeStamp) {
        if (startTime === null) {
          startTime = timeStamp;
        }
        if (timeStamp - startTime >= delayTime) {
          func();
        } else {
          requestAnimationFrame(_throttle);
        }
      }
    }
  }]);
}();

function _getUniqueName(base) {
  return base + new Date().getTime() + uniqueNumber++;
}

/***/ }),

/***/ "./src/js/_modules/libs/scrollmanager.js":
/*!***********************************************!*\
  !*** ./src/js/_modules/libs/scrollmanager.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ScrollManager; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.from.js */ "./node_modules/core-js/modules/es.array.from.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _utilities_position_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../utilities/position.js */ "./src/js/_modules/utilities/position.js");
/* harmony import */ var _vendor_raf_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../_vendor/raf.js */ "./src/js/_vendor/raf.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }

















function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */





var doc = document;
var counter = 0;
var ScrollManager = /*#__PURE__*/function () {
  function ScrollManager(options) {
    _classCallCheck(this, ScrollManager);
    var defaultSettings = this.defaultSettings = {
        name: 'scrollManager',
        selectorOffsetTop: '',
        selectorOffsetBottom: '',
        selectorEventRoot: '',
        elemOffsetTop: null,
        elemOffsetBottom: null,
        elemEventRoot: window,
        eventName: 'scroll.{name}',
        delayTime: 0,
        catchPoint: '100%'
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.selectorOffsetTop = settings.selectorOffsetTop;
    this.selectorOffsetBottom = settings.selectorOffsetBottom;
    this.elemEventRoot = settings.elemEventRoot || doc.querySelector(this.selectorEventRoot);
    this.callbacks = {};
    this.eventName = settings.eventName.replaceAll('{name}', this.id);
    this.isRunning = false;
    this.lastSctop = 0;
    this.scrollDown = null;
    this.scrollUp = null;
    this.startTime = null;
    this.catchPoint = settings.catchPoint;
    this.eventRoot = null;
  }
  return _createClass(ScrollManager, [{
    key: "runCallbacksAll",
    value: function runCallbacksAll() {
      var scTop = this.elemEventRoot.pageYOffset,
        innerHeight = this.elemEventRoot.innerHeight;
      for (var key in this.callbacks) {
        var entry = this.callbacks[key],
          selectorOffsetTop = entry.selectorOffsetTop || this.selectorOffsetTop,
          selectorOffsetBottom = entry.selectorOffsetBottom || this.selectorOffsetBottom,
          offsetTop = _getMaxOffset(selectorOffsetTop, innerHeight, 'top'),
          offsetBottom = _getMaxOffset(selectorOffsetBottom, innerHeight, 'bottom'),
          viewTop = scTop + offsetTop,
          viewHeight = innerHeight - offsetTop - offsetBottom,
          catchPoint = _calcPoint(viewHeight, this.catchPoint),
          elemTarget = entry.elemTarget || document.createElement('div'),
          rect = elemTarget.getBoundingClientRect(),
          hookPoint = _calcPoint(rect.height, entry.observed.hookPoint || entry.hookPoint),
          range = catchPoint + (rect.height - hookPoint),
          scrollFrom = viewTop + catchPoint - (hookPoint + (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_18__["default"])(elemTarget).top),
          ratio = scrollFrom / range;
        entry.observed = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__(entry.observed, {
          name: entry.name,
          target: entry.elemTarget,
          range: range,
          scroll: scrollFrom,
          ratio: ratio,
          catchPoint: catchPoint,
          hookPoint: hookPoint,
          viewTop: viewTop,
          viewHeight: viewHeight,
          catched: ratio >= 0 && ratio <= 1
        });
        entry.callback.call(this, entry.observed, this);
      } // for

      this.isRunning = false;
      if (scTop > this.lastSctop) {
        this.scrollDown = true;
        this.scrollUp = false;
      } else {
        this.scrollDown = false;
        this.scrollUp = true;
      }
      this.isRunning = false;
      this.lastSctop = scTop;
      return this;
    }
  }, {
    key: "add",
    value: function add(callback, elemTarget, options) {
      var defaultOptions = {
          name: _getUniqueName(this.id),
          elemTarget: elemTarget,
          flag: false,
          observed: {}
        },
        entry = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__({}, defaultOptions, options);
      entry.callback = callback;
      this.setUp();
      this.callbacks[entry.name] = entry;
      return this;
    }
  }, {
    key: "remove",
    value: function remove(name) {
      delete this.callbacks[name];
      return this;
    }
  }, {
    key: "on",
    value: function on(callback, elemTarget, options) {
      return this.add(callback, elemTarget, options);
    }
  }, {
    key: "off",
    value: function off(name) {
      return this.remove(name);
    }
  }, {
    key: "setUp",
    value: function setUp() {
      var _this = this;
      if (!this.callbacks.length) {
        this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_20__["default"](this.elemEventRoot);
        this.eventRoot.on(this.eventName, function () {
          return _this.handle();
        });
      }
      return this;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.eventRoot.off(this.eventName);
      return this;
    }
  }, {
    key: "handle",
    value: function handle() {
      var func = this.runCallbacksAll.bind(this),
        delayTime = this.settings.delayTime;
      var startTime = null;
      if (this.isRunning === true) {
        return;
      }
      this.isRunning = true;
      if (typeof delayTime === 'number' && delayTime > 0) {
        requestAnimationFrame(_throttle);
      } else {
        requestAnimationFrame(func);
      }
      return this;
      function _throttle(timeStamp) {
        if (startTime === null) {
          startTime = timeStamp;
        }
        if (timeStamp - startTime >= delayTime) {
          func();
        } else {
          requestAnimationFrame(_throttle);
        }
      }
    }
  }]);
}();

function _getMaxOffset(selector, vwHeight, pos) {
  var elems = selector && document.querySelectorAll(selector),
    _ref = pos === 'top' ? ['bottom', 'max'] : ['top', 'min'],
    _ref2 = _slicedToArray(_ref, 2),
    base = _ref2[0],
    maxOrMin = _ref2[1];
  var ret = 0,
    arryPositionNumber = [];
  if (!elems) {
    return ret;
  }
  var _iterator = _createForOfIteratorHelper(elems),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var elem = _step.value;
      if (window.getComputedStyle(elem).position === 'fixed') {
        arryPositionNumber.push(elem.getBoundingClientRect()[base]);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  ret = Math[maxOrMin].apply(null, arryPositionNumber);
  ret = pos === 'bottom' ? vwHeight - ret : ret;
  return ret < 0 ? 0 : ret;
}
function _getUniqueName(base) {
  return base + new Date().getTime() + counter++;
}
function _calcPoint(base, val) {
  var ret = 0;
  if (typeof val === 'string') {
    if (val.indexOf('%') > -1) {
      ret = base * parseInt(val, 10) / 100;
    } else {
      ret = parseInt(val, 10);
    }
  } else if (typeof val === 'number') {
    ret = val;
  }
  return ret;
}

/***/ }),

/***/ "./src/js/_modules/libs/transitiontoggle.js":
/*!**************************************************!*\
  !*** ./src/js/_modules/libs/transitiontoggle.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TtransitionToggle; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }














function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */



var d = document;
var TtransitionToggle = /*#__PURE__*/function () {
  function TtransitionToggle(options) {
    _classCallCheck(this, TtransitionToggle);
    var defaultSettings = this.defaultSettings = {
        name: 'transitiontoggle',
        selectorParent: '',
        selectorTrigger: '',
        selectorTarget: '',
        selectorEventRoot: 'body',
        elemTrigger: null,
        elemTarget: null,
        elemParent: null,
        elemEventRoot: null,
        eventNameStart: 'touchend.{name} click.{name}',
        eventNameFinish: 'transitionend.{name}',
        toggleHeight: false,
        propertyTargetTransition: ''
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_14__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorParent = settings.selectorParent;
    this.selectorTrigger = settings.selectorTrigger;
    this.selectorTarget = settings.selectorTarget;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemTrigger = settings.elemTrigger || d.querySelector(this.selectorTrigger);
    this.elemParent = settings.elemParent || this.selectorParent && d.querySelector(this.selectorParent) || this.elemTrigger.parentNode;
    this.elemTarget = settings.elemTarget || this.elemParent.querySelector(this.selectorTarget);
    this.elemEventRoot = settings.elemEventRoot || d.querySelector(this.selectorEventRoot);
    this.callbackSetUp = null;
    this.callbackBefore = null;
    this.callbackAfter = null;
    this.callbackFinish = null;
    this.eventRoot = null;
    this.isChanged = false;
    this.isWorking = false;
    this.eventNameStart = settings.eventNameStart.replaceAll('{name}', this.id);
    this.eventNameFinish = settings.eventNameFinish.replaceAll('{name}', this.id);
  }
  return _createClass(TtransitionToggle, [{
    key: "on",
    value: function on(callbacks) {
      this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_15__["default"](this.elemEvtRoot);
      this.callbackBefore = callbacks.before.bind(this);
      this.callbackAfter = callbacks.after.bind(this);
      this.callbackFinish = callbacks.finish.bind(this);
      this.eventRoot.on(this.eventNameStart, this.selectorTrigger, this.handleStart.bind(this)).on(this.eventNameFinish, this.selectorTarget, this.handleFinish.bind(this));
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.elemParent = null;
      this.elemTrigger = null;
      this.elemTarget = null;
      this.callbackBefore = null;
      this.callbackAfter = null;
      this.callbackFinish = null;
      this.eventRoot.off('.' + this.id);
      return this;
    }
  }, {
    key: "handleStart",
    value: function handleStart(e) {
      if (this.isWorking === true) {
        return true;
      }
      this.isWorking = true;
      if (this.isChanged === true) {
        this.after(e);
      } else {
        this.before(e);
      }
    }
  }, {
    key: "handleFinish",
    value: function handleFinish(e) {
      var targetProperty = this.settings.propertyTargetTransition;
      if (targetProperty && e.propertyName && targetProperty !== e.propertyName) {
        return;
      }
      this.isWorking = false;
      this.callbackFinish.call(this, e, this);
    }
  }, {
    key: "before",
    value: function before(e) {
      var that = this,
        styleDefaultTransition = window.getComputedStyle(this.elemTarget).transition,
        style = this.elemTarget.style;
      var height,
        startTime = null;
      if (this.settings.toggleHeight === true) {
        var _setHeight2 = function _setHeight(timeStamp) {
          if (startTime === null) {
            startTime = timeStamp;
          }
          if (timeStamp - startTime > 100) {
            style.transition = styleDefaultTransition;
            style.height = height + 'px';
            that.callbackBefore.call(this, e, this);
          } else {
            requestAnimationFrame(_setHeight2);
          }
        };
        style.transitionProperty = 'none';
        style.display = 'block';
        style.height = 'auto';
        height = this.elemTarget.getBoundingClientRect().height;
        style.height = 0;
        requestAnimationFrame(_setHeight2);
      } else {
        this.callbackBefore.call(this, e, this);
      }
      this.isChanged = true;
    }
  }, {
    key: "after",
    value: function after(e) {
      if (this.settings.toggleHeight === true) {
        this.elemTarget.style.height = 0;
      }
      this.isChanged = false;
      this.callbackAfter.call(this, e, this);
    }
  }]);
}();


/***/ }),

/***/ "./src/js/_modules/locate.js":
/*!***********************************!*\
  !*** ./src/js/_modules/locate.js ***!
  \***********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Locate; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.from.js */ "./node_modules/core-js/modules/es.array.from.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _utilities_parents_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./utilities/parents.js */ "./src/js/_modules/utilities/parents.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
















function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Locate = /*#__PURE__*/function () {
  function Locate(options) {
    _classCallCheck(this, Locate);
    var defaultSettings = this.defaultSettings = {
        name: 'locate',
        selectorTarget: '',
        selectorParent: '',
        elemTargetAll: null,
        indexRegex: /index\.[^/]+?$/
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_16__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorTarget = settings.selectorTarget;
    this.selectorParent = settings.selectorParent;
    this.elemTargetAll = settings.elemTargetAll || document.querySelectorAll(this.selectorTarget);
    this.elemCurrent = null;
    this.elemParentAll = null;
  }
  return _createClass(Locate, [{
    key: "run",
    value: function run(callback) {
      var hostNameByLocal = location.host,
        pathnameByLocal = location.pathname.replace(this.settings.indexRegex, '');
      this.elemCurrent = null;
      this.elemParentAll = null;
      var _iterator = _createForOfIteratorHelper(this.elemTargetAll),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var elemTarget = _step.value;
          var pathNameByElement = elemTarget.pathname.replace(this.settings.indexRegex, ''),
            hostNameByElement = elemTarget.host;
          if (hostNameByLocal !== hostNameByElement) {
            continue;
          } else if (pathNameByElement === pathnameByLocal) {
            this.elemCurrent = elemTarget;
            this.elemParentAll = (0,_utilities_parents_js__WEBPACK_IMPORTED_MODULE_17__["default"])(this.elemCurrent, this.selectorParent, 'body');
          }
        } // for
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (typeof callback === 'function') {
        callback.call(this, this);
      }
      return this;
    }
  }]);
}();


/***/ }),

/***/ "./src/js/_modules/polyfills/closest.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/polyfills/closest.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matches.js */ "./src/js/_modules/polyfills/matches.js");

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var elem = this;
    do {
      if (Element.prototype.matches.call(elem, s)) {
        return elem;
      }
      elem = elem.parentElement || elem.parentNode;
    } while (elem !== null && elem.nodeType === 1);
    return null;
  };
}

/***/ }),

/***/ "./src/js/_modules/polyfills/matches.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/polyfills/matches.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector;
}

/***/ }),

/***/ "./src/js/_modules/rescroll.js":
/*!*************************************!*\
  !*** ./src/js/_modules/rescroll.js ***!
  \*************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Rescroll; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.from.js */ "./node_modules/core-js/modules/es.array.from.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _utilities_position_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./utilities/position.js */ "./src/js/_modules/utilities/position.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _vendor_raf_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../_vendor/raf.js */ "./src/js/_vendor/raf.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }

















function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*!
 * rescroll.js
 */






var d = document;
var Rescroll = /*#__PURE__*/function () {
  function Rescroll(options) {
    _classCallCheck(this, Rescroll);
    var defaultSettings = this.defaultSettings = {
        name: 'rescroll',
        selectorTrigger: 'a',
        selectorShoulder: '',
        /* スクロール先を肩代わりする要素 */
        selectorEventRoot: '',
        elemEventRoot: window,
        elemShoudler: null,
        eventNameLoad: 'load.{name}',
        eventNameHashChange: 'hashchange.{name}',
        eventNameClick: 'click.{name}',
        eventNameScroll: 'scroll.{name}',
        exclude: '',
        offsetTop: 0,
        animation: true,
        /* 所謂スムーススクロール */
        animeOption: {
          duration: 1000,
          easing: function easing(pos) {
            return 1 - Math.pow(1 - pos, 5);
          }
        }
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorTrigger = settings.selectorTrigger;
    this.selectorShoulder = settings.selectorShoulder;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemEventRoot = settings.elemEventRoot || d.querySelector(settings.selectorEventRoot);
    this.offsetTop = settings.offsetTop;
    this.isWorking = false;
    this.enabled = false;
    this.lastScrollY = this.elemEventRoot.pageYOffset;
    this.arryShoulderSelector = [];
    this.eventNameLoad = settings.eventNameLoad.replaceAll('{name}', this.id);
    this.eventNameHashChange = settings.eventNameHashChange.replaceAll('{name}', this.id);
    this.eventNameClick = settings.eventNameClick.replaceAll('{name}', this.id);
    this.eventNameScroll = settings.eventNameScroll.replaceAll('{name}', this.id);
    this.addShoulder(this.selectorShoulder);
    this.eventRoot = null;
  }
  return _createClass(Rescroll, [{
    key: "on",
    value: function on() {
      this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_21__["default"](this.elemEventRoot);
      this.eventRoot.on(this.eventNameLoad, this.handleLoad.bind(this)).on(this.eventNameHashChange, this.handleHashChange.bind(this)).on(this.eventNameClick, this.selectorTrigger, this.handleClick.bind(this)).on(this.eventNameScroll, this.handleScroll.bind(this));
      return this;
    }
  }, {
    key: "off",
    value: function off() {
      this.evtRoot.off(".".concat(this.id));
      this.lastScrollY = null;
      this.enabled = false;
      this.isWorking = false;
      return this;
    }
  }, {
    key: "handleLoad",
    value: function handleLoad(e) {
      this.enabled = true;
      this.preprocess(e);
    }
  }, {
    key: "handleHashChange",
    value: function handleHashChange(e) {
      this.enabled = true;
      this.preprocess(e);
    }
  }, {
    key: "handleClick",
    value: function handleClick(e, target) {
      var hash = target && target.hash && this.getHash(target.hash);
      if (!hash && !document.querySelector(hash)) {
        return;
      }
      this.enabled = true;
      this.lastScrollY = this.elemEventRoot.pageYOffset;
      e.preventDefault();
      window.history.pushState(null, null, target.href);
      this.preprocess(e, target);
    }

    /**
     * スクロールの起点になるポイントを常に取得しておく。
     */
  }, {
    key: "handleScroll",
    value: function handleScroll(e) {
      var _this = this;
      requestAnimationFrame(function () {
        if (_this.enabled === false) {
          _this.lastScrollY = _this.elemEventRoot.pageYOffset;
        }
      });
    }
  }, {
    key: "preprocess",
    value: function preprocess(e, target) {
      var hash = this.getHash(),
        arryShoulder = this.arryShoulderSelector,
        elemByHash = hash ? document.querySelector(hash) : null,
        elemShoulder = arryShoulder.length && elemByHash && _getShoulderElement.bind(this)(elemByHash);
      var lastScrollY = this.lastScrollY,
        currentScrollY = this.elemEventRoot.pageYOffset;

      /**
       * クリックされたA要素とジャンプ先を肩代わりする要素のY座標が同一であれば、
       * or すでに実行中であれば、
       * or 実行が許可されていなければ、
       * or ジャンプ先を肩代わりする要素も、hash をセレクターにして得られた要素も、どちらもなければ、
       * return
       */
      if (e.type === 'click' && target && target.hash && elemShoulder && (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_18__["default"])(target).top === (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_18__["default"])(elemShoulder).top || this.isWorking === true || this.enabled === false || !elemByHash && !elemShoulder) {
        this.isWorking = false;
        return this;
      }

      /**
       * デフォルトのスクロールを終えるのを待って改めてスクロールさせる
       * hashchange やload のevent でキャンセルできないため。
       */
      requestAnimationFrame(_retry.bind(this));
      return this;
      function _retry() {
        if (currentScrollY !== lastScrollY) {
          lastScrollY = currentScrollY;
          requestAnimationFrame(_retry.bind(this));
        } else {
          this.isWorking = true;
          lastScrollY = null;
          if (this.settings.animation) {
            this.animatedScroll(elemShoulder || elemByHash);
          } else {
            this.scroll(elemShoulder || elemByHash);
          }
        }
      }

      /**
       * スクロール先を肩代わりする要素を取得する。
       * 先祖の要素で限定。
       */
      function _getShoulderElement(elemTarget) {
        var arry = this.arryShoulderSelector;
        var elemClosest = null;
        if (!elemTarget) {
          return elemClosest;
        }
        for (var i = 0, len = arry.length; i < len; i++) {
          elemClosest = elemTarget.closest(arry[i]);
          if (elemClosest) {
            break;
          }
        }
        return elemClosest;
      }
    }

    /**
     * 通常のスクロール
     */
  }, {
    key: "scroll",
    value: function scroll(elemTarget) {
      var finishPoint = (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_18__["default"])(elemTarget).top - this.offset();
      this.elemEventRoot.scrollTo(0, this.lastScrollY);
      this.elemEventRoot.scrollTo(0, finishPoint);
      this.isWorking = false;
      this.enabled = false;
      this.lastScrollY = finishPoint;
    }

    /**
     * スムーススクロール
     */
  }, {
    key: "animatedScroll",
    value: function animatedScroll(elemTarget) {
      var duration = this.settings.animeOption.duration,
        easing = this.settings.animeOption.easing,
        startPoint = this.lastScrollY,
        finishPoint = (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_18__["default"])(elemTarget).top - this.offset(),
        range = finishPoint - startPoint;
      var currentPoint = 0,
        startTime = null;
      this.elemEventRoot.scrollTo(0, startPoint);
      requestAnimationFrame(_scrollStep.bind(this));
      return this;
      function _scrollStep(time) {
        startTime = startTime || time;
        currentPoint = startPoint + range * easing.call(null, (time - startTime) / duration);
        this.elemEventRoot.scrollTo(0, currentPoint);
        if (time - startTime < duration) {
          requestAnimationFrame(_scrollStep.bind(this));
        } else {
          this.isWorking = false;
          this.enabled = false;
          this.lastScrollY = finishPoint;
          this.elemEventRoot.scrollTo(0, finishPoint);
        }
      }
    }

    /**
     * ビューポート上部でfixed されている要素等の、スクロール量から差し引かなければならないオフセットを取得する
     */
  }, {
    key: "offset",
    value: function offset() {
      var offsetTop = 0;
      if (typeof this.offsetTop === 'number') {
        offsetTop = this.offsetTop;
      } else if (typeof this.offsetTop === 'string') {
        offsetTop = _getMaxOffset(document.querySelectorAll(this.offsetTop));
      } else if (typeof this.offsetTop === 'function') {
        offsetTop = this.offsetTop.call(this, this);
      }
      return offsetTop;
    }
  }, {
    key: "getHash",
    value: function getHash(string) {
      var hash = string || window.location.hash;
      return hash && hash.replace(/^#?(.*)/, '#$1');
    }
  }, {
    key: "addShoulder",
    value: function addShoulder(selector) {
      if (selector && typeof selector === 'string') {
        this.arryShoulderSelector.push(selector);
      }
    }
  }]);
}();

function _getMaxOffset(elems) {
  var bottoms = [];
  var _iterator = _createForOfIteratorHelper(elems),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var elem = _step.value;
      bottoms.push(elem.getBoundingClientRect().bottom);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return Math.max.apply(null, bottoms);
}

/***/ }),

/***/ "./src/js/_modules/simplevideoplay.js":
/*!********************************************!*\
  !*** ./src/js/_modules/simplevideoplay.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SimpleVideoPlay; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }














function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var d = document;
var SimpleVideoPlay = /*#__PURE__*/function () {
  function SimpleVideoPlay(options) {
    _classCallCheck(this, SimpleVideoPlay);
    var defaultSettings = this.defaultSettings = {
        name: 'SimpleVideoPlay',
        selectorVideo: '',
        selectorWrapper: '',
        elemVideo: null,
        elemWrapper: null,
        eventNameCanPlay: 'canplay.{name}',
        eventNamePlay: 'play.{name}',
        eventNamePause: 'pause.{name}',
        eventNameEnded: 'ended.{name}',
        eventNameCoverClick: 'click.{name} touchend.{name}',
        onBefore: null,
        onPlayBefore: null,
        onPlay: null,
        onPause: null,
        onEnd: null
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_14__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorVideo = settings.selectorVideo;
    this.selectorWrapper = settings.selectorWrapper;
    this.elemVideo = settings.elemVideo || d.querySelector(this.selectorVideo);
    this.elemWrapper = settings.elemWrapper || this.elemVideo.closest(this.selectorWrapper);
    this.elemCover = d.createElement('div');
    this.eventNameCanPlay = settings.eventNameCanPlay.replaceAll('{name}', this.id);
    this.eventNamePlay = settings.eventNamePlay.replaceAll('{name}', this.id);
    this.eventNamePause = settings.eventNamePause.replaceAll('{name}', this.id);
    this.eventNameEnded = settings.eventNameEnded.replaceAll('{name}', this.id);
    this.eventNameCoverClick = settings.eventNameCoverClick.replaceAll('{name}', this.id);
    this.src = this.elemVideo.src;
    this.isPlaying = false;
    this.eventVideo = null;
    this.eventCover = null;
    this.init();
  }
  return _createClass(SimpleVideoPlay, [{
    key: "init",
    value: function init() {
      this.elemWrapper.appendChild(this.elemCover);
      if (this.elemVideo.poster) {
        this.elemCover.style.backgroundImage = "url(".concat(this.elemVideo.poster, ")");
      }
      this.elemVideo.load();
    }
  }, {
    key: "on",
    value: function on(callbacks) {
      this.eventVideo = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_16__["default"](this.elemVideo);
      this.eventCover = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_16__["default"](this.elemCover);
      this.callbackBefore = callbacks.before.bind(this);
      this.callbackPlayBefore = callbacks.playBefore.bind(this);
      this.callbackPlay = callbacks.play.bind(this);
      this.callbackPause = callbacks.pause.bind(this);
      this.callbackEnd = callbacks.end.bind(this);
      this.eventCall(this.callbackBefore);
      this.eventVideo.on(this.eventNameCanPlay, this.handleCanplay.bind(this)).on(this.eventNamePlay, this.handlePlay.bind(this)).on(this.eventNamePause, this.handlePause.bind(this)).on(this.eventNameEnded, this.handleEnded.bind(this));
    }
  }, {
    key: "off",
    value: function off() {
      this.eventVideo.off(".".concat(this.id));
      this.eventCover.off(".".concat(this.id));
    }
  }, {
    key: "handleCanplay",
    value: function handleCanplay(e) {
      this.eventCall(this.callbackPlayBefore, e);
      this.eventCover.on(this.eventNameCoverClick, this.handleCoverClick.bind(this));
    }
  }, {
    key: "handlePlay",
    value: function handlePlay(e) {
      this.isPlaying = true;
      this.eventCall(this.callbackPlay, e);
    }
  }, {
    key: "handlePause",
    value: function handlePause(e) {
      this.isPlaying = false;
      this.eventCall(this.callbackPause, e);
    }
  }, {
    key: "handleEnded",
    value: function handleEnded(e) {
      this.isPlaying = false;
      this.eventCall(this.callbackEnd, e);

      /**
       * IE 11 で確認。
       * 再生終了後にvideo.load() しておかないと再度のvideo.play()を許してくれない。
       */
      this.elemVideo.load();
    }
  }, {
    key: "handleCoverClick",
    value: function handleCoverClick(e) {
      e.preventDefault();
      if (this.isPlaying === false) {
        this.elemVideo.play();
      }
    }
  }, {
    key: "eventCall",
    value: function eventCall(func, e) {
      if (typeof func === 'function') {
        func.call(this, e, this);
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/js/_modules/tab.js":
/*!********************************!*\
  !*** ./src/js/_modules/tab.js ***!
  \********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Tab; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.from.js */ "./node_modules/core-js/modules/es.array.from.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

















function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var d = document;
var Tab = /*#__PURE__*/function () {
  function Tab(options) {
    _classCallCheck(this, Tab);
    var defaultSettings = this.defaultSettings = {
        name: 'tab',
        selectorTrigger: '',
        selectorTarget: '',
        selectorWrapper: '',
        selectorAnchor: 'a',
        selectorEventRoot: '',
        elemTriggerAll: null,
        elemTargetAll: null,
        elemWrapperAll: null,
        elemEventRoot: window,
        eventNameLoad: 'DOMContentLoaded.{name} load.{name} hashchange.{name}',
        eventNameClick: 'click.{name}',
        className: 'js-selected',
        defaultIndex: 0,
        onAllChange: null,
        onChange: null
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_17__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorWrapper = settings.selectorWrapper;
    this.selectorTrigger = settings.selectorTrigger;
    this.selectorTarget = settings.selectorTarget;
    this.selectorAnchor = settings.selectorAnchor;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemTriggerAll = settings.elemTriggerAll || d.querySelectorAll(this.selectorTrigger);
    this.elemWrapperAll = settings.elemWrapperAll || d.querySelectorAll(this.selectorWrapper);
    this.elemEventRoot = settings.elemEventRoot || d.querySelector(this.selectorEventRoot);
    this.eventNameLoad = settings.eventNameLoad.replaceAll('{name}', this.id);
    this.eventNameClick = settings.eventNameClick.replaceAll('{name}', this.id);
    this.eventRoot = null;
  }

  /**
   * click event はwindow に登録
   * trigger( タブメニュー ) 以外で、ページ内に該当のリンクが有る可能性を想定。
   */
  return _createClass(Tab, [{
    key: "on",
    value: function on(callbacks) {
      this.callbackAllChange = callbacks && callbacks.allChange;
      this.callbackChange = callbacks && callbacks.change;
      this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_19__["default"](this.elemEventRoot);
      this.eventRoot.on(this.eventNameLoad, this.handleLoad.bind(this)).on(this.eventNameClick, this.selectorAnchor, this.handleClick.bind(this));
    }
  }, {
    key: "off",
    value: function off() {
      this.eventRoot.off(".".concat(this.id));
    }
  }, {
    key: "handleLoad",
    value: function handleLoad(e) {
      this.runAll(e);
    }

    /**
     * click された要素のhash と同じ値をもつtrigger をthis.elemTriggerAll から選出し、
     * this.run に引数として渡して実行。
     */
  }, {
    key: "handleClick",
    value: function handleClick(e, target) {
      var hash = target && target.hash && this.getHash(target.hash);
      var elemCurrentTrigger = null;
      if (!hash) {
        return;
      }
      e.preventDefault();
      var _iterator = _createForOfIteratorHelper(this.elemTriggerAll),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var elem = _step.value;
          if (hash === this.getHash(elem.hash)) {
            elemCurrentTrigger = elem;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (elemCurrentTrigger === null) {
        return;
      }
      this.run(elemCurrentTrigger, e);
    }

    /**
     * trigger と target を内包するwrapper 単位の実行。
     */
  }, {
    key: "run",
    value: function run(elemCurrentTrigger, e) {
      var elemTarget = d.querySelector(this.getHash(elemCurrentTrigger.hash)),
        elemWrapper = elemTarget.closest(this.selectorWrapper),
        elemTriggerAll = elemWrapper.querySelectorAll(this.selectorTrigger),
        elemTargetAll = elemWrapper.querySelectorAll(this.selectorTarget);
      _setClassName(elemTriggerAll, elemCurrentTrigger, this.settings.className);
      _setClassName(elemTargetAll, elemTarget, this.settings.className);
      if (typeof this.callbackChange === 'function') {
        this.callbackChange.call(this, elemWrapper, e, this);
      }
      return this;
      function _setClassName(elemAll, elemTarget, className) {
        var _iterator2 = _createForOfIteratorHelper(elemAll),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var elem = _step2.value;
            if (elem === elemTarget) {
              elem.classList.add(className);
            } else {
              elem.classList.remove(className);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }

    /**
     * 全wrapper 要素毎の実行
     */
  }, {
    key: "runAll",
    value: function runAll(e) {
      var hash = this.getHash() // location.href のハッシュを取得
      ;
      var selectedWrapperByHash = null;
      var _iterator3 = _createForOfIteratorHelper(this.elemWrapperAll),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var elemWrapper = _step3.value;
          var elemTriggerAll = elemWrapper.querySelectorAll(this.selectorTrigger);
          var elemCurrentTrigger = void 0,
            elemActived = void 0;
          if (!elemTriggerAll.length) {
            continue;
          }
          var _iterator4 = _createForOfIteratorHelper(elemTriggerAll),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var elem = _step4.value;
              if (this.getHash(elem.hash) === hash) {
                elemCurrentTrigger = elem;
                selectedWrapperByHash = elemWrapper;
              }
              if (elem.classList.contains(this.settings.className)) {
                elemActived = elem;
              }
            } // for

            /**
             * location.href のhash を持つtrigger が無く、かつすでに選択済みのtrigger があれば、
             * ループの頭から
             */
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
          if (!elemCurrentTrigger && elemActived) {
            continue;
          }
          this.run(elemCurrentTrigger || elemTriggerAll[this.settings.defaultIndex], e);
        } // for
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (typeof this.callbackAllChange === 'function') {
        this.callbackAllChange.call(this, selectedWrapperByHash, e, this);
      }
      return this;
    }
  }, {
    key: "getHash",
    value: function getHash(string) {
      var hash = string || window.location.hash;
      return hash && hash.replace(/^#?(.*)/, '#$1');
    }
  }]);
}();


/***/ }),

/***/ "./src/js/_modules/utilities/parents.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/utilities/parents.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ parents; }
/* harmony export */ });
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");

function parents(elem, selector, wrapper) {
  var parents = [];
  var parent = elem.parentElement;
  wrapper = wrapper || 'body';
  while (!parent.matches(wrapper)) {
    if (parent.matches(selector)) {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}

/***/ }),

/***/ "./src/js/_modules/utilities/position.js":
/*!***********************************************!*\
  !*** ./src/js/_modules/utilities/position.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ position; }
/* harmony export */ });
function position(elem) {
  var pos = {},
    rect = elem.getBoundingClientRect(),
    scTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
    scLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
  pos.top = rect.top + scTop;
  pos.left = rect.left + scLeft;
  return pos;
}

/***/ }),

/***/ "./src/js/_modules/videoground.js":
/*!****************************************!*\
  !*** ./src/js/_modules/videoground.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ VideoGround; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_async_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.async-iterator.js */ "./node_modules/core-js/modules/es.symbol.async-iterator.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_to_primitive_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.symbol.to-primitive.js */ "./node_modules/core-js/modules/es.symbol.to-primitive.js");
/* harmony import */ var core_js_modules_es_symbol_to_string_tag_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.symbol.to-string-tag.js */ "./node_modules/core-js/modules/es.symbol.to-string-tag.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_reverse_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.array.reverse.js */ "./node_modules/core-js/modules/es.array.reverse.js");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_date_to_primitive_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.date.to-primitive.js */ "./node_modules/core-js/modules/es.date.to-primitive.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_json_to_string_tag_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.json.to-string-tag.js */ "./node_modules/core-js/modules/es.json.to-string-tag.js");
/* harmony import */ var core_js_modules_es_math_to_string_tag_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.math.to-string-tag.js */ "./node_modules/core-js/modules/es.math.to-string-tag.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_object_get_prototype_of_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.object.get-prototype-of.js */ "./node_modules/core-js/modules/es.object.get-prototype-of.js");
/* harmony import */ var core_js_modules_es_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.object.set-prototype-of.js */ "./node_modules/core-js/modules/es.object.set-prototype-of.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_promise_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! core-js/modules/es.promise.js */ "./node_modules/core-js/modules/es.promise.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_timers_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! core-js/modules/web.timers.js */ "./node_modules/core-js/modules/web.timers.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! regenerator-runtime/runtime.js */ "./node_modules/regenerator-runtime/runtime.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }

























function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var d = document;
var VideoGround = /*#__PURE__*/function () {
  function VideoGround(options) {
    _classCallCheck(this, VideoGround);
    var defaultSettings = this.defaultSettings = {
        name: 'videoGround',
        selectorParent: '',
        selectorVideoFrame: '',
        elemParent: null,
        elemVideoFrame: null,
        eventNamePlay: 'play.{name}',
        eventNameCanPlay: 'canplay.{name}',
        src: '',
        waitTime: 6000,
        aspectRatio: 720 / 1280,
        actualHeightRatio: 1 / 1,
        attrVideo: ['muted', 'playsinline', 'loop']
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_25__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorParent = settings.selectorParent;
    this.selectorVideoFrame = settings.selectorVideoFrame;
    this.elemVideo = _createVideo(settings.attrVideo);
    this.elemVideoFrame = d.querySelector(this.selectorVideoFrame);
    this.elemParent = settings.elemParent || this.selectorParent && d.querySelector(this.selectorParent) || this.elemVideoFrame.parentNode;
    this.eventNamePlay = settings.eventNamePlay.replaceAll('{name}', this.id);
    this.eventNameCanPlay = settings.eventNameCanPlay.replaceAll('{name}', this.id);
    this.isPlaying = false;
    this.destroyTimerId = null;
    this.eventVideo = null;
  }

  /**
   * play()が可能か事前に調べ、結果を待って各種設定、実行。
   * 無効の場合 this.destroy() 。
   */
  return _createClass(VideoGround, [{
    key: "run",
    value: function run() {
      var _this = this;
      var settings = this.settings,
        elemVideo = this.elemVideo,
        elemVideoFrame = this.elemVideoFrame;
      this.autoDestroy();

      /* eslint space-before-function-paren: 0 */
      _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.testPlay();
            case 2:
              _context.t0 = _context.sent;
              if (!(_context.t0 === false)) {
                _context.next = 5;
                break;
              }
              return _context.abrupt("return", _this.destroy());
            case 5:
              elemVideo.src = settings.src;
              elemVideoFrame.appendChild(elemVideo);
              _this.eventCall(settings.onPlayBefore);
              elemVideo.load();
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
      return this;
    }

    /**
     * play()で再生が可能かどうか、ダミーのvideo を作成し、結果を返す
     */
  }, {
    key: "testPlay",
    value: function testPlay() {
      var _this2 = this;
      return new Promise(function (resolve) {
        var retries = 3,
          testVideo = _createVideo(_this2.settings.attrVideo);
        var timeoutId = null,
          counterOfTries = 0;
        testVideo.play();
        (function _try() {
          counterOfTries += 1;
          clearTimeout(timeoutId);
          timeoutId = null;
          if (testVideo.paused === false || counterOfTries > retries) {
            resolve(!testVideo.paused);
            return;
          }
          timeoutId = setTimeout(_try, 160);
        })();
      });
    }
  }, {
    key: "on",
    value: function on(callbacks) {
      if (_typeof(callbacks) === 'object') {
        this.callbackPlay = callbacks.play;
        this.callbackBefore = callbacks.before;
        this.callbackLoad = callbacks.load;
        this.callbackDestroy = callbacks.destroy;
      }
      this.eventVideo = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_26__["default"](this.elemVideo);
      this.eventVideo.on(this.eventNamePlay, this.handlePlay.bind(this)).on(this.eventNameCanPlay, this.handleCanPlay.bind(this));
      this.eventCall(this.callbackBefore);
      return this;
    }
  }, {
    key: "handlePlay",
    value: function handlePlay(e) {
      clearTimeout(this.destroyTimerId);
      this.destroyTimerId = null;
      this.isPlaying = true;
      this.eventCall(this.callbackPlay);
      this.eventVideo.off(this.eventNameCanPlay);
    }
  }, {
    key: "handleCanPlay",
    value: function handleCanPlay(e) {
      this.elemVideo.play();
      this.eventCall(this.callbackLoad);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      clearTimeout(this.destroyTimerId);
      if (this.elemVideoFrame.querySelector(this.settings.classNameTarget) !== null) {
        this.elemVideoFrame.removeChild(this.elemVideo);
      }
      this.eventCall(this.callbackDestroy);
      this.eventVideo.off(".".concat(this.id));
      return this;
    }

    /**
     * 待機時間を過ぎれば、this.destroy() 。
     */
  }, {
    key: "autoDestroy",
    value: function autoDestroy() {
      var _this3 = this;
      this.destroyTimerId = setTimeout(function () {
        clearTimeout(_this3.destroyTimerId);
        _this3.destroyTimerId = null;
        _this3.destroy();
      }, this.settings.waitTime);
    }

    /**
     * ojbect-fit の代替。
     */
  }, {
    key: "resize",
    value: function resize() {
      var settings = this.settings,
        frameWidth = this.elemParent.offsetWidth,
        frameHeight = this.elemParent.offsetHeight,
        frameAspectRatio = frameHeight / frameWidth;
      if (frameAspectRatio > settings.aspectRatio) {
        this.elemVideo.style.width = 'auto';
        this.elemVideo.style.height = frameHeight * settings.actualHeightRatio + 'px';
      } else {
        this.elemVideo.style.width = 100 + '%';
        this.elemVideo.style.height = 'auto';
      }
      return this;
    }
  }, {
    key: "eventCall",
    value: function eventCall(func) {
      if (typeof func === 'function') {
        func.call(this, this);
      }
    }
  }]);
}();

function _createVideo(props) {
  var elemVideo = d.createElement('video');
  for (var i = 0, len = props.length; i < len; i++) {
    elemVideo.setAttribute(props[i], '');
    elemVideo[props[i]] = true;
  }
  return elemVideo;
}

/***/ }),

/***/ "./src/js/_vendor/raf.js":
/*!*******************************!*\
  !*** ./src/js/_vendor/raf.js ***!
  \*******************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_timers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.timers.js */ "./node_modules/core-js/modules/web.timers.js");

/*!
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license
*/

(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
})();

/***/ })

}]);
//# sourceMappingURL=../sourcemaps/js/common_modules_body.js.map