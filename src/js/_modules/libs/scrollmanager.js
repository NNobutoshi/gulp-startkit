/*!
 * scrollmanager.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import merge from 'lodash/mergeWith';
import position from '../utilities/position';
import '../../_vendor/raf';
import EM from '../utilities/eventmanager';

const
  doc = document
;
let
  counter = 0
;

export default class ScrollManager {

  constructor( options ) {
    this.defaultSettings = {
      name                 : 'scrollManager',
      selectorOffsetTop    : '',
      selectorOffsetBottom : '',
      selectorEventRoot    : '',
      delayTime            : 0,
      catchPoint           : '100%',
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.selectorEventRoot = this.settings.selectorEventRoot;
    this.selectorOffsetTop = this.settings.selectorOffsetTop;
    this.selectorOffsetBottom = this.settings.selectorOffsetBottom;
    this.elemEventRoot = this.selectorEventRoot && doc.querySelector( this.selectorEventRoot ) ||
      window
    ;
    this.callbacks = {};
    this.eventName = `scroll.${this.id}`;
    this.isRunning = false;
    this.lastSctop = 0;
    this.scrollDown = null;
    this.scrollUp = null;
    this.startTime = null;
    this.catchPoint = this.settings.catchPoint;
    this.evtRoot = new EM( this.elemEventRoot );
  }

  runCallbacksAll() {
    const
      scTop     = this.elemEventRoot.pageYOffset
      ,vwHeight = this.elemEventRoot.innerHeight
    ;
    for ( let key in this.callbacks ) {
      const
        entry = this.callbacks[ key ]
        ,selectorOffsetTop     = entry.selectorOffsetTop || this.selectorOffsetTop
        ,selectorOffsetBottom = entry.selectorOffsetBottom || this.selectorOffsetBottom
        ,offsetTop    = _getMaxOffset( selectorOffsetTop, vwHeight, 'top' )
        ,offsetBottom = _getMaxOffset( selectorOffsetBottom, vwHeight, 'bottom' )
        ,vwTop        = scTop + offsetTop
        ,vwBottom     = vwHeight - offsetTop - offsetBottom
        ,catchPoint   =  _calcPoint( vwBottom, this.catchPoint )
        ,elemTarget   = entry.elemTarget || document.createElement( 'div' )
        ,rect         = elemTarget.getBoundingClientRect()
        ,hookPoint    = _calcPoint( rect.height, entry.observed.hookPoint || entry.hookPoint )
        ,range        = catchPoint + ( rect.height - hookPoint )
        ,scrollFrom   = ( vwTop + catchPoint ) - ( hookPoint + position( elemTarget ).top )
        ,ratio        = scrollFrom / range
      ;

      entry.observed = merge( entry.observed, {
        name    : entry.name,
        target  : entry.elemTarget,
        range   : range,
        scroll  : scrollFrom,
        ratio   : ratio,
        catched : ratio >= 0 && ratio <= 1
      } );
      entry.callback.call( this, entry.observed, this );

    } // for

    this.isRunning = false;

    if ( scTop > this.lastSctop ) {
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

  add( callback, elemTarget, options ) {
    const
      defaultOptions = {
        name       : _getUniqueName( this.id ),
        elemTarget : elemTarget,
        flag       : false,
        observed   : {},
      }
      ,entry = merge( {}, defaultOptions, options )
    ;
    entry.callback = callback;
    this.setUp();
    this.callbacks[ entry.name ] = entry;
    return this;
  }

  remove( name ) {
    delete this.callbacks[ name ];
    return this;
  }

  on( callback, elemTarget, options ) {
    return this.add( callback, elemTarget, options );
  }

  off( name ) {
    return this.remove( name );
  }

  setUp() {
    if ( !this.callbacks.length ) {
      this.evtRoot.on( this.eventName, () => this.handle() );
    }
    return this;
  }

  destroy() {
    this.evtRoot.off( this.eventName );
    return this;
  }

  handle() {
    const
      func = this.runCallbacksAll.bind( this )
      ,delayTime = this.settings.delayTime
    ;
    let startTime = null;
    if ( this.isRunning === true ) {
      return;
    }
    this.isRunning = true;
    if ( typeof delayTime === 'number' && delayTime > 0 ) {
      requestAnimationFrame( _throttle );
    } else {
      requestAnimationFrame( func );
    }
    return this;

    function _throttle( timeStamp ) {
      if ( startTime === null ) {
        startTime = timeStamp;
      }
      if ( timeStamp - startTime >= delayTime ) {
        func();
      } else {
        requestAnimationFrame( _throttle );
      }
    }

  }

}

function _getMaxOffset( selector, vwHeight, pos ) {
  const
    elems = selector && document.querySelectorAll( selector )
    ,[ base, maxOrMin ] = ( pos === 'top' ) ? [ 'bottom', 'max' ] : [ 'top','min' ]
    ;
  let
    ret = 0
    ,arryPositionNumber = []
    ;
  if ( !elems ) {
    return ret;
  }
  for ( let elem of elems ) {
    if ( window.getComputedStyle( elem ).position === 'fixed' ) {
      arryPositionNumber.push( elem.getBoundingClientRect()[ base ] );
    }
  }
  ret = Math[ maxOrMin ].apply( null, arryPositionNumber );
  ret = ( pos === 'bottom' ) ? vwHeight - ret : ret;
  return ( ret < 0 ) ? 0 : ret;
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
