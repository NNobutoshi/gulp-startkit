/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

// import $ from 'jquery';
import offset from './utilities/offset.js';
import '../_vendor/rAf.js';
const
  $ = window.jQuery
;
let
  counter = 0
;

export default class ScrollManager {

  constructor( options ) {
    this.defaultSettings = {
      name          : 'scrollManager',
      topOffsetsSelector    : '',
      bottomOffsetsSelector : '',
      delay         : 32,
      eventRoot     : window,
      throttle      : 0,
      catchPoint    : '100%',
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.topOffsetsSelector = this.settings.topOffsetsSelector;
    this.bottomOffsetsSelector = this.settings.bottomOffsetsSelector;
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
      ,offsetTop    = this.offsetTop    = _getMaxOffset( this.topOffsetsSelector, 'top' )
      ,offsetBottom = this.offsetBottom = _getMaxOffset( this.bottomOffsetsSelector, 'bottom' )
      ,vwTop        = this.vwTop        = scTop - offsetTop
      ,vwHeight     = this.vwHeight     = window.innerHeight - offsetTop - offsetBottom
      ,catchPoint   = this.catchPoint   = _calcPoint( vwHeight, this.settings.catchPoint )
    ;
    Object.keys( this.callBacks ).forEach( ( key ) => {
      const
        entry       = this.callBacks[ key ]
        ,targetElem = entry.targetElem || document.createElement( 'div' )
        ,rect       = targetElem.getBoundingClientRect()
        ,hookPoint  = _calcPoint( rect.height, entry.hookPoint )
        ,range      = catchPoint + ( rect.height - hookPoint )
        ,scrollFrom = ( vwTop + catchPoint ) - ( hookPoint + offset( targetElem ).top )
        ,ratio      = scrollFrom / range
      ;
      entry.observed = $.extend( entry.observed, {
        name   : entry.name,
        target : entry.targetElem,
        range  : range,
        scroll : scrollFrom,
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

  add( callBack, targetElem, options ) {
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

  on( callBack, targetElem, options ) {
    return this.add( callBack, targetElem, options );
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

function _getMaxOffset( selector , pos ) {
  const
    ret = 0
    ,arry = []
  ;
  let
    elements
  ;
  if ( typeof selector === 'number' ) {
    ret = selector;
  } else if ( selector && typeof selector === 'string' ) {
    elements = document.querySelectorAll( selector );
    Array.prototype.forEach.call( elements, ( self ) => {
      let
        style
      ;
      if ( !self ) {
        return;
      }
      style = window.getComputedStyle( self );
      if ( style.position !== 'fixed' ) {
        return;
      }
      if ( pos === 'bottom' ) {
        arry.push( self.getBoundingClientRect().top );
      } else {
        arry.push( self.getBoundingClientRect().bottom );
      }
    } );
  }
  if ( ret.length ) {
    ret = Math.max.apply( null, ret );
  }
  return ret;
}

function _getUniqueName( base ) {
  return base + new Date().getTime() + counter++;
}


function _calcPoint( base, val ) {
  let
    ret = 0
  ;
  if ( typeof val === 'string' ) {
    if ( val.indexOf( '%' ) > -1 ) {
      ret = base * parseInt( val, 10 ) / 100;
    } else {
      ret = parseInt( val, 10 );
    }
  } else if ( typeof val === 'number' ) {
    ret = val;
  }
  return ret;
}
