/*!
 * adaptivehover.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import '../polyfills/matches';
import '../polyfills/closest';
import merge from 'lodash/mergeWith';
import EM from '../utilities/eventmanager';

const doc = document;
export default class AdaptiveHover {

  constructor( options ) {
    this.defaultSettings = {
      name              : 'adaptiveHover',
      selectorTarget    : '',
      selectorEventRoot : 'body',
      delayTime         : 400,
      range             : 10,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.selectorTarget = this.settings.selectorTarget;
    this.selectorEvetnRoot = this.settings.selectorEventRoot;
    this.elemTarget = doc.querySelector( this.selectorTarget );
    this.elemEventRoot = doc.querySelector( this.selectorEventRoot );
    this.callbackEnter = null;
    this.callbackLeave = null;
    this.eventNameEnter = `touchstart.${this.id} mouseover.${this.id}`;
    this.eventNameLeave = `touchend.${this.id} mouseout.${this.id}`;
    this.eventNameOutside = `touchend.${this.id} click.${this.id}`;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
    this.evtRoot = new EM( this.elemEventRoot );
  }

  on( callbackEnter, callbackLeave ) {
    this.callbackEnter = callbackEnter;
    this.callbackLeave = callbackLeave;
    this.evtRoot
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

  handleEnter( e ) {
    this.enter( e );
  }

  handleLeave( e, target ) {
    const
      settings = this.settings
      ,range = settings.range
      ,isOriginPoint = _isOriginPoint( _getEventObj( e ), this.pageX, this.pageY, range )
    ;
    if (
      !isOriginPoint &&
      this.elemTarget === target &&
      this.elemTarget.contains( e.relatedTarget ) === false
    ) {
      this.leave( e, this.callbackLeave );
    }
  }

  handleOutSide( e ) {
    const settings = this.settings;
    if ( !_isRelative( e.target, settings.selectorTarget ) && this.isEntering === true ) {
      this.clear();
      this.leave( e, this.callbackLeave );
    }
  }

  enter( e ) {
    const
      eventObj = _getEventObj( e )
      ,settings = this.settings
    ;
    if ( this.isEntering === false ) {
      clearTimeout( this.timeoutId );
      this.timeoutId = setTimeout( () => this.clear(), settings.delayTime );
      this.pageX = eventObj.pageX;
      this.pageY = eventObj.pageY;
      this.isEntering = true;
      this.callbackEnter.call( this, e, this );
    }
  }

  leave( e ) {
    if ( this.isEntering === true ) {
      clearTimeout( this.timeoutId );
      this.isEntering = false;
      this.callbackLeave.call( this, e, this );
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
