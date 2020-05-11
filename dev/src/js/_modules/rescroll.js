/*!
 * rescroll.js
 */

// import $ from 'jquery';
import merge from 'lodash/mergeWith';
import offset from './utilities/offset.js';
import '../_vendor/rAf.js';

const
  $ = window.jQuery
  ,$w = $( window )
;

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
    this.eventName = `load.${this.id} hashchange.${this.id}`;
    this.permit = true;
    this.locked = false;
  }

  on() {
    $w.on( `scroll.${this.id}`, () => {
      this.run();
    } );
    $w.on( `hashchange.${this.id}`, () => {
      this.permit = true;
    } );
    $( 'html' ).on( `click.${this.id}`, 'a', () => {
      this.permit = true;
    } );
  }

  run() {
    const
      settings = this.settings
      ,hash = location.hash
      ,that = this
    ;
    let
      startTime = null
    ;
    if ( !hash || this.permit === false || this.locked === true ) {
      return this;
    }
    this.hash = hash.replace( /^#(.*)/, '#$1' );
    ( function _try() {
      that.permit = false;
      requestAnimationFrame( ( timeStamp ) => {
        startTime = ( startTime === null ) ? timeStamp : startTime;
        if ( timeStamp - startTime < settings.delay ) {
          _try();
        } else {
          window.scrollTo( 0, window.pageYoffset );
          that.scroll();
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
    botoms = []
  ;
  Array.prototype.forEach.call( elems, ( self ) => {
    botoms.push( self.getBoundingClientRect().bottom );
  } );
  return Math.max.apply( null, botoms );
}
