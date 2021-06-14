/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import merge from 'lodash/mergeWith';
import EM from './utilities/eventmanager';

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
    this.callBackForBefore = null;
    this.callBackForAfter = null;
    this.callBackForEnd = null;
    this.isChanged = false;
    this.evtRoot = new EM( this.elemRoot );
    this.evtTrigger = new EM( this.elemTrigger );
  }

  on( callBackForBefore, callBackForAfter, callBackForEnd ) {
    if ( this.elemParent === null ) {
      return this;
    }
    this.callBackForBefore = callBackForBefore;
    this.callBackForAfter = callBackForAfter;
    this.callBackForEnd = callBackForEnd;
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
    this.callBackForBefore = null;
    this.callBackForAfter = null;
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
