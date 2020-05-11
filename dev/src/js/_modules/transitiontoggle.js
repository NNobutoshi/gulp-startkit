/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

// import $ from 'jquery';
import merge from 'lodash/mergeWith';

const
  $ = window.jQuery
;
export default class Toggle {

  constructor( options ) {
    this.defaultSettings = {
      name              : 'transitiontoggle',
      selectorTrigger   : '',
      selectorTarget    : '',
      selectorIndicator : null,
      selectorEventRoot : 'body',
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.eventRoot = this.settings.selectorEventRoot;
    this.elemIndicator = document.querySelector( this.settings.selectorIndicator );
    this.elemTrigger = null;
    this.elemTarget = null;
    this.eventName = `click.${this.id}`;
    this.callBackForBefore = null;
    this.callBackForAfter = null;
    this.isChanged = false;
  }

  on( callBackForBefore, callBackForAfter, callBackForEnd ) {
    const
      settings = this.settings
      ,$root = $( this.eventRoot )
    ;
    let
      isChanged = false
    ;
    if ( this.elemIndicator === null ) {
      return this;
    }
    this.elemTrigger = this.elemIndicator.querySelector( settings.selectorTrigger );
    this.elemTarget = this.elemIndicator.querySelector( settings.selectorTarget );
    this.callBackForBefore = callBackForBefore;
    this.callBackForAfter = callBackForAfter;
    $root.on( this.eventName, settings.selectorTrigger, ( e ) => {
      if ( this.isChanged === true ) {
        this.handleForAfter( e );
      } else {
        this.handleForBefore( e );
      }
    } )
    ;
    $root.on( `transitionend.${this.id}`, this.target, ( e ) => {
      if ( isChanged !== this.isChanged ) {
        if ( typeof callBackForEnd === 'function' ) {
          callBackForEnd.call( this, e, this );
        }
        isChanged = this.isChanged;
      }
    } )
    ;
    return this;
  }

  off() {
    this.elemIndicator = null;
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callBackForBefore = null;
    this.callBackForAfter = null;
    $( this.eventRoot ).off( `.${this.id}`, this.target );
    return this;
  }

  handleForBefore( e ) {
    this.open( e );
  }

  handleForAfter( e ) {
    this.close( e );
  }

  open( e ) {
    this.isChanged = true;
    this.callBackForBefore.call( this, e, this );
  }

  close( e ) {
    this.isChanged = false;
    this.callBackForAfter.call( this, e, this );
  }
}
