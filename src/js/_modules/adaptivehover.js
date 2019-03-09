'use strict';

import $ from '../_vendor/jquery-3.2.1.js';
require('../_vendor/modernizr.js');
const
  $root = $('html')
;
/* globals Modernizr */
export default class AdaptiveHover {
  constructor( options ) {
    this.defaultSettings = {
      name : 'adaptiveHover',
      target : '',
      timeout : 400,
      range : 10,
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.target = null;
    this.enterEventName = '';
    this.leaveEeventName = '';
    this.callBackForEnter = null;
    this.callBackForLeave = null;
    this.pageX = null;
    this.pageY = null;
    this.timeoutId = null;
    this.status = '';
  }

  on( callBackForEnter, callBackForLeave ) {
    const
      settings = this.settings
      ,eventNameForClick = Modernizr.touchevents ? 'touchend' : 'click'
    ;
    
    this.enterEventName = `touchstart.${this.id} mouseenter.${this.id}`;
    this.leaveEventName = `touchend.${this.id} mouseleave.${this.id}`;
    this.callBackForEnter = callBackForEnter;
    this.callBackForLeave = callBackForLeave;
    this.target = document.querySelectorAll( settings.target )[0];

    $root.on( this.enterEventName, settings.target, ( e ) => {
      this.handleForEnter( e );
    } );
    $root.on( `${eventNameForClick}.${this.id}`, ( e ) => {
      const 
        isNotRelative = !_isRelative( this.target, e.target )
      ;
      if( isNotRelative && this.status === 'enter' ) {
        this.clear();
        $root.off( this.leaveEventName, settings.target );
        this.leave( e, this.callBackForLeave );
        $root.on( this.enterEventName, settings.target, ( e ) => {
          this.handleForEnter( e );
        } );
      }
    } );
    return this;
  }

  off() {
    const
      settings = this.settings
    ;
    this.clear();
    $root.off( this.enterEventName, settings.target );
    $root.off( this.leaveEventName, settings.target );
    return this;
  }

  handleForEnter( e ) {
    const 
      eventObj = _getEventObj( e )
      ,settings = this.settings
    ;
    this.pageX = eventObj.pageX;
    this.pageY = eventObj.pageY;
    $root.off( this.enterEventName, settings.target );
    this.enter( e );
    $root.on( this.leaveEventName, settings.target, ( e ) => {
      this.handleForLeave( e );
    } );
  }

  handleForLeave( e ) {
    const
      settings = this.settings
      ,range = settings.range
      ,isOriginPoint = _isOriginPoint( _getEventObj( e ), this.pageX, this.pageY, range )
    ;
    if ( isOriginPoint ) {
      clearTimeout( this.timeoutId );
      this.timeoutId = setTimeout( () => {
        this.clear();
      }, settings.timeout );
    } else {
      $root.off( this.leaveEventName, settings.target );
      this.leave( e, this.callBackForLeave );
      $root.on( this.enterEventName, settings.target, ( e ) => {
        this.handleForEnter( e, this.callBackForEnter );
      } );
    }
  }

  enter( e ) {
    this.status = 'enter';
    this.callBackForEnter.call( this, e, this );
  }

  leave( e ) {
    this.status = 'leave';
    this.callBackForLeave.call( this, e, this );
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
  return $( ancestor ).is( elem ) && $( elem ).closest( ancestor ).length === 1;
}

function _getEventObj( e ) {
  return e.changedTouches ? e.changedTouches[0] : e;
}