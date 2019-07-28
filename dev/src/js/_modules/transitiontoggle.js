/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import $ from 'jquery';

export default class Toggle {

  constructor( options ) {
    this.defaultSettings = {
      name              : 'transitiontoggle',
      selectorTrigger   : '',
      selectorTarget    : '',
      selectorIndicator : null,
      selectorEventRoot : 'body',
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.eventRoot = this.settings.selectorEventRoot;
    this.elemIndicator = document.querySelector( this.settings.selectorIndicator );
    this.elemTrigger = null;
    this.elemTarget = null;
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
    if ( this.elemIndicator === null ) {
      return this;
    }
    this.elemTrigger = this.elemIndicator.querySelector( settings.selectorTrigger );
    this.elemTarget = this.elemIndicator.querySelector( settings.selectorTarget );
    this.callBackForOpen = callBackForOpen;
    this.callBackForClose = callBackForClose;
    $root.on( this.eventName, settings.selectorTrigger, ( e ) => {
      if ( this.isOpen === true ) {
        this.handleForClose( e );
      } else {
        this.handleForOpen( e );
      }
    } )
    ;
    $root.on( `transitionend.${this.id}`, this.target, ( e ) => {
      if ( isOpen !== this.isOpen ) {
        if ( typeof callBackForEnd === 'function' ) {
          callBackForEnd.call( this, e, this );
        }
        isOpen = this.isOpen;
      }
    } )
    ;
    return this;
  }

  off() {
    this.elemIndicator = null;
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callBackForOpen = null;
    this.callBackForClose = null;
    $( this.eventRoot ).off( `.${this.id}`, this.target );
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
