/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import merge from 'lodash/mergeWith';
import EM from '../libs/eventmanager';

const d = document;

export default class TtransitionToggle {

  constructor( options ) {
    const
      defaultSettings = this.defaultSettings = {
        name              :  'transitiontoggle',
        selectorParent    : '',
        selectorTrigger   : '',
        selectorTarget    : '',
        selectorEventRoot : 'body',
        elemTrigger       : null,
        elemTarget        : null,
        elemParent        : null,
        elemEventRoot     : null,
        eventNameStart    : 'touchend.{name} click.{name}',
        eventNameFinish   : 'transitionend.{name}',
        toggleHeight      : false,
        propertyTargetTransition : '',
      }
      ,settings = this.settings = merge( {}, defaultSettings, options )
    ;
    this.id = settings.name;
    this.selectorParent = settings.selectorParent;
    this.selectorTrigger = settings.selectorTrigger;
    this.selectorTarget = settings.selectorTarget;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemTrigger = settings.elemTrigger || d.querySelector( this.selectorTrigger );
    this.elemParent = settings.elemParent ||
                      this.selectorParent && d.querySelector( this.selectorParent ) ||
                      this.elemTrigger.parentNode
    ;
    this.elemTarget = settings.elemTarget || this.elemParent.querySelector( this.selectorTarget );
    this.elemEventRoot = settings.elemEventRoot || d.querySelector( this.selectorEventRoot );

    this.callbackSetUp = null;
    this.callbackBefore = null;
    this.callbackAfter = null;
    this.callbackFinish = null;
    this.eventRoot = null;
    this.isChanged = false;
    this.isWorking = false;
    this.eventNameStart = settings.eventNameStart.replaceAll( '{name}', this.id );
    this.eventNameFinish = settings.eventNameFinish.replaceAll( '{name}', this.id );
  }

  on( callbacks ) {
    this.eventRoot = new EM( this.elemEvtRoot );
    this.callbackBefore = callbacks.before.bind( this );
    this.callbackAfter = callbacks.after.bind( this );
    this.callbackFinish = callbacks.finish.bind( this );
    this.eventRoot
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
    this.eventRoot.off( '.' + this.id );
    return this;
  }

  handleStart( e ) {
    if ( this.isWorking === true ) {
      return true;
    }
    this.isWorking = true;
    if ( this.isChanged === true ) {
      this.after( e );
    } else {
      this.before( e );
    }
  }

  handleFinish( e ) {
    const targetProperty = this.settings.propertyTargetTransition;
    if ( targetProperty && e.propertyName && targetProperty !== e.propertyName ) {
      return;
    }
    this.isWorking = false;
    this.callbackFinish.call( this, e, this );
  }

  before( e ) {
    const
      that = this
      ,styleDefaultTransition = window.getComputedStyle( this.elemTarget ).transition
      ,style = this.elemTarget.style
    ;
    let
      height
      ,startTime = null
    ;
    if ( this.settings.toggleHeight === true ) {
      style.transitionProperty = 'none';
      style.display = 'block';
      style.height = 'auto';
      height = this.elemTarget.getBoundingClientRect().height;
      style.height = 0;

      requestAnimationFrame( _setHeight );

      function _setHeight( timeStamp ) {
        if ( startTime === null ) {
          startTime = timeStamp;
        }
        if ( timeStamp - startTime > 100 ) {
          style.transition = styleDefaultTransition;
          style.height = height + 'px';
          that.callbackBefore.call( this, e, this );
        } else {
          requestAnimationFrame( _setHeight );
        }
      }
    } else {
      this.callbackBefore.call( this, e, this );
    }
    this.isChanged = true;
  }

  after( e ) {
    if ( this.settings.toggleHeight === true ) {
      this.elemTarget.style.height = 0;
    }
    this.isChanged = false;
    this.callbackAfter.call( this, e, this );
  }

}
