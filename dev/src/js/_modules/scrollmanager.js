'use strict';

import $ from '../_vendor/jquery-3.2.1.js';

const
  $root = $( window )
;

let
  counter = 0
;

export default class ScrollManager {

  constructor( options ) {
    this.defaultSettings = {
      name   : 'scrollManager',
      offset : 0,
      delay  : 66,
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.callBacks = {};
    this.isRunning = false;
    this.id = this.settings.name;
    this.eventName = `scroll.${this.id}`;
  }

  runCallBacksAll() {
    let
      scTop = $root.scrollTop()
      ,offset = 0
      ,scBottom = scTop + window.innerHeight
    ;
    if ( typeof this.offset === 'number' ) {
      offset = this.offset;
    } else if ( typeof this.offset === 'string') {
      offset = _getTotalHeight( document.querySelectorAll( this.offset ) );
    }
    scTop = scTop + offset;
    Object.keys( this.callBacks ).forEach( ( key ) => {
      const
        props = this.callBacks[ key ]
      ;
      return props.callBack.call( this, props, scTop, scBottom );
    } );
    this.isRunning = false;
    return this;
  }

  add( callBack, options ) {
    const
      defaultSttings = {
        name : _getUniqueName( this.id ),
        flag : false,
      }
      ,settings = $.extend( {}, defaultSttings, options )
    ;
    settings.callBack = callBack;
    this.setUp();
    this.callBacks[ settings.name ] = settings;
    return this;
  }

  remove( name ) {
    delete this.callBacks[ name ];
  }

  on( callBack, options ) {
    return this.add( callBack, options );
  }

  setUp() {
    if ( !this.callBacks.length ) {
      $root.on( this.eventName, () => {
        this.run();
      } );
    }
  }

  run() {
    if ( !this.isRunning ) {
      this.isRunning = true;
      if ( requestAnimationFrame ) {
        requestAnimationFrame( () => { this.runCallBacksAll(); } );
      } else {
        setTimeout( () => { this.runCallBacksAll(); }, this.settintgs.delay );
      }
    }
    return this;
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

function _getUniqueName( base ) {
  return base + new Date().getTime()+ counter++;
}