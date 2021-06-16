/*!
 * adaptivehover.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import '../polyfills/matches';
import '../polyfills/closest';
import merge from 'lodash/mergeWith';
import EM from '../utilities/eventmanager';

export default class AdaptiveHover {

  constructor( options ) {
    this.defaultSettings = {
      name            : 'adaptiveHover',
      selectorTarget : '',
      elemEventRoot   : document.body,
      timeout         : 400,
      range           : 10,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.elemTarget = document.querySelector( this.settings.selectorTarget );
    this.elemEventRoot = this.settings.elemEventRoot;
    this.callbackForEnter = null;
    this.callbackForLeave = null;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
    this.enteringEventName = `touchstart.${this.id} mouseover.${this.id}`;
    this.leavingEventName = `touchend.${this.id} mouseout.${this.id}`;
    this.outSideEventName = `touchend.${this.id} click.${this.id}`;
    this.evtRoot = new EM( this.elemEventRoot );
  }

  on( callbackForEnter, callbackForLeave ) {
    this.callbackForEnter = callbackForEnter;
    this.callbackForLeave = callbackForLeave;
    this.evtRoot
      .on( this.enteringEventName,this.handleForEnter.bind( this ) )
      .on( this.leavingEventName, this.handleForLeave.bind( this ) )
      .on( this.outSideEventName, this.handleForOutSide.bind( this ) )
    ;
    return this;
  }

  off() {
    this.clear();
    this.evtRoot.off( `.${this.id}` );
    return this;
  }

  handleForEnter( e ) {
    if ( this.elemTarget.isEqualNode( e.target ) )  {
      this.enter( e );
    }
  }

  handleForLeave( e ) {
    const
      settings = this.settings
      ,range = settings.range
      ,isOriginPoint = _isOriginPoint( _getEventObj( e ), this.pageX, this.pageY, range )
    ;
    if (
      !isOriginPoint &&
      this.elemTarget === e.target &&
      this.elemTarget.contains( e.relatedTarget ) === false
    ) {
      this.leave( e, this.callbackForLeave );
    }
  }

  handleForOutSide( e ) {
    const settings = this.settings;
    if ( !_isRelative( e.target, settings.selectorTarget ) && this.isEntering === true ) {
      this.clear();
      this.leave( e, this.callbackForLeave );
    }
  }

  enter( e ) {
    const
      eventObj = _getEventObj( e )
      ,settings = this.settings
    ;
    if ( this.isEntering === false ) {
      clearTimeout( this.timeoutId );
      this.timeoutId = setTimeout( () => this.clear(), settings.timeout );
      this.pageX = eventObj.pageX;
      this.pageY = eventObj.pageY;
      this.isEntering = true;
      this.callbackForEnter.call( this, e, this );
    }
  }

  leave( e ) {
    if ( this.isEntering === true ) {
      clearTimeout( this.timeoutId );
      this.isEntering = false;
      this.callbackForLeave.call( this, e, this );
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
