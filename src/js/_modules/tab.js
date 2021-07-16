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
    this.callbackForLoad = this.settings.onLoad;
    this.hash = null;
    this.eventNameLoad = `DOMContentLoaded.${this.id} load.${this.id} hashchange.${this.id}`;
    this.eventNameClick = `click.${this.id}`;
    this.evtWindow = new EM( window );
  }

  on() {
    this.evtWindow
      .on( this.eventNameLoad, ( e ) => this.handleForLoad( e ) )
      .on( this.eventNameClick, ( e ) => this.handleForClick( e ) )
    ;
  }

  off() {
    this.evtWindow.off( `.${this.id}` );
  }

  handleForLoad( e ) {
    this.runAll( e );
  }

  handleForClick( e ) {
    const hash = e.target && e.target.hash && this.getHash( e.target.hash );
    let elemCurrentTrigger = null;
    if ( !hash ) {
      return;
    }
    for ( let elem of this.elemTriggerAll ) {
      if ( hash === this.getHash( elem.hash ) ) {
        elemCurrentTrigger = elem;
      }
    }
    if ( elemCurrentTrigger === null ) {
      return;
    }
    e.preventDefault();
    this.run( elemCurrentTrigger );
  }

  run( elemCurrentTrigger ) {
    const
      elemTrigger = elemCurrentTrigger
      ,elemTarget = document.querySelector( this.getHash( elemTrigger.hash ) )
      ,elemWrapper = elemTarget.closest( this.selectorWrapper )
      ,elemTriggerAll = elemWrapper.querySelectorAll( this.selectorTrigger )
      ,elemTargetAll = elemWrapper.querySelectorAll( this.selectorTarget )
    ;
    for ( let elem of elemTriggerAll ) {
      if ( elem === elemCurrentTrigger ) {
        elem.classList.add( this.settings.className );
      } else {
        elem.classList.remove( this.settings.className );
      }
    }
    for ( let elem of elemTargetAll ) {
      if ( elem === elemTarget ) {
        elem.classList.add( this.settings.className );
      } else {
        elem.classList.remove( this.settings.className );
      }
    }
  }

  runAll( e ) {
    const
      hash = location.hash
      ,that = this
    ;
    let selectedWrapperByHash = null;
    for ( let elemWrapper of this.elemWrapperAll ) {
      const elemTriggerAll = elemWrapper.querySelectorAll( that.selectorTrigger );
      let elemTrigger, elemActived;

      for ( let elem of elemTriggerAll ) {
        if ( elem.hash === hash ) {
          elemTrigger = elem;
          selectedWrapperByHash = elemWrapper;
        }
        if ( elem.classList.contains( that.settings.className ) ) {
          elemActived = elem;
        }
      }

      if ( !elemTriggerAll.length ) {
        return true;
      }
      if ( elemTrigger || !elemActived ) {
        that.run( elemTrigger || elemTriggerAll[ 0 ] );
      }

    }
    if ( typeof this.callbackForLoad === 'function' ) {
      this.callbackForLoad.call( null, selectedWrapperByHash, e );
    }
    return this;
  }

  getHash( string ) {
    if ( string ) {
      return string.replace( /^#?(.*)/, '#$1' );
    } else {
      return window.location.hash.replace( /^#?(.*)/, '#$1' );
    }
  }
}
