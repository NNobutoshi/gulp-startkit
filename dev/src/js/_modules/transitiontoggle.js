/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import $ from 'jquery';

export default class Toggle {

  constructor( options ) {
    this.defaultSettings = {
      name : 'transitiontoggle',
      trigger : '',
      target : '',
      toAddClass : null,
      eventRoot : document.querySelector('body'),
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.trigger = this.settings.trigger;
    this.target = this.settings.target;
    this.eventRoot = this.settings.eventRoot;
    this.elemToAddClass = document.querySelector( this.settings.toAddClass );
    this.elemTrigger = null;
    this.elemTarget = null;
    this.eventName = `click.${this.id}`;
    this.callBackForOpen = null;
    this.callBackForClose = null;
    this.isOpen = false;
  }

  on( callBackForOpen, callBackForClose, callBackForEnd ) {
    const
      $root = $( this.eventRoot )
    ;
    let
      isOpen = false
    ;
    if ( this.elemToAddClass === null ) return this;
    this.elemTrigger = this.elemToAddClass.querySelector( this.trigger );
    this.elemTarget = this.elemToAddClass.querySelector( this.target );
    this.callBackForOpen = callBackForOpen;
    this.callBackForClose = callBackForClose;
    $root.on( this.eventName, this.trigger, ( e ) => {
      if ( this.isOpen === true ) {
        this.handleForClose( e );
      } else {
        this.handleForOpen( e );
      }
    } )
    ;
    $root.on( `transitionend.${this.id}`, this.target, ( e ) => {
      if ( isOpen !== this.isOpen ) {
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
