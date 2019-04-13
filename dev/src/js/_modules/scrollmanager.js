/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import $ from 'jquery';

let
  counter = 0
;

export default class ScrollManager {

  constructor( options ) {
    this.defaultSettings = {
      name         : 'scrollManager',
      offsetTop    : 0,
      offsetBottom : 0,
      delay        : 66,
      eventRoot    : window
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.offsetTop = this.settings.offsetTop;
    this.offsetBottom = this.settings.offsetBottom;
    this.callBacks = {};
    this.eventName = `scroll.${this.id}`;
    this.eventRoot = this.settings.eventRoot;
    this.isRunning = false;
    this.lastSctop = 0;
    this.lastScBottom = 0;
    this.isScrollDown = null;
  }

  runCallBacksAll() {
    const
      scTop = $( this.eventRoot ).scrollTop()
      ,scBottom = scTop + window.innerHeight
    ;
    let
      offsetTop = 0
      ,offsetBottom = 0
    ;

    if ( typeof this.offsetTop === 'number' ) {
      offsetTop = this.offsetTop;
    } else if ( typeof this.offsetTop === 'string' ) {
      offsetTop = _getTotalHeight( document.querySelectorAll( this.offsetTop ) );
    }

    if ( typeof this.offsetBottom === 'number' ) {
      offsetBottom = this.offsetBottom;
    } else if ( typeof this.offsetBottom === 'string' ) {
      offsetBottom = _getTotalHeight( document.querySelectorAll( this.offsetTop ) );
    }

    this.isScrollDown = scTop > this.lastSctop;
    this.scTop = scTop + offsetTop;
    this.scBottom = scBottom - offsetBottom;

    Object.keys( this.callBacks ).forEach( ( key ) => {
      const
        props = this.callBacks[ key ]
      ;
      let
        target = props.inviewTarget
        ,rect
        ,targetOffsetTop
        ,targetOffsetBottom
      ;
      if ( target && target !== null ) {
        rect = target.getBoundingClientRect();
        targetOffsetTop = rect.top + scTop;
        targetOffsetBottom = rect.bottom + scTop;
        if ( targetOffsetTop < this.scBottom && targetOffsetBottom > this.scTop ) {
          props.inview = true;
        } else {
          props.inview = false;
        }
      }
      return props.callBack.call( this, props, this );
    } );
    this.isRunning = false;
    this.lastSctop = scTop;
    this.lastScBottom = scBottom;
    return this;
  }

  add( callBack, options ) {
    const
      defaultSttings = {
        name : _getUniqueName( this.id ),
        flag : false,
      }
      ,settings = $.extend( {}, defaultSttings, options )
    ;
    settings.callBack = callBack;
    this.setUp();
    this.callBacks[ settings.name ] = settings;
    return this;
  }

  remove( name ) {
    delete this.callBacks[ name ];
    return this;
  }

  on( callBack, options ) {
    return this.add( callBack, options );
  }

  inview( target, callBack, options ) {
    return this.add( callBack, options || { inviewTarget : target} );
  }

  setUp() {
    if ( !this.callBacks.length ) {
      $( this.eventRoot ).on( this.eventName, () => {
        this.run();
      } );
    }
    return this;
  }

  run() {
    if ( !this.isRunning ) {
      this.isRunning = true;
      if ( requestAnimationFrame ) {
        requestAnimationFrame( () => { this.runCallBacksAll(); } );
      } else {
        setTimeout( () => { this.runCallBacksAll(); }, this.settintgs.delay );
      }
    }
    return this;
  }

}

function _getTotalHeight( elem ) {
  let
    total = 0
  ;
  Array.prototype.forEach.call( elem, ( self ) => {
    total = total + $( self ).outerHeight( true );
  } );
  return total;
}

function _getUniqueName( base ) {
  return base + new Date().getTime()+ counter++;
}
