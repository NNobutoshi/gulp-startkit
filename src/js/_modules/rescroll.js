/*!
 * rescroll.js
 */

import merge from 'lodash/mergeWith';
import offset from './utilities/offset';
import '../_vendor/rAf';
import EM from './utilities/eventmanager';

export default class Rescroll {

  constructor( options ) {
    this.defaultSettings = {
      name      : 'rescroll',
      offsetTop : 0,
      delay     : 32,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.timeoutId = null;
    this.hash = '';
    this.eneble = true;
    this.locked = true;
    this.scrollCounter = 0;
    this.lastCounter = null;
    this.evtRoot = new EM( window );
  }

  on() {
    this.evtRoot.on( `DOMContentLoaded.${this.id} hashchange.${this.id}`,() => {
      this.handleForHashChange();
    } );
    this.evtRoot.on( `scroll.${this.id}`, () => {
      this.handleForScroll();
    } );
    this.evtRoot.on( `click.${this.id}`, ( e ) => {
      this.handleForClick( e );
    } );
  }

  off() {
    this.evtRoot.off( `.${this.id}` );
    this.lastCounter = null;
    this.scrollCounter = 0;
    this.lock();
  }

  handleForScroll() {
    const that = this;
    setTimeout( () => {
      that.run();
    }, 16 );
  }

  handleForHashChange() {
    this.unlock();
  }

  handleForClick( e ) {
    if ( e.target.tagName.toLowerCase() === 'a' && e.target.hash ) {
      this.unlock();
    }
  }

  run() {
    const
      hash = location.hash
      ,that = this
    ;
    if ( !hash || this.locked === true ) {
      return this;
    }
    this.scrollCounter++;
    this.hash = hash.replace( /^#(.*)/, '#$1' );
    ( function _try() {
      that.eneble = false;
      that.timeoutId = requestAnimationFrame( () => {
        if ( that.scrollCounter !== that.lastCounter ) {
          _try();
          that.lastCounter = that.scrollCounter;
        } else {
          that.lastCounter = null;
          that.scrollCounter = 0;
          that.scroll();
          that.lock();
        }
      } );
    } )();
    return this;
  }

  scroll( target ) {
    let
      offsetTop = 0
      ,targetElem
    ;
    if ( !target && !this.hash ) {
      return this;
    }
    targetElem = ( target ) ? target : document.querySelector( this.hash );
    if ( targetElem === null ) {
      return this;
    }
    cancelAnimationFrame( this.timeoutId );
    if ( typeof this.offsetTop === 'number' ) {
      offsetTop = this.offsetTop;
    } else if ( typeof this.offsetTop === 'string' ) {
      offsetTop = _getTotalHeight( document.querySelectorAll( this.offsetTop ) );
    } else if ( typeof this.offsetTop === 'function' ) {
      offsetTop = this.offsetTop.call( this, targetElem );
    }
    window.scrollTo( 0, offset( targetElem ).top - offsetTop );
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }
}

function _getTotalHeight( elems ) {
  let
    bottoms = []
  ;
  Array.prototype.forEach.call( elems, ( self ) => {
    bottoms.push( self.getBoundingClientRect().bottom );
  } );
  return Math.max.apply( null, bottoms );
}
