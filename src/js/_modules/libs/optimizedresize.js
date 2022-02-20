/*!
 * optimizedresize.js
 * Inspired by https://developer.mozilla.org
 */

import '../../_vendor/raf.js';
import merge from 'lodash/mergeWith.js';
import EM from '../libs/eventmanager.js';

const d = document;
let uniqueNumber = 0;

export default class OptimizedResize {

  constructor( options ) {
    const
      defaultSettings = this.defaultSettings = {
        name              : 'optimizedresize',
        selectorEventRoot : '',
        elemEventRoot     : window,
        eventName         : 'resize.{name}',
        delayTime         : 10,
      },
      settings = this.settings = merge( {}, defaultSettings, options )
    ;
    this.id = settings.name;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemEventRoot = settings.elemEventRoot || d.querySelector( this.selectorEventRoot );
    this.callbacks = {};
    this.isRunning = false;
    this.eventName = settings.eventName.replaceAll( '{name}', this.id );
    this.eventRoot = null;
  }

  runCallbacksAll() {
    for ( const key in this.callbacks ) {
      const
        props = this.callbacks[ key ]
      ;
      let
        query = false
      ;
      if ( !props.query ) {
        props.callback.call( this, props );
        props.lastQuery = query;
        continue;
      }
      query = window.matchMedia( props.query ).matches;

      if (
        // turn
        ( props.turn === true && query === true && props.lastQuery !== query ) ||
        // one
        ( props.one === true && query === true ) ||
        // cross
        ( props.cross === true &&
          (
            ( query === true && props.lastQuery === false ) ||
            ( query === false && props.lastQuery === true )
          )
        ) ||
        // on
        ( query === true &&
          ( !props.one && !props.turn && !props.cross )
        )
      ) {
        props.callback.call( this, props );
      }
      props.lastQuery = query;
      if ( props.one === true && query === true ) {
        this.remove( key );
      }
    } // for loop

    this.isRunning = false;
    return this;
  }

  add( callback, options ) {
    const
      settings = merge(
        {},
        { // default
          name   : _getUniqueName( this.id ),
          query  : '',
          one    : false,
          turn   : false,
          cross  : false,
        },
        options,
      )
    ;
    settings.callback = callback;
    this.setUp();
    this.callbacks[ settings.name ] = settings;
    return this;
  }

  remove( name ) {
    delete this.callbacks[ name ];
  }

  off( name ) {
    this.remove( name );
  }

  on( query, callback, name ) {
    if ( typeof query === 'function' ) {
      [ callback, name, query ] = [ query , callback, '' ];
    }
    return this.add( callback, {
      name  : name,
      query : query,
      one   : false,
      turn  : false,
      cross : false,
    } );
  }

  one( query, callback, name ) {
    return this.add( callback, {
      name  : name,
      query : query,
      one   : true,
      turn  : false,
      cross : false,
    } );
  }

  turn( query, callback, name ) {
    return this.add( callback, {
      name  : name,
      query : query,
      one   : false,
      turn  : true,
      cross : false,
    } );
  }

  cross( query, callback, name ) {
    return this.add( callback, {
      name  : name,
      query : query,
      one   : false,
      turn  : false,
      cross : true,
    } );
  }

  setUp() {
    if ( !Object.keys( this.callbacks ).length ) {
      this.eventRoot = new EM( this.elemEventRoot );
      this.eventRoot.on( this.eventName, ( e ) => this.handleSetup( e ) );
    }
  }

  destroy() {
    this.evtRoot.off( this.eventName );
  }

  handleSetup() {
    this.run();
  }

  run() {
    const
      delayTime = this.settings.delayTime
      ,func = this.runCallbacksAll.bind( this )
    ;
    let startTime = null;
    if ( this.isRunning === true ) {
      return this;
    }
    this.isRunning = true;
    if ( typeof delayTime === 'number' && delayTime > 0 ) {
      requestAnimationFrame( _throttle );
    } else {
      requestAnimationFrame( func );
    }

    return this;

    function _throttle( timeStamp ) {
      if ( startTime === null ) {
        startTime = timeStamp;
      }
      if ( timeStamp - startTime >= delayTime ) {
        func();
      } else {
        requestAnimationFrame( _throttle );
      }
    }

  }

}

function _getUniqueName( base ) {
  return base + new Date().getTime() + uniqueNumber++;
}
