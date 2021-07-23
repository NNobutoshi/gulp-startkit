/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import merge from 'lodash/mergeWith';
import EM from '../utilities/eventmanager';

const doc = document;

export default class Toggle {

  constructor( options ) {
    this.defaultSettings = {
      name              : 'transitiontoggle',
      selectorTrigger   : '',
      selectorTarget    : '',
      selectorParent    : '',
      selectorEventRoot : 'body',
    };

    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.selectorTrigger = this.settings.selectorTrigger;
    this.selectorTarget = this.settings.selectorTarget;
    this.selectorParent = this.settings.selectorParent;
    this.elemRoot = doc.querySelector( this.settings.selectorEventRoot );
    this.elemTrigger = doc.querySelector( this.selectorTrigger );
    this.elemTarget = doc.querySelector( this.selectorTarget );
    this.elemParent = this.selectorParent && doc.querySelector( this.selectorParent );
    this.elemParent = this.elemParent || this.elemTrigger.parentNode;
    this.callbackBefore = null;
    this.callbackAfter = null;
    this.callbackFinish = null;
    this.isChanged = false;
    this.eventNameStart = `click.${this.id}`;
    this.eventNameFinish = `transitionend.${this.id}`;
    this.evtRoot = new EM( this.elemRoot );
  }

  on( callbacks ) {
    this.callbackBefore = callbacks.before.bind( this );
    this.callbackAfter = callbacks.after.bind( this );
    this.callbackFinish = callbacks.finish.bind( this );
    this.evtRoot
      .on( this.eventNameStart, this.selectorTrigger, this.handleStart.bind( this ) )
      .on( this.eventNameFinish, this.selectorTarget, this.handleFinish.bind( this ) )
    ;
    return this;
  }

  off() {
    this.elemParent = null;
    this.elemTrigger = null;
    this.elemTarget = null;
    this.callbackBefore = null;
    this.callbackAfter = null;
    this.callbackFinish = null;
    this.evtRoot.off( '.' + this.id );
    return this;
  }

  handleStart( e ) {
    if ( this.isChanged === true ) {
      this.after( e );
    } else {
      this.before( e );
    }
    return false;
  }

  handleFinish( e ) {
    if ( typeof this.callbackFinish === 'function' ) {
      this.callbackFinish.call( this, e, this );
    }
    return false;
  }

  before( e ) {
    this.isChanged = true;
    this.callbackBefore.call( this, e, this );
  }

  after( e ) {
    this.isChanged = false;
    this.callbackAfter.call( this, e, this );
  }

}
