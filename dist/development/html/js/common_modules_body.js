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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Accordion)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var _libs_transitiontoggle_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./libs/transitiontoggle.js */ "./src/js/_modules/libs/transitiontoggle.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");






const d = document;
class Accordion {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
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
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__({}, defaultSettings, options);
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
  setUp() {
    Array.prototype.forEach.call(this.elemParentAll, (elemParent, index) => {
      const toggle = new _libs_transitiontoggle_js__WEBPACK_IMPORTED_MODULE_3__["default"]({
        name: this.id + index,
        elemParent: elemParent,
        elemTrigger: elemParent.querySelector(this.selectorTrigger),
        elemTarget: elemParent.querySelector(this.selectorTarget),
        toggleHeight: this.settings.toggleHeight,
        propertyTargetTransition: this.settings.propertyTargetTransition
      });
      this.toggles.push(toggle);
    });
  }
  on(callbacks) {
    this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_5__["default"](this.elemEventRoot);
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
    this.toggles.forEach((toggle, index) => {
      toggle.callbackBefore = this.callbackBefore.bind(toggle);
      toggle.callbackAfter = this.callbackAfter.bind(toggle);
      toggle.callbackFinish = this.callbackFinish.bind(toggle);
    });
    return this;
  }
  handleStart(e, elemEventTarget) {
    this.toggles.forEach(toggle => {
      if (toggle.elemTrigger === elemEventTarget) {
        toggle.handleStart(e);
        return false;
      } else if (this.settings.otherClosing === true && toggle.isChanged === true) {
        toggle.after(e);
      }
    });
  }
  handleFinish(e, elemEventTarget) {
    this.toggles.forEach(toggle => {
      if (toggle.elemTarget === elemEventTarget) {
        toggle.handleFinish(e);
        return false;
      }
    });
  }
  handleAllafter() {
    this.toggles.forEach(toggle => {
      if (toggle.isChanged === true) {
        toggle.after();
      }
    });
  }
  handleAllBefore() {
    this.toggles.forEach(toggle => {
      if (toggle.isChanged === false) {
        toggle.before();
      }
    });
  }
}

/***/ }),

/***/ "./src/js/_modules/adjust.js":
/*!***********************************!*\
  !*** ./src/js/_modules/adjust.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ua-parser-js */ "./node_modules/ua-parser-js/src/main/ua-parser.mjs");

const uAParser = new ua_parser_js__WEBPACK_IMPORTED_MODULE_0__.UAParser();
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(className) {
  const elemHtml = document.documentElement,
    browser = uAParser.getBrowser();
  elemHtml.classList.add(className);
  elemHtml.classList.add(browser.name + browser.major);
}

/***/ }),

/***/ "./src/js/_modules/foo.js":
/*!********************************!*\
  !*** ./src/js/_modules/foo.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AdaptiveHover)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");



/*!
 * adaptivehover.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */





const d = document;
class AdaptiveHover {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
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
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_5__({}, defaultSettings, options);
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
  on(callbackEnter, callbackLeave) {
    this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_6__["default"](this.elemEventRoot);
    this.callbackEnter = callbackEnter;
    this.callbackLeave = callbackLeave;
    this.eventRoot.on(this.eventNameEnter, this.selectorTarget, this.handleEnter.bind(this)).on(this.eventNameLeave, this.selectorTarget, this.handleLeave.bind(this)).on(this.eventNameOutside, this.handleOutSide.bind(this));
    return this;
  }
  off() {
    this.clear();
    this.evtRoot.off(".".concat(this.id));
    return this;
  }
  handleEnter(e, target) {
    this.enter(e, target);
  }
  handleLeave(e, target) {
    const coverage = this.settings.coverage,
      isOriginPoint = _isOriginPoint(_getEventObj(e), this.pageX, this.pageY, coverage);
    if (!isOriginPoint && this.elemActive === target && this.elemActive.contains(e.relatedTarget) === false && target.contains(e.relatedTarget) === false) {
      this.leave(e, target);
    }
  }
  handleOutSide(e) {
    if (!_isRelative(e.target, this.settings.selectorTarget) && this.isEntering === true) {
      this.clear();
      this.leave(e, this.elemActive);
    }
  }
  enter(e, target) {
    const eventObj = _getEventObj(e);
    if (this.isEntering === true && this.elemActive !== target) {
      this.leave(e, this.elemActive);
    }
    if (this.isEntering === false) {
      clearTimeout(this.timeoutId);
      this.elemActive = target;
      this.timeoutId = setTimeout(() => this.clear(), this.settings.delayTime);
      this.pageX = eventObj.pageX;
      this.pageY = eventObj.pageY;
      this.isEntering = true;
      this.callbackEnter.call(this, e, this, target);
    }
  }
  leave(e, target) {
    if (this.isEntering === true) {
      clearTimeout(this.timeoutId);
      this.isEntering = false;
      this.callbackLeave.call(this, e, this, target);
    }
  }
  clear() {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.pageX = null;
    this.pageY = null;
  }
}
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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventManager)
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");


class EventManager {
  constructor(elemEventer) {
    this.listeners = {};
    this.elemEventer = elemEventer || document;
  }
  on(fullEventTypeNames, selectorTarget, listener, options) {
    if (typeof selectorTarget === 'function') {
      [options, listener, selectorTarget] = [listener, selectorTarget, null];
    }
    this.setUp('add', fullEventTypeNames, selectorTarget, listener, options);
    return this;
  }
  off(fullEventTypeNames, listener) {
    this.setUp('remove', fullEventTypeNames, null, listener);
    return this;
  }
  trigger(fullEventTypeNames) {
    this.setUp('trigger', fullEventTypeNames);
    return this;
  }

  /**
   * 半角スペースで区切られた、複数分の、name space を含むfull のtype name 毎に処理。
   * "add"、"remove"、"trigger"と、渡されたprefix 引数で処理を分ける。
   */
  setUp(prefix, fullEventTypeNames, selectorTarget, listener, options) {
    const that = this;
    fullEventTypeNames.split(' ').forEach(fullEventTypeName => {
      const [eventType, nameSpace] = fullEventTypeName.split('.');
      let objListeners, mapListener, target;

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
        if (!this.listeners[fullEventTypeName]) {
          this.listeners[fullEventTypeName] = [];
        }
        this.listeners[fullEventTypeName].push(mapListener);
        this.setEventListener(prefix, eventType, mapListener.get(listener), options);
      } // if( prefix === 'add' )

      /**
       * this.listeners の中からそのkeyに、渡された引数fullEventTypeNames がフルで一致するもの、
       * event type 名だけが渡され、それが部分的に含まれるもの、
       * name space だけが渡され、それが部分的に含まれるものを収集。
       */
      if (prefix === 'remove' || prefix === 'trigger') {
        objListeners = _collectListeners(key => {
          return eventType && nameSpace && fullEventTypeName === key || eventType && !nameSpace && key.indexOf(eventType) === 0 || !eventType && nameSpace && key.indexOf(".".concat(nameSpace)) >= 0;
        });

        /**
         * 収集したobject の中からprefix 引数に応じて、"remove" で、removeEventListener"の登録。
         * "trigger"でそのままlistner を実行。
         */
        for (const [typeName, arrListeners] of Object.entries(objListeners)) {
          if (prefix === 'remove') {
            delete that.listeners[typeName];
          }
          arrListeners.forEach(mapListener => {
            if (prefix === 'remove' && (!listener || mapListener.has(listener))) {
              this.setEventListener(prefix, typeName, mapListener.values().next().value);
            } else if (prefix === 'trigger') {
              mapListener.values().next().value();
            }
          });
        }
      } // if ( prefix === 'remove' || prefix === 'trigger' )
    });

    /**
     * this.listeners の中から渡されたcondition 関数でtrue を返すkey と値を格納したobject を返す。
     */
    function _collectListeners(condition) {
      const objListeners = {};
      for (const [fullTypeName, arrListeners] of Object.entries(that.listeners)) {
        if (condition.call(null, fullTypeName, arrListeners)) {
          const [typeName] = fullTypeName.split('.');
          if (!objListeners[typeName]) {
            objListeners[typeName] = [];
          }
          objListeners[typeName] = objListeners[typeName].concat(arrListeners);
        }
      }
      return objListeners;
    }
  }
  setEventListener(prefix, eventType, listener, options) {
    const arrElements = this.elemEventer.length ? Array.from(this.elemEventer) : [this.elemEventer];
    arrElements.forEach(elem => {
      elem["".concat(prefix, "EventListener")](eventType, listener, options);
    });
  }
}

/***/ }),

/***/ "./src/js/_modules/libs/optimizedresize.js":
/*!*************************************************!*\
  !*** ./src/js/_modules/libs/optimizedresize.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OptimizedResize)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var _vendor_raf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../_vendor/raf.js */ "./src/js/_vendor/raf.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");




/*!
 * optimizedresize.js
 * Inspired by https://developer.mozilla.org
 */




const d = document;
let uniqueNumber = 0;
class OptimizedResize {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
        name: 'optimizedresize',
        selectorEventRoot: '',
        elemEventRoot: window,
        eventName: 'resize.{name}',
        delayTime: 10
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_5__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemEventRoot = settings.elemEventRoot || d.querySelector(this.selectorEventRoot);
    this.callbacks = {};
    this.isRunning = false;
    this.eventName = settings.eventName.replaceAll('{name}', this.id);
    this.eventRoot = null;
  }
  runCallbacksAll() {
    for (const key in this.callbacks) {
      const props = this.callbacks[key];
      let query = false;
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
  add(callback, options) {
    const settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_5__({}, {
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
  remove(name) {
    delete this.callbacks[name];
  }
  off(name) {
    this.remove(name);
  }
  on(query, callback, name) {
    if (typeof query === 'function') {
      [callback, name, query] = [query, callback, ''];
    }
    return this.add(callback, {
      name: name,
      query: query,
      one: false,
      turn: false,
      cross: false
    });
  }
  one(query, callback, name) {
    return this.add(callback, {
      name: name,
      query: query,
      one: true,
      turn: false,
      cross: false
    });
  }
  turn(query, callback, name) {
    return this.add(callback, {
      name: name,
      query: query,
      one: false,
      turn: true,
      cross: false
    });
  }
  cross(query, callback, name) {
    return this.add(callback, {
      name: name,
      query: query,
      one: false,
      turn: false,
      cross: true
    });
  }
  setUp() {
    if (!Object.keys(this.callbacks).length) {
      this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_6__["default"](this.elemEventRoot);
      this.eventRoot.on(this.eventName, e => this.handleSetup(e));
    }
  }
  destroy() {
    this.evtRoot.off(this.eventName);
  }
  handleSetup() {
    this.run();
  }
  run() {
    const delayTime = this.settings.delayTime,
      func = this.runCallbacksAll.bind(this);
    let startTime = null;
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
}
function _getUniqueName(base) {
  return base + new Date().getTime() + uniqueNumber++;
}

/***/ }),

/***/ "./src/js/_modules/libs/scrollmanager.js":
/*!***********************************************!*\
  !*** ./src/js/_modules/libs/scrollmanager.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ScrollManager)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _utilities_position_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utilities/position.js */ "./src/js/_modules/utilities/position.js");
/* harmony import */ var _vendor_raf_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../_vendor/raf.js */ "./src/js/_vendor/raf.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");




/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */





const doc = document;
let counter = 0;
class ScrollManager {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
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
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__({}, defaultSettings, options);
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
  runCallbacksAll() {
    const scTop = this.elemEventRoot.pageYOffset,
      innerHeight = this.elemEventRoot.innerHeight;
    for (let key in this.callbacks) {
      const entry = this.callbacks[key],
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
        scrollFrom = viewTop + catchPoint - (hookPoint + (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_5__["default"])(elemTarget).top),
        ratio = scrollFrom / range;
      entry.observed = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__(entry.observed, {
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
  add(callback, elemTarget, options) {
    const defaultOptions = {
        name: _getUniqueName(this.id),
        elemTarget: elemTarget,
        flag: false,
        observed: {}
      },
      entry = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__({}, defaultOptions, options);
    entry.callback = callback;
    this.setUp();
    this.callbacks[entry.name] = entry;
    return this;
  }
  remove(name) {
    delete this.callbacks[name];
    return this;
  }
  on(callback, elemTarget, options) {
    return this.add(callback, elemTarget, options);
  }
  off(name) {
    return this.remove(name);
  }
  setUp() {
    if (!this.callbacks.length) {
      this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_7__["default"](this.elemEventRoot);
      this.eventRoot.on(this.eventName, () => this.handle());
    }
    return this;
  }
  destroy() {
    this.eventRoot.off(this.eventName);
    return this;
  }
  handle() {
    const func = this.runCallbacksAll.bind(this),
      delayTime = this.settings.delayTime;
    let startTime = null;
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
}
function _getMaxOffset(selector, vwHeight, pos) {
  const elems = selector && document.querySelectorAll(selector),
    [base, maxOrMin] = pos === 'top' ? ['bottom', 'max'] : ['top', 'min'];
  let ret = 0,
    arryPositionNumber = [];
  if (!elems) {
    return ret;
  }
  for (let elem of elems) {
    if (window.getComputedStyle(elem).position === 'fixed') {
      arryPositionNumber.push(elem.getBoundingClientRect()[base]);
    }
  }
  ret = Math[maxOrMin].apply(null, arryPositionNumber);
  ret = pos === 'bottom' ? vwHeight - ret : ret;
  return ret < 0 ? 0 : ret;
}
function _getUniqueName(base) {
  return base + new Date().getTime() + counter++;
}
function _calcPoint(base, val) {
  let ret = 0;
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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TtransitionToggle)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");



/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */



const d = document;
class TtransitionToggle {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
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
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_3__({}, defaultSettings, options);
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
  on(callbacks) {
    this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.elemEvtRoot);
    this.callbackBefore = callbacks.before.bind(this);
    this.callbackAfter = callbacks.after.bind(this);
    this.callbackFinish = callbacks.finish.bind(this);
    this.eventRoot.on(this.eventNameStart, this.selectorTrigger, this.handleStart.bind(this)).on(this.eventNameFinish, this.selectorTarget, this.handleFinish.bind(this));
    return this;
  }
  off() {
    this.elemParent = null;
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callbackBefore = null;
    this.callbackAfter = null;
    this.callbackFinish = null;
    this.eventRoot.off('.' + this.id);
    return this;
  }
  handleStart(e) {
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
  handleFinish(e) {
    const targetProperty = this.settings.propertyTargetTransition;
    if (targetProperty && e.propertyName && targetProperty !== e.propertyName) {
      return;
    }
    this.isWorking = false;
    this.callbackFinish.call(this, e, this);
  }
  before(e) {
    const that = this,
      styleDefaultTransition = window.getComputedStyle(this.elemTarget).transition,
      style = this.elemTarget.style;
    let height,
      startTime = null;
    if (this.settings.toggleHeight === true) {
      style.transitionProperty = 'none';
      style.display = 'block';
      style.height = 'auto';
      height = this.elemTarget.getBoundingClientRect().height;
      style.height = 0;
      requestAnimationFrame(_setHeight);
      function _setHeight(timeStamp) {
        if (startTime === null) {
          startTime = timeStamp;
        }
        if (timeStamp - startTime > 100) {
          style.transition = styleDefaultTransition;
          style.height = height + 'px';
          that.callbackBefore.call(this, e, this);
        } else {
          requestAnimationFrame(_setHeight);
        }
      }
    } else {
      this.callbackBefore.call(this, e, this);
    }
    this.isChanged = true;
  }
  after(e) {
    if (this.settings.toggleHeight === true) {
      this.elemTarget.style.height = 0;
    }
    this.isChanged = false;
    this.callbackAfter.call(this, e, this);
  }
}

/***/ }),

/***/ "./src/js/_modules/locate.js":
/*!***********************************!*\
  !*** ./src/js/_modules/locate.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Locate)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _utilities_parents_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utilities/parents.js */ "./src/js/_modules/utilities/parents.js");





class Locate {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
        name: 'locate',
        selectorTarget: '',
        selectorParent: '',
        elemTargetAll: null,
        indexRegex: /index\.[^/]+?$/
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_3__({}, defaultSettings, options);
    this.id = settings.name;
    this.selectorTarget = settings.selectorTarget;
    this.selectorParent = settings.selectorParent;
    this.elemTargetAll = settings.elemTargetAll || document.querySelectorAll(this.selectorTarget);
    this.elemCurrent = null;
    this.elemParentAll = null;
  }
  run(callback) {
    const hostNameByLocal = location.host,
      pathnameByLocal = location.pathname.replace(this.settings.indexRegex, '');
    this.elemCurrent = null;
    this.elemParentAll = null;
    for (const elemTarget of this.elemTargetAll) {
      const pathNameByElement = elemTarget.pathname.replace(this.settings.indexRegex, ''),
        hostNameByElement = elemTarget.host;
      if (hostNameByLocal !== hostNameByElement) {
        continue;
      } else if (pathNameByElement === pathnameByLocal) {
        this.elemCurrent = elemTarget;
        this.elemParentAll = (0,_utilities_parents_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.elemCurrent, this.selectorParent, 'body');
      }
    } // for
    if (typeof callback === 'function') {
      callback.call(this, this);
    }
    return this;
  }
}

/***/ }),

/***/ "./src/js/_modules/polyfills/closest.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/polyfills/closest.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Rescroll)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _utilities_position_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utilities/position.js */ "./src/js/_modules/utilities/position.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _vendor_raf_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../_vendor/raf.js */ "./src/js/_vendor/raf.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");




/*!
 * rescroll.js
 */






const d = document;
class Rescroll {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
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
          easing: function (pos) {
            return 1 - Math.pow(1 - pos, 5);
          }
        }
      },
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__({}, defaultSettings, options);
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
  on() {
    this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_8__["default"](this.elemEventRoot);
    this.eventRoot.on(this.eventNameLoad, this.handleLoad.bind(this)).on(this.eventNameHashChange, this.handleHashChange.bind(this)).on(this.eventNameClick, this.selectorTrigger, this.handleClick.bind(this)).on(this.eventNameScroll, this.handleScroll.bind(this));
    return this;
  }
  off() {
    this.evtRoot.off(".".concat(this.id));
    this.lastScrollY = null;
    this.enabled = false;
    this.isWorking = false;
    return this;
  }
  handleLoad(e) {
    this.enabled = true;
    this.preprocess(e);
  }
  handleHashChange(e) {
    this.enabled = true;
    this.preprocess(e);
  }
  handleClick(e, target) {
    const hash = target && target.hash && this.getHash(target.hash);
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
  handleScroll(e) {
    requestAnimationFrame(() => {
      if (this.enabled === false) {
        this.lastScrollY = this.elemEventRoot.pageYOffset;
      }
    });
  }
  preprocess(e, target) {
    const hash = this.getHash(),
      arryShoulder = this.arryShoulderSelector,
      elemByHash = hash ? document.querySelector(hash) : null,
      elemShoulder = arryShoulder.length && elemByHash && _getShoulderElement.bind(this)(elemByHash);
    let lastScrollY = this.lastScrollY,
      currentScrollY = this.elemEventRoot.pageYOffset;

    /**
     * クリックされたA要素とジャンプ先を肩代わりする要素のY座標が同一であれば、
     * or すでに実行中であれば、
     * or 実行が許可されていなければ、
     * or ジャンプ先を肩代わりする要素も、hash をセレクターにして得られた要素も、どちらもなければ、
     * return
     */
    if (e.type === 'click' && target && target.hash && elemShoulder && (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_5__["default"])(target).top === (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_5__["default"])(elemShoulder).top || this.isWorking === true || this.enabled === false || !elemByHash && !elemShoulder) {
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
      const arry = this.arryShoulderSelector;
      let elemClosest = null;
      if (!elemTarget) {
        return elemClosest;
      }
      for (let i = 0, len = arry.length; i < len; i++) {
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
  scroll(elemTarget) {
    const finishPoint = (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_5__["default"])(elemTarget).top - this.offset();
    this.elemEventRoot.scrollTo(0, this.lastScrollY);
    this.elemEventRoot.scrollTo(0, finishPoint);
    this.isWorking = false;
    this.enabled = false;
    this.lastScrollY = finishPoint;
  }

  /**
   * スムーススクロール
   */
  animatedScroll(elemTarget) {
    const duration = this.settings.animeOption.duration,
      easing = this.settings.animeOption.easing,
      startPoint = this.lastScrollY,
      finishPoint = (0,_utilities_position_js__WEBPACK_IMPORTED_MODULE_5__["default"])(elemTarget).top - this.offset(),
      range = finishPoint - startPoint;
    let currentPoint = 0,
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
  offset() {
    let offsetTop = 0;
    if (typeof this.offsetTop === 'number') {
      offsetTop = this.offsetTop;
    } else if (typeof this.offsetTop === 'string') {
      offsetTop = _getMaxOffset(document.querySelectorAll(this.offsetTop));
    } else if (typeof this.offsetTop === 'function') {
      offsetTop = this.offsetTop.call(this, this);
    }
    return offsetTop;
  }
  getHash(string) {
    const hash = string || window.location.hash;
    return hash && hash.replace(/^#?(.*)/, '#$1');
  }
  addShoulder(selector) {
    if (selector && typeof selector === 'string') {
      this.arryShoulderSelector.push(selector);
    }
  }
}
function _getMaxOffset(elems) {
  let bottoms = [];
  for (let elem of elems) {
    bottoms.push(elem.getBoundingClientRect().bottom);
  }
  return Math.max.apply(null, bottoms);
}

/***/ }),

/***/ "./src/js/_modules/simplevideoplay.js":
/*!********************************************!*\
  !*** ./src/js/_modules/simplevideoplay.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SimpleVideoPlay)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");






const d = document;
class SimpleVideoPlay {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
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
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_3__({}, defaultSettings, options);
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
  init() {
    this.elemWrapper.appendChild(this.elemCover);
    if (this.elemVideo.poster) {
      this.elemCover.style.backgroundImage = "url(".concat(this.elemVideo.poster, ")");
    }
    this.elemVideo.load();
  }
  on(callbacks) {
    this.eventVideo = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_5__["default"](this.elemVideo);
    this.eventCover = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_5__["default"](this.elemCover);
    this.callbackBefore = callbacks.before.bind(this);
    this.callbackPlayBefore = callbacks.playBefore.bind(this);
    this.callbackPlay = callbacks.play.bind(this);
    this.callbackPause = callbacks.pause.bind(this);
    this.callbackEnd = callbacks.end.bind(this);
    this.eventCall(this.callbackBefore);
    this.eventVideo.on(this.eventNameCanPlay, this.handleCanplay.bind(this)).on(this.eventNamePlay, this.handlePlay.bind(this)).on(this.eventNamePause, this.handlePause.bind(this)).on(this.eventNameEnded, this.handleEnded.bind(this));
  }
  off() {
    this.eventVideo.off(".".concat(this.id));
    this.eventCover.off(".".concat(this.id));
  }
  handleCanplay(e) {
    this.eventCall(this.callbackPlayBefore, e);
    this.eventCover.on(this.eventNameCoverClick, this.handleCoverClick.bind(this));
  }
  handlePlay(e) {
    this.isPlaying = true;
    this.eventCall(this.callbackPlay, e);
  }
  handlePause(e) {
    this.isPlaying = false;
    this.eventCall(this.callbackPause, e);
  }
  handleEnded(e) {
    this.isPlaying = false;
    this.eventCall(this.callbackEnd, e);

    /**
     * IE 11 で確認。
     * 再生終了後にvideo.load() しておかないと再度のvideo.play()を許してくれない。
     */
    this.elemVideo.load();
  }
  handleCoverClick(e) {
    e.preventDefault();
    if (this.isPlaying === false) {
      this.elemVideo.play();
    }
  }
  eventCall(func, e) {
    if (typeof func === 'function') {
      func.call(this, e, this);
    }
  }
}

/***/ }),

/***/ "./src/js/_modules/tab.js":
/*!********************************!*\
  !*** ./src/js/_modules/tab.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Tab)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _polyfills_closest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./polyfills/closest.js */ "./src/js/_modules/polyfills/closest.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");









const d = document;
class Tab {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
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
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_4__({}, defaultSettings, options);
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
  on(callbacks) {
    this.callbackAllChange = callbacks && callbacks.allChange;
    this.callbackChange = callbacks && callbacks.change;
    this.eventRoot = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_6__["default"](this.elemEventRoot);
    this.eventRoot.on(this.eventNameLoad, this.handleLoad.bind(this)).on(this.eventNameClick, this.selectorAnchor, this.handleClick.bind(this));
  }
  off() {
    this.eventRoot.off(".".concat(this.id));
  }
  handleLoad(e) {
    this.runAll(e);
  }

  /**
   * click された要素のhash と同じ値をもつtrigger をthis.elemTriggerAll から選出し、
   * this.run に引数として渡して実行。
   */
  handleClick(e, target) {
    const hash = target && target.hash && this.getHash(target.hash);
    let elemCurrentTrigger = null;
    if (!hash) {
      return;
    }
    e.preventDefault();
    for (let elem of this.elemTriggerAll) {
      if (hash === this.getHash(elem.hash)) {
        elemCurrentTrigger = elem;
      }
    }
    if (elemCurrentTrigger === null) {
      return;
    }
    this.run(elemCurrentTrigger, e);
  }

  /**
   * trigger と target を内包するwrapper 単位の実行。
   */
  run(elemCurrentTrigger, e) {
    const elemTarget = d.querySelector(this.getHash(elemCurrentTrigger.hash)),
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
      for (let elem of elemAll) {
        if (elem === elemTarget) {
          elem.classList.add(className);
        } else {
          elem.classList.remove(className);
        }
      }
    }
  }

  /**
   * 全wrapper 要素毎の実行
   */
  runAll(e) {
    const hash = this.getHash() // location.href のハッシュを取得
    ;
    let selectedWrapperByHash = null;
    for (let elemWrapper of this.elemWrapperAll) {
      const elemTriggerAll = elemWrapper.querySelectorAll(this.selectorTrigger);
      let elemCurrentTrigger, elemActived;
      if (!elemTriggerAll.length) {
        continue;
      }
      for (let elem of elemTriggerAll) {
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
      if (!elemCurrentTrigger && elemActived) {
        continue;
      }
      this.run(elemCurrentTrigger || elemTriggerAll[this.settings.defaultIndex], e);
    } // for

    if (typeof this.callbackAllChange === 'function') {
      this.callbackAllChange.call(this, selectedWrapperByHash, e, this);
    }
    return this;
  }
  getHash(string) {
    const hash = string || window.location.hash;
    return hash && hash.replace(/^#?(.*)/, '#$1');
  }
}

/***/ }),

/***/ "./src/js/_modules/utilities/parents.js":
/*!**********************************************!*\
  !*** ./src/js/_modules/utilities/parents.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parents)
/* harmony export */ });
/* harmony import */ var _polyfills_matches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills/matches.js */ "./src/js/_modules/polyfills/matches.js");

function parents(elem, selector, wrapper) {
  const parents = [];
  let parent = elem.parentElement;
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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ position)
/* harmony export */ });
function position(elem) {
  const pos = {},
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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VideoGround)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_esnext_string_replace_all_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.string.replace-all.js */ "./node_modules/core-js/modules/esnext.string.replace-all.js");
/* harmony import */ var lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/mergeWith.js */ "./node_modules/lodash/mergeWith.js");
/* harmony import */ var _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./libs/eventmanager.js */ "./src/js/_modules/libs/eventmanager.js");
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! regenerator-runtime/runtime.js */ "./node_modules/regenerator-runtime/runtime.js");






const d = document;
class VideoGround {
  constructor(options) {
    const defaultSettings = this.defaultSettings = {
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
      settings = this.settings = lodash_mergeWith_js__WEBPACK_IMPORTED_MODULE_3__({}, defaultSettings, options);
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
  run() {
    const settings = this.settings,
      elemVideo = this.elemVideo,
      elemVideoFrame = this.elemVideoFrame;
    this.autoDestroy();

    /* eslint space-before-function-paren: 0 */
    (async () => {
      if ((await this.testPlay()) === false) {
        return this.destroy();
      }
      elemVideo.src = settings.src;
      elemVideoFrame.appendChild(elemVideo);
      this.eventCall(settings.onPlayBefore);
      elemVideo.load();
    })();
    return this;
  }

  /**
   * play()で再生が可能かどうか、ダミーのvideo を作成し、結果を返す
   */
  testPlay() {
    return new Promise(resolve => {
      const retries = 3,
        testVideo = _createVideo(this.settings.attrVideo);
      let timeoutId = null,
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
  on(callbacks) {
    if (typeof callbacks === 'object') {
      this.callbackPlay = callbacks.play;
      this.callbackBefore = callbacks.before;
      this.callbackLoad = callbacks.load;
      this.callbackDestroy = callbacks.destroy;
    }
    this.eventVideo = new _libs_eventmanager_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.elemVideo);
    this.eventVideo.on(this.eventNamePlay, this.handlePlay.bind(this)).on(this.eventNameCanPlay, this.handleCanPlay.bind(this));
    this.eventCall(this.callbackBefore);
    return this;
  }
  handlePlay(e) {
    clearTimeout(this.destroyTimerId);
    this.destroyTimerId = null;
    this.isPlaying = true;
    this.eventCall(this.callbackPlay);
    this.eventVideo.off(this.eventNameCanPlay);
  }
  handleCanPlay(e) {
    this.elemVideo.play();
    this.eventCall(this.callbackLoad);
  }
  destroy() {
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
  autoDestroy() {
    this.destroyTimerId = setTimeout(() => {
      clearTimeout(this.destroyTimerId);
      this.destroyTimerId = null;
      this.destroy();
    }, this.settings.waitTime);
  }

  /**
   * ojbect-fit の代替。
   */
  resize() {
    const settings = this.settings,
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
  eventCall(func) {
    if (typeof func === 'function') {
      func.call(this, this);
    }
  }
}
function _createVideo(props) {
  const elemVideo = d.createElement('video');
  for (let i = 0, len = props.length; i < len; i++) {
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
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
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