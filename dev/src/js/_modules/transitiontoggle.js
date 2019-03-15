'use strict';

import $ from '../_vendor/jquery-3.2.1.js';

export default class Toggle {

  constructor( options ) {
    this.defaultSettings = {
      name : 'transitiontoggle',
      trigger : '',
      target : '',
      toAddClass : null,
      eventRoot : 'body'
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.trigger = this.settings.trigger;
    this.target = this.settings.target;
    this.eventRoot = this.settings.eventRoot;
    this.elemTrigger = null;
    this.elemTarget = null;
    this.elemToClass = null;
    this.eventName = `click.${this.id}`;
    this.callBackForOpen = null;
    this.callBackForClose = null;
    this.isOpen = false;
  }

  on( callBackForOpen, callBackForClose, callBackForEnd ) {
    const
      settings = this.settings
      ,$root = $( this.eventRoot )
    ;
    let
      isOpen = false
    ;
    this.elemToAddClass = document.querySelectorAll( settings.toAddClass );
    this.elemTrigger = document.querySelectorAll( this.trigger );
    this.elemTarget = document.querySelectorAll( this.target );
    this.callBackForOpen = callBackForOpen;
    this.callBackForClose = callBackForClose;
    $root.one( this.eventName, this.trigger, ( e ) => {
      this.handleForOpen( e );
    } );
    $root.on( `transitionend.${this.id}`, this.target, ( e ) => {
      if ( isOpen !== this.isOpen ) {
        if ( this.isOpen === true ) {
          $root.one( this.eventName, this.trigger, ( e ) => {
            this.handleForClose( e );
          } );
        } else if( this.isOpen === false ){
          $root.one( this.eventName, this.trigger, ( e ) => {
            this.handleForOpen( e );
          } );
        }
        if( typeof callBackForEnd === 'function' ) {
          callBackForEnd.call( this, e, this );
        }
        isOpen = this.isOpen;
      }
    } )
    ;
    return this;
  }

  off() {
    this.elemToAddClass = null;
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callBackForOpen = null;
    this.callBackForClose = null;
    $( this.eventRoot ).off( `transitionend.${this.id}`, this.target );
    return this;
  }

  handleForOpen( e ) {
    this.open( e );
  }

  handleForClose( e ) {
    this.close( e );
  }

  open( e ) {
    this.isOpen = true;
    this.callBackForOpen.call( this, e, this );
  }

  close( e ) {
    this.isOpen = false;
    this.callBackForClose.call( this, e, this );
  }
}