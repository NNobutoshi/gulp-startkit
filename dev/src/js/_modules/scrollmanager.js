/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import $ from 'jquery';
import '../_vendor/rAf.js';

let
  counter = 0
;

export default class ScrollManager {

  constructor( options ) {
    this.defaultSettings = {
      name         : 'scrollManager',
      offsetTop    : 0,
      offsetBottom : 0,
      delay        : 32,
      eventRoot    : window,
      throttle     : 0,
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.offsetTop = 0;
    this.offsetBottom = 0;
    this.callBacks = {};
    this.eventName = `scroll.${this.id}`;
    this.eventRoot = this.settings.eventRoot;
    this.isRunning = false;
    this.lastSctop = 0;
    this.lastScBottom = 0;
    this.scrollDown = null;
    this.scrollUp = null;
    this.startTime = null;
  }

  runCallBacksAll() {
    const
      scTop         = this.scTop        = this.eventRoot.pageYOffset
      ,scBottom     = this.scBottom     = scTop + window.innerHeight
      ,offsetTop    = this.offsetTop    = _getTotalHeight( this.settings.offsetTop )
      ,offsetBottom = this.offsetBottom = _getTotalHeight( this.settings.offsetBottom )
      ,vwTop        = this.vwTop        = scTop - offsetTop
      ,vwBottom     = this.vwBottom     = scBottom - this.offsetBottom
      ,vwHeight     = this.vwHeight     = window.innerHeight - offsetTop - offsetBottom
    ;
    Object.keys( this.callBacks ).forEach( ( key ) => {
      const
        entry              = this.callBacks[ key ]
        ,targetElem        = entry.targetElem
        ,rect              = targetElem.getBoundingClientRect()
        ,range             = rect.height + vwHeight
        ,scrollFromRectTop = vwBottom - ( vwTop + rect.top )
        ,ratio             = scrollFromRectTop / range
      ;
      entry.observed = $.extend( entry.observed, {
        name   : entry.name,
        target : entry.targetElem,
        range  : range,
        scroll : scrollFromRectTop,
        ratio  : ratio,
      } );
      entry.callBack.call( this, entry.observed, this );
    } );

    this.isRunning = false;

    if ( this.scTop > this.lastSctop ) {
      this.scrollDown = true;
      this.scrollUp = false;
    } else {
      this.isScrollDown = false;
      this.scrollUp = true;
    }
    this.isRunning = false;
    this.lastSctop = this.scTop;
    this.lastScBottom = this.scBottom;
    return this;
  }

  add( targetElem, callBack, options ) {
    const
      defaultOptions = {
        targetElem : targetElem,
        name       : _getUniqueName( this.id ),
        flag       : false,
        ovserved   : {},
      }
      ,entry = $.extend( {}, defaultOptions, options )
    ;
    entry.callBack = callBack;
    this.setUp();
    this.callBacks[ entry.name ] = entry;
    return this;
  }

  remove( name ) {
    delete this.callBacks[ name ];
    return this;
  }

  on( targetElem, callBack, options ) {
    return this.add( targetElem, callBack, options );
  }

  off( name ) {
    return this.remove( name );
  }

  setUp() {
    if ( !this.callBacks.length ) {
      $( this.eventRoot ).on( this.eventName, () => {
        this.handle();
      } );
    }
    return this;
  }

  handle() {
    const
      that = this
    ;
    if ( !this.isRunning ) {
      this.isRunning = true;
      if ( typeof this.settings.throttle === 'number' && this.settings.throttle > 0 ) {
        _throttle( this.runCallBacksAll );
      } else {
        requestAnimationFrame( () => {
          this.runCallBacksAll();
        } );
      }
    }
    return this;

    function _throttle( func ) {
      requestAnimationFrame( ( timeStamp ) => {
        if ( that.startTime === null ) {
          that.startTime = timeStamp;
        }
        if ( timeStamp - that.startTime > that.settings.throttle ) {
          that.startTime = null;
          func.call( that );
        } else {
          _throttle( func );
        }
      } );
    }
  }

}

function _getTotalHeight( arg ) {
  let
    elem
    ,total = 0
  ;
  if ( typeof arg === 'number' ) {
    total = arg;
  } else if ( arg === 'string' ) {
    elem = document.querySelectorAll( arg );
    Array.prototype.forEach.call( elem, ( self ) => {
      total = total + $( self ).outerHeight( true );
    } );
  }
  return total;
}

function _getUniqueName( base ) {
  return base + new Date().getTime() + counter++;
}
