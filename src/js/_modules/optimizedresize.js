'use strict';

import $ from '../_vendor/jquery-3.2.1.js';
require('../_vendor/modernizr.js');

let
  counter = 0
;
/* globals Modernizr */
export default class optimizedResize {
  constructor( options ) {
    this.defaultSettings = {
      name : 'optimizedresize'
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.callBacks = {};
    this.isRunning = false;
    this.thisName = this.settings.name;
    this.queries = {};
  }

  resize() {
    if (!this.isRunning) {
      this.isRunning = true;
      if ( requestAnimationFrame ) {
        requestAnimationFrame( () => { this.runCallBacks(); } );
      } else {
        setTimeout( () => { this.runCallBacks(); }, 66 );
      }
    }
  }

  runCallBacks() {
    Object.keys( this.callBacks ).forEach( ( key ) => {
      const
        items = this.callBacks[ key ]
      ;
      let
        query
      ;
      if ( items.query ) {
        query = Modernizr.mq( items.query );
        if ( items.turn === true ) {
          if ( items.lastQuery !== query && query === true ) {
            items.callBack();
          }
        } else {
          if ( query === true ) {
            items.callBack();
          }
        }
        items.lastQuery = query;
        if( items.one === true ) {
          delete this.callBacks[ key ];
        }
      } else {
        items.callBack();
      }
    } );
    this.isRunning = false;
  }

  addCallBack( options ) {
    if( options ) {
      this.callBacks[ options.name ] = options;
    }
  }

  on( callBack, options ) {
    const
      defaults = {
        name     : ( typeof options === 'string' ) ? options : _getId( this.thisName ),
        query    : '',
        one      : false,
        turn     : false,
        callBack : callBack,
      }
    ;
    let
      settings
    ;
    if( typeof options === 'string' ) {
      options = {};
    }
    settings = $.extend( {}, defaults, options );
    this.handle();
    this.addCallBack( settings );
  }

  one( callBack, query, name ) {
    this.on( callBack, {
      name  : ( name )? name : _getId( this.thisName ),
      query : query,
      one   : true,
      turn  : false,
    } );
  }

  turn( callBack, query, name ) {
    this.on( callBack, {
      name  : ( name )? name : _getId( this.thisName ),
      query : query,
      one   : false,
      turn  : true,
    } );
  }

  handle() {
    if ( !Object.keys( this.callBacks ).length ) {
      $( window ).on( 'resize.' + this.thisName, () => {
        this.resize();
      } );
    }
  }

}

function _getId( base ) {
  return base + new Date().getTime()+ counter++;
}
