/*!
 * optimizedresize.js
 * Inspired by https://developer.mozilla.org
 */

// import $ from 'jquery';
import '../_vendor/rAf.js';
const
  $ = window.jQuery
;
let
  counter = 0
;
export default class OptimizedResize {

  constructor( options ) {
    this.defaultSettings = {
      name  : 'optimizedresize',
      delay : 16,
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.callBacks = {};
    this.isRunning = false;
    this.eventName = `resize.${this.id}`;
  }

  runCallBacksAll() {
    Object.keys( this.callBacks ).forEach( ( key ) => {
      const
        props = this.callBacks[ key ]
      ;
      let
        query = false
      ;
      if ( props.query ) {
        query = matchMedia( props.query ).matches;
        if (
          query === true && (
            ( props.turn === true && props.lastQuery !== query ) ||
            ( props.one === true ) ||
            ( !props.one && !props.turn && !props.cross )
          ) ||
          (
            ( query === true && props.lastQuery === false ) ||
            ( query === false && props.lastQuery === true )
          )
        ) {
          props.callBack.call( this, props );
        }
        props.lastQuery = query;
        if ( props.one === true && query === true ) {
          this.remove( key );
        }
      } else {
        props.callBack.call( this, props );
      }

    } );
    this.isRunning = false;
    return this;
  }

  add( callBack, options ) {
    const
      defaultSettings = {
        name   : _getUniqueName( this.id ),
        query  : '',
        one    : false,
        turn   : false,
      }
      ,settings = $.extend( {}, defaultSettings, options )
    ;
    settings.callBack = callBack;
    this.setUp();
    this.callBacks[ settings.name ] = settings;
    return this;
  }

  remove( name ) {
    delete this.callBacks[ name ];
  }

  off( name ) {
    this.remove( name );
  }

  on( callBack, query, name ) {
    return this.add( callBack, {
      name  : name,
      query : query,
      one   : false,
      turn  : false,
      cross : false,
    } );
  }

  one( callBack, query, name ) {
    return this.add( callBack, {
      name  : name,
      query : query,
      one   : true,
      turn  : false,
      cross : false,
    } );
  }

  turn( callBack, query, name ) {
    return this.add( callBack, {
      name  : name,
      query : query,
      one   : false,
      turn  : true,
      cross : false,
    } );
  }

  cross( callBack, query, name ) {
    return this.add( callBack, {
      name  : name,
      query : query,
      one   : false,
      turn  : false,
      cross : true,
    } );
  }

  setUp() {
    if ( !Object.keys( this.callBacks ).length ) {
      $( window ).on( this.eventName, () => {
        this.run();
      } );
    }
  }

  run() {
    if ( !this.isRunning ) {
      this.isRunning = true;
      requestAnimationFrame( () => {
        this.runCallBacksAll();
      } );
    }
    return this;
  }

}

function _getUniqueName( base ) {
  return base + new Date().getTime() + counter++;
}
