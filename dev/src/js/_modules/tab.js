/*!
 * transitiontoggle.js
 * Copyright 2019 https://github.com/NNobutoshi/
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

import $ from 'jquery';

export default class Tab {

  constructor( options ) {
    this.defaultSettings = {
      name    : 'tab',
      trigger : '',
      target  : '',
      wrapper : '',
      className : 'js-selected',
      defaultIndex : 0,
      onLoad : null,
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.wrapperSelector = this.settings.wrapper;
    this.triggerSelector = this.settings.trigger;
    this.targetSelector = this.settings.target;
    this.triggerElemAll = document.querySelectorAll( this.triggerSelector );
    this.wrapperElemAll = document.querySelectorAll( this.wrapperSelector );
    this.selectedTrigger = null;
    this.selectedWrapper = null;
    this.selectedTarget  = null;
    this.callBackforLoad = ( typeof this.settings.onLoad === 'function' )? this.settings.onLoad: null;
    this.hash = '';
  }

  on() {
    const
      $w = $( window )
    ;
    $w.on( `load.${this.id} hashchange.${this.id}`, ( e ) => {
      this.hash = _getHash( window.location.hash );
      this.runAll( e );
      if ( this.callBackforLoad ) {
        this.callBackforLoad.call( this, {
          trigger : this.selectedTrigger,
          wrapper : this.selectedWrapper,
          target  : this.selectedTarget,
        } );
      }
    } );
    $( this.triggerElemAll ).on( `click.${this.id}`, ( e ) => {
      this.hash = _getHash( e.currentTarget.hash );
      e.preventDefault();
      window.history.pushState( null, null, window.location.pathname + this.hash );
      this.run( e );
    } );
  }

  run ( e, index ) {
    const
      indexNumber = ( typeof index === 'number' )? index: 0
      ,triggerElem = e.currentTarget
      ,wrapperElem = _closest( triggerElem, this.wrapperSelector )
      ,triggerElemAll = wrapperElem.querySelectorAll( this.triggerSelector )
      ,targetElemAll = wrapperElem.querySelectorAll( this.targetSelector )
      ,targetElem = wrapperElem.querySelector( this.hash )
    ;
    this.display( {
      elements    : triggerElemAll,
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

  runAll( e, index ) {
    const
      indexNumber = ( typeof index === 'number' )? index: 0
    ;
    Array.prototype.forEach.call( this.wrapperElemAll, ( wrapper ) => {
      const
        targetElemAll = wrapper.querySelectorAll( this.targetSelector )
        ,triggerElemAll = wrapper.querySelectorAll( this.triggerSelector )
        ,targetElem = wrapper.querySelector( this.hash )
      ;
      this.display( {
        elements    : triggerElemAll,
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
        if ( this.hash === _getHash( elem[ key ] ) ) {
          if ( key === 'hash' ) {
            this.selectedTrigger = elem;
            this.selectedTarget = arg.targetElem;
            this.selectedWrapper = _closest( arg.targetElem, this.wrapperSelector );
          }
          elem.classList.add( this.settings.className );
        } else {
          elem.classList.remove( this.settings.className );
        }
      }
    } );
  }

}

function _getHash( hash ) {
  return '#' + hash.replace( /^#/, '' );
}

function _closest( elem, wrapper ) {
  // let closest;
  // for ( closest = elem; closest; closest = closest.parentElement ) {
  //   if ( closest.matches( wrapper ) ) {
  //     break;
  //   }
  // }
  // return closest;
  return $( elem ).closest( wrapper ).get(0);
}
