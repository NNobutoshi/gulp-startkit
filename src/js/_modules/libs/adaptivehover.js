/*!
 * adaptivehover.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import '../polyfills/matches.js';
import '../polyfills/closest.js';
import merge from 'lodash/mergeWith.js';
import EM from '../libs/eventmanager.js';

const d = document;

export default class AdaptiveHover {

  constructor( options ) {
    const
      defaultSettings = this.defaultSettings = {
        name              : 'adaptiveHover',
        selectorTarget    : '',
        selectorEventRoot : 'body',
        elemTarget        : null,
        elemActive        : null,
        elemEventRoot     : window,
        eventNameEnter    : 'touchstart.{name} mouseover.{name}',
        eventNameLeave    : 'touchend.{name} mouseout.{name}',
        eventNameOutside  : 'touchend.{name} click.{name}',
        delayTime         : 500,
        coverage          : 20,
      },
      settings = this.settings = merge( {}, defaultSettings, options )
    ;
    this.id = settings.name;
    this.selectorTarget = settings.selectorTarget;
    this.selectorEvetnRoot = settings.selectorEventRoot;
    this.elemTarget = settings.elemTarget || d.querySelector( this.selectorTarget );
    this.elemEventRoot = settings.elemEventRoot || d.querySelector( this.selectorEventRoot );
    this.eventNameEnter = settings.eventNameEnter.replaceAll( '{name}', this.id );
    this.eventNameLeave = settings.eventNameLeave.replaceAll( '{name}', this.id );
    this.eventNameOutside = settings.eventNameOutside.replaceAll( '{name}', this.id );
    this.callbackEnter = null;
    this.callbackLeave = null;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
    this.eventRoot = null;
  }

  on( callbackEnter, callbackLeave ) {
    this.eventRoot = new EM( this.elemEventRoot );
    this.callbackEnter = callbackEnter;
    this.callbackLeave = callbackLeave;
    this.eventRoot
      .on( this.eventNameEnter, this.selectorTarget, this.handleEnter.bind( this ) )
      .on( this.eventNameLeave, this.selectorTarget, this.handleLeave.bind( this ) )
      .on( this.eventNameOutside, this.handleOutSide.bind( this ) )
    ;
    return this;
  }

  off() {
    this.clear();
    this.evtRoot.off( `.${this.id}` );
    return this;
  }

  handleEnter( e, target ) {
    this.enter( e, target );
  }

  handleLeave( e, target ) {
    const
      coverage = this.settings.coverage
      ,isOriginPoint = _isOriginPoint( _getEventObj( e ), this.pageX, this.pageY, coverage )
    ;
    if (
      !isOriginPoint &&
      this.elemActive === target &&
      this.elemActive.contains( e.relatedTarget ) === false &&
      target.contains( e.relatedTarget ) === false
    ) {
      this.leave( e, target );
    }
  }

  handleOutSide( e ) {
    if ( !_isRelative( e.target, this.settings.selectorTarget ) && this.isEntering === true ) {
      this.clear();
      this.leave( e, this.elemActive );
    }
  }

  enter( e, target ) {
    const
      eventObj = _getEventObj( e )
    ;
    if ( this.isEntering === true && this.elemActive !== target ) {
      this.leave( e, this.elemActive );
    }
    if ( this.isEntering === false ) {
      clearTimeout( this.timeoutId );
      this.elemActive = target;
      this.timeoutId = setTimeout( () => this.clear(), this.settings.delayTime );
      this.pageX = eventObj.pageX;
      this.pageY = eventObj.pageY;
      this.isEntering = true;
      this.callbackEnter.call( this, e, this, target );
    }
  }

  leave( e ,target ) {
    if ( this.isEntering === true ) {
      clearTimeout( this.timeoutId );
      this.isEntering = false;
      this.callbackLeave.call( this, e, this, target );
    }
  }

  clear() {
    clearTimeout( this.timeoutId );
    this.timeoutId = null;
    this.pageX = null;
    this.pageY = null;
  }

}

function _isOriginPoint( eventObj, pageX, pageY, range ) {
  return  eventObj.pageX > pageX - range &&
          eventObj.pageX < pageX + range &&
          eventObj.pageY > pageY - range &&
          eventObj.pageY < pageY + range
  ;
}

function _isRelative( elem, ancestor ) {
  return elem.matches( ancestor ) || elem.closest( ancestor );
}

function _getEventObj( e ) {
  return e.changedTouches ? e.changedTouches[ 0 ] : e;
}
