/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import merge from 'lodash/mergeWith';
import Events from './utilities/events';

export default class Toggle {

  constructor( options ) {
    this.defaultSettings = {
      name              : 'transitiontoggle',
      selectorTrigger   : '',
      selectorTarget    : '',
      selectorParent    : null,
      selectorEventRoot : 'body',
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.eventRoot = this.settings.selectorEventRoot;
    this.elemParent = document.querySelector( this.settings.selectorParent );
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callBackForBefore = null;
    this.callBackForAfter = null;
    this.callBackForEnd = null;
    this.isChanged = false;
  }

  on( callBackForBefore, callBackForAfter, callBackForEnd ) {
    const
      settings = this.settings
    ;
    this.elemRoot = document.querySelector( this.eventRoot );
    if ( this.elemParent === null ) {
      return this;
    }
    new Events( this, this.elemRoot );
    this.elemTrigger = this.elemParent.querySelector( settings.selectorTrigger );
    this.elemTarget = this.elemParent.querySelector( settings.selectorTarget );
    this.callBackForBefore = callBackForBefore;
    this.callBackForAfter = callBackForAfter;
    this.callBackForEnd = callBackForEnd;
    this.elemRoot.on( 'click', this.handleForClick );
    this.elemRoot.on( 'transitionend', this.handleForTransitionend );
    return this;
  }

  off() {
    this.elemParent = null;
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callBackForBefore = null;
    this.callBackForAfter = null;
    this.elemRoot.off( 'click', this.handleForClick );
    this.elemRoot.off( 'transitionend', this.handleForTransitionend );
    return this;
  }

  handleForClick( e ) {
    if ( this.elemTrigger.isEqualNode( e.target ) )  {
      if ( this.isChanged === true ) {
        this.after( e );
      } else {
        this.before( e );
      }
    }
  }

  handleForTransitionend( e ) {
    if ( this.elemTarget.isEqualNode( e.target ) && this.isChanged === false )  {
      if ( typeof this.callBackForEnd === 'function' ) {
        this.callBackForEnd.call( this, e, this );
      }
    }
  }

  before( e ) {
    this.isChanged = true;
    this.callBackForBefore.call( this, e, this );
  }

  after( e ) {
    this.isChanged = false;
    this.callBackForAfter.call( this, e, this );
  }
}
