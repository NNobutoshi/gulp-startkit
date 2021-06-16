import merge from 'lodash/mergeWith';
import './polyfills/closest';
import EM from './utilities/eventmanager';

export default class Tab {

  constructor( options ) {
    this.defaultSettings = {
      name            : 'tab',
      selectorTrigger : '',
      selectorTarget  : '',
      selectorWrapper : '',
      className       : 'js-selected',
      defaultIndex    : 0,
      onLoad          : null,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.selectorWrapper = this.settings.selectorWrapper;
    this.selectorTrigger = this.settings.selectorTrigger;
    this.selectorTarget = this.settings.selectorTarget;
    this.elemTriggerAll = document.querySelectorAll( this.selectorTrigger );
    this.elemWrapperAll = document.querySelectorAll( this.selectorWrapper );
    this.selectedTrigger = null;
    this.selectedWrapper = null;
    this.selectedTarget  = null;
    this.callbackforLoad = this.settings.onLoad;
    this.hash = null;
    this.windowEventName = `DOMContentLoaded.${this.id} hashchange.${this.id}`;
    this.triggerEventName = `click.${this.id}`;
    this.evtTrigger = new EM( this.elemTriggerAll );
    this.evtWindow = new EM( window );
  }

  on() {
    this.evtWindow.on( this.windowEventName, () => {
      this.handleForWindowEvent();
    } );
    this.evtTrigger.on( this.triggerEventName, ( e ) => {
      this.handleForTriggerEvent( e );
    } );
  }

  off() {
    this.evtWindow.off( this.windowEventName );
    this.evtTrigger.off( this.triggerEventName );
  }

  handleForWindowEvent() {
    this.hash = location.hash || null;
    this.runAll();
    if ( typeof this.callbackforLoad === 'function' ) {
      this.callbackforLoad.call( this, {
        trigger : this.selectedTrigger,
        wrapper : this.selectedWrapper,
        target  : this.selectedTarget,
      } );
    }
  }

  handleForTriggerEvent( e ) {
    this.hash = e.currentTarget.hash;
    e.preventDefault();
    history.pushState( null, null, location.pathname + this.hash );
    this.run( e );
  }

  run( e, index ) {
    const
      indexNumber = ( typeof index === 'number' ) ? index : 0
      ,triggerElem = e.currentTarget
      ,wrapperElem = triggerElem.closest( this.selectorWrapper )
      ,elemTriggerAll = wrapperElem.querySelectorAll( this.selectorTrigger )
      ,elemTargetAll = wrapperElem.querySelectorAll( this.selectorTarget )
      ,elemTarget = wrapperElem.querySelector( this.hash )
    ;
    this.display( {
      elements    : elemTriggerAll,
      elemTarget  : elemTarget,
      key         : 'hash',
      indexNumber : indexNumber,
    } );
    this.display( {
      elements    : elemTargetAll,
      elemTarget  : elemTarget,
      key         : 'id',
      indexNumber : indexNumber,
    } );
  }

  runAll( index ) {
    const
      indexNumber = ( typeof index === 'number' ) ? index : 0
    ;
    Array.prototype.forEach.call( this.elemWrapperAll, ( wrapper ) => {
      const
        elemTargetAll = wrapper.querySelectorAll( this.selectorTarget )
        ,elemTriggerAll = wrapper.querySelectorAll( this.selectorTrigger )
        ,elemTarget = wrapper.querySelector( this.hash )
      ;
      this.display( {
        elements    : elemTriggerAll,
        elemTarget  : elemTarget,
        key         : 'hash',
        indexNumber : indexNumber,
      } );
      this.display( {
        elements    : elemTargetAll,
        elemTarget  : elemTarget,
        key         : 'id',
        indexNumber : indexNumber,
      } );
    } );
    return this;
  }

  display( arg ) {
    const
      key = arg.key
    ;
    Array.prototype.forEach.call( arg.elements, ( elem, i ) => {
      if ( arg.elemTarget === null ) {
        if ( i === arg.indexNumber ) {
          elem.classList.add( this.settings.className );
        } else {
          elem.classList.remove( this.settings.className );
        }
      } else {
        if ( this.hash === ( ( key === 'id' ) ? '#' + elem[ key ] : elem [ key ] ) ) {
          if ( key === 'hash' ) {
            this.selectedTrigger = elem;
            this.selectedTarget = arg.elemTarget;
            this.selectedWrapper = arg.elemTarget.closest( this.selectorWrapper );
          }
          elem.classList.add( this.settings.className );
        } else {
          elem.classList.remove( this.settings.className );
        }
      }
    } );
    return this;
  }

}
