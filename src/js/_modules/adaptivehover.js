/*!
 * adaptivehover.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import './polyfills/matches.js';
import closest from './utilities/closest.js';
import merge from 'lodash/mergeWith';
import EM from './utilities/eventmanager';

export default class AdaptiveHover {

  constructor( options ) {
    this.defaultSettings = {
      name      : 'adaptiveHover',
      target    : '',
      timeout   : 400,
      range     : 10,
      elemEventRoot : document.body,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.target = null;
    this.elemEventRoot = this.settings.elemEventRoot;
    this.callBackForEnter = null;
    this.callBackForLeave = null;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.isEntering = false;
    this.enteringEventName = `touchstart.${this.id} mouseover.${this.id}`;
    this.leavingEventName = `touchend.${this.id} mouseout.${this.id}`;
    this.outSideEventName = `touchend.${this.id} click.${this.id}`;
    this.evtRoot = new EM( this.elemEventRoot );
    this.elemEventRoot.addEventListener( 'click', () => {
      this.off();
    } );
  }

  on( callBackForEnter, callBackForLeave ) {
    const
      settings = this.settings
    ;
    this.callBackForEnter = callBackForEnter;
    this.callBackForLeave = callBackForLeave;
    this.target = document.querySelector( settings.target );
    this.evtRoot.on( this.enteringEventName, ( e ) => {
      this.handleForEnter( e );
    } );
    this.evtRoot.on( this.leavingEventName, ( e ) =>{
      this.handleForLeave( e );
    } );
    this.evtRoot.on( this.outSideEventName, ( e )  => {
      this.handleForOutSide( e );
    } );
    return this;
  }

  off() {
    this.clear();
    this.evtRoot.off( `.${this.id}` );
    return this;
  }

  handleForEnter( e ) {
    if ( this.target.isEqualNode( e.target ) )  {
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
      this.target === e.target &&
      this.target.contains( e.relatedTarget ) === false
    ) {
      this.leave( e, this.callBackForLeave );
    }
  }

  handleForOutSide( e ) {
    const settings = this.settings;
    if ( !_isRelative( settings.target, e.target ) && this.isEntering === true ) {
      this.clear();
      this.leave( e, this.callBackForLeave );
    }
  }

  enter( e ) {
    const
      eventObj = _getEventObj( e )
      ,settings = this.settings
    ;
    if ( this.isEntering === false ) {
      clearTimeout( this.timeoutId );
      this.timeoutId = setTimeout( () =>  this.clear(), settings.timeout );
      this.pageX = eventObj.pageX;
      this.pageY = eventObj.pageY;
      this.isEntering = true;
      this.callBackForEnter.call( this, e, this );
    }
  }

  leave( e ) {
    if ( this.isEntering === true ) {
      clearTimeout( this.timeoutId );
      this.isEntering = false;
      this.callBackForLeave.call( this, e, this );
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

function _isRelative( ancestor, elem ) {
  return elem.matches( ancestor ) || closest( elem, ancestor );
}

function _getEventObj( e ) {
  return e.changedTouches ? e.changedTouches[ 0 ] : e;
}
