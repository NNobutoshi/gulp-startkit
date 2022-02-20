import TransitionToggle from './libs/transitiontoggle.js';
import merge from 'lodash/mergeWith.js';
import EM from './libs/eventmanager.js';

const d = document;

export default class Accordion {
  constructor( options ) {
    const
      defaultSettings = this.defaultSettings = {
        name              : 'accordion',
        selectorParent    : '',
        selectorTrigger   : '',
        selectorTarget    : '',
        selectorCloser    : '',
        selectorOpener    : '',
        selectorEventRoot : 'body',
        elemParentAll     : null,
        elemEventRoot     : null,
        eventNameStart    : 'touchend.{name} click.{name}',
        eventNameFinish   : 'transitionend.{name}',
        toggleHeihgt      : true,
        otherClosing      : false,
        propertyTargetTransition : 'height',
      }
      ,settings = this.settings = merge( {}, defaultSettings, options )
    ;

    this.id = settings.name;
    this.selectorParentAll = settings.selectorParent;
    this.selectorTrigger = settings.selectorTrigger;
    this.selectorTarget = settings.selectorTarget;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.selectorCloser = settings.selectorCloser;
    this.selectorOpener = settings.selectorOpener;
    this.elemParentAll = settings.elemParentAll || d.querySelectorAll( this.selectorParentAll );
    this.elemEventRoot = settings.elemEventRoot || d.querySelector( this.selectorEventRoot );
    this.eventRoot = null;
    this.eventNameStart = settings.eventNameStart.replaceAll( '{name}', this.id );
    this.eventNameFinish = settings.eventNameFinish.replaceAll( '{name}', this.id );
    this.toggles = [];
    this.setUp();
  }

  setUp() {
    Array.prototype.forEach.call( this.elemParentAll, ( elemParent, index ) => {
      const toggle = new TransitionToggle( {
        name            : this.id + index,
        elemParent      : elemParent,
        elemTrigger     : elemParent.querySelector( this.selectorTrigger ),
        elemTarget      : elemParent.querySelector( this.selectorTarget ),
        toggleHeight    : this.settings.toggleHeight,
        propertyTargetTransition: this.settings.propertyTargetTransition,
      } );
      this.toggles.push( toggle );
    } );
  }
  on( callbacks ) {
    this.eventRoot = new EM( this.elemEventRoot );
    this.callbackBefore = callbacks.before;
    this.callbackAfter = callbacks.after;
    this.callbackFinish = callbacks.finish;
    this.eventRoot
      .on( this.eventNameStart, this.selectorTrigger, this.handleStart.bind( this ) )
      .on( this.eventNameFinish, this.selectorTarget, this.handleFinish.bind( this ) )
    ;
    if ( this.selectorCloser ) {
      this.eventRoot.on(
        this.eventNameStart, this.selectorCloser, this.handleAllafter.bind( this )
      );
    }
    if ( this.selectorOpener ) {
      this.eventRoot.on(
        this.eventNameStart, this.selectorOpener, this.handleAllBefore.bind( this )
      );
    }
    this.toggles.forEach( ( toggle, index ) => {
      toggle.callbackBefore = this.callbackBefore.bind( toggle );
      toggle.callbackAfter = this.callbackAfter.bind( toggle );
      toggle.callbackFinish = this.callbackFinish.bind( toggle );
    } );

    return this;
  }

  handleStart( e, elemEventTarget ) {
    this.toggles.forEach( ( toggle )=> {
      if ( toggle.elemTrigger === elemEventTarget ) {
        toggle.handleStart( e );
        return false;
      } else if ( this.settings.otherClosing === true && toggle.isChanged === true ) {
        toggle.after( e );
      }
    } );
  }

  handleFinish( e, elemEventTarget ) {
    this.toggles.forEach( ( toggle ) => {
      if ( toggle.elemTarget === elemEventTarget ) {
        toggle.handleFinish( e );
        return false;
      }
    } );
  }

  handleAllafter() {
    this.toggles.forEach( ( toggle )=> {
      if ( toggle.isChanged === true ) {
        toggle.after();
      }
    } );
  }

  handleAllBefore() {
    this.toggles.forEach( ( toggle )=> {
      if ( toggle.isChanged === false ) {
        toggle.before();
      }
    } );
  }
}
