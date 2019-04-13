/*!
 * rescroll.js
 */

import $ from 'jquery';

const
  $w = $( window )
;

export default class Rescroll {

  constructor( options ) {
    this.defaultSettings = {
      name : 'rescroll',
      offsetTop: 0,
      delay: 300,
    };
    this.eventName = `load.${this.id} hashchange.${this.id}`;
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.timeoutId = null;
    this.flag = true;
    this.hash = '';
  }

  on() {
    $w.on( this.eventName, () => {
      this.run();
    } );
  }

  run() {
    const
      settings = this.settings
      ,hash = window.location.hash
      ,that = this
    ;
    let
      start = null
    ;
    clearTimeout( this.timeoutId );
    if ( !hash ) {
      return this;
    }
    this.hash = '#' + hash.replace( /^#/, '' );
    $w.scrollTop( $w.scrollTop() );
    this.timeoutId = requestAnimationFrame( _timer );

    function _timer( timestamp ) {
      let
        progress
      ;
      if ( !start ) {
        start = timestamp;
      }
      progress = timestamp - start;
      if ( progress < settings.delay ) {
        that.timeoutId = requestAnimationFrame( _timer );
      } else {
        that.scroll();
      }
    }

  }

  scroll() {
    const
      $target = $( this.hash )
    ;
    let
      offsetTop
    ;
    if ( !$target.length ) {
      return this;
    }
    cancelAnimationFrame( this.timeoutId );
    if ( typeof this.offsetTop === 'number' ) {
      offsetTop = this.offsetTop;
    } else if ( typeof this.offsetTop === 'string' ) {
      offsetTop = _getTotalHeight( document.querySelectorAll( this.offsetTop ) );
    }
    console.info( offsetTop );
    $w.scrollTop( $target.offset().top - offsetTop );
  }

}

function _getTotalHeight( elem ) {
  let
    total = 0
  ;
  Array.prototype.forEach.call( elem, ( self ) => {
    total = total + $( self ).outerHeight( true );
  } );
  return total;
}
