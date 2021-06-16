/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import merge from 'lodash/mergeWith';
import EM from '../utilities/eventmanager';

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
    this.elemRoot = document.querySelector( this.settings.selectorEventRoot );
    this.elemParent = document.querySelector( this.settings.selectorParent );
    this.elemTrigger = this.elemParent.querySelector( this.settings.selectorTrigger );
    this.elemTarget = this.elemParent.querySelector( this.settings.selectorTarget );
    this.callbackForBefore = null;
    this.callbackForAfter = null;
    this.callbackForEnd = null;
    this.isChanged = false;
    this.evtRoot = new EM( this.elemRoot );
    this.evtTrigger = new EM( this.elemTrigger );
  }

  on( callbackForBefore, callbackForAfter, callbackForEnd ) {
    if ( this.elemParent === null ) {
      return this;
    }
    this.callbackForBefore = callbackForBefore;
    this.callbackForAfter = callbackForAfter;
    this.callbackForEnd = callbackForEnd;
    this.evtRoot.on( `click.${this.id}`, ( e ) => {
      this.handleForClick( e );
    } );
    this.evtRoot.on( `transitionend.${this.id}`, ( e ) => {
      this.handleForTransitionend( e );
    } );
    return this;
  }

  off() {
    this.elemParent = null;
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callbackForBefore = null;
    this.callbackForAfter = null;
    this.evtRoot.off( `click.${this.id}` );
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
    return false;
  }

  handleForTransitionend( e ) {
    if ( this.elemTarget.isEqualNode( e.target ) ) {
      if ( typeof this.callbackForEnd === 'function' ) {
        this.callbackForEnd.call( this, e, this );
      }
    }
    return false;
  }

  before( e ) {
    this.isChanged = true;
    this.callbackForBefore.call( this, e, this );
  }

  after( e ) {
    this.isChanged = false;
    this.callbackForAfter.call( this, e, this );
  }
}
