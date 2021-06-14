import merge from 'lodash/mergeWith';
import closest from './utilities/closest';
import EM from './utilities/eventmanager';

export default class Tab {

  constructor( options ) {
    this.defaultSettings = {
      name         : 'tab',
      trigger      : '',
      target       : '',
      wrapper      : '',
      className    : 'js-selected',
      defaultIndex : 0,
      onLoad       : null,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.wrapperSelector = this.settings.wrapper;
    this.triggerSelector = this.settings.trigger;
    this.targetSelector = this.settings.target;
    this.elemTriggerAll = document.querySelectorAll( this.triggerSelector );
    this.elemWrapperAll = document.querySelectorAll( this.wrapperSelector );
    this.selectedTrigger = null;
    this.selectedWrapper = null;
    this.selectedTarget  = null;
    this.callBackforLoad = this.settings.onLoad;
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
    if ( typeof this.callBackforLoad === 'function' ) {
      this.callBackforLoad.call( this, {
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
      ,wrapperElem = closest( triggerElem, this.wrapperSelector )
      ,elemTriggerAll = wrapperElem.querySelectorAll( this.triggerSelector )
      ,targetElemAll = wrapperElem.querySelectorAll( this.targetSelector )
      ,targetElem = wrapperElem.querySelector( this.hash )
    ;
    this.display( {
      elements    : elemTriggerAll,
      targetElem  : targetElem,
      key         : 'hash',
      indexNumber : indexNumber,
    } );
    this.display( {
      elements    : targetElemAll,
      targetElem  : targetElem,
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
        targetElemAll = wrapper.querySelectorAll( this.targetSelector )
        ,elemTriggerAll = wrapper.querySelectorAll( this.triggerSelector )
        ,targetElem = wrapper.querySelector( this.hash )
      ;
      this.display( {
        elements    : elemTriggerAll,
        targetElem  : targetElem,
        key         : 'hash',
        indexNumber : indexNumber,
      } );
      this.display( {
        elements    : targetElemAll,
        targetElem  : targetElem,
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
      if ( arg.targetElem === null ) {
        if ( i === arg.indexNumber ) {
          elem.classList.add( this.settings.className );
        } else {
          elem.classList.remove( this.settings.className );
        }
      } else {
        if ( this.hash === ( ( key === 'id' ) ? '#' + elem[ key ] : elem [ key ] ) ) {
          if ( key === 'hash' ) {
            this.selectedTrigger = elem;
            this.selectedTarget = arg.targetElem;
            this.selectedWrapper = closest( arg.targetElem, this.wrapperSelector );
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
