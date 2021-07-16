/*!
 * optimizedresize.js
 * Inspired by https://developer.mozilla.org
 */

import '../../_vendor/raf';
import merge from 'lodash/mergeWith';
import EM from '../utilities/eventmanager';

let
  uniqueNumber = 0
;
export default class OptimizedResize {

  constructor( options ) {
    this.defaultSettings = {
      name  : 'optimizedresize',
      delay : 16,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.callbacks = {};
    this.isRunning = false;
    this.eventName = `resize.${this.id}`;
    this.evtRoot = new EM( window );
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

  on( callback, query, name ) {
    return this.add( callback, {
      name  : name,
      query : query,
      one   : false,
      turn  : false,
      cross : false,
    } );
  }

  one( callback, query, name ) {
    return this.add( callback, {
      name  : name,
      query : query,
      one   : true,
      turn  : false,
      cross : false,
    } );
  }

  turn( callback, query, name ) {
    return this.add( callback, {
      name  : name,
      query : query,
      one   : false,
      turn  : true,
      cross : false,
    } );
  }

  cross( callback, query, name ) {
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
      this.evtRoot.on( this.eventName, ( e ) => this.handleForSetup( e ) );
    }
  }

  destroy() {
    this.evtRoot.off( this.eventName );
  }

  handleForSetup() {
    this.run();
  }

  run() {
    if ( !this.isRunning ) {
      this.isRunning = true;
      requestAnimationFrame( () => {
        this.runCallbacksAll();
      } );
    }
    return this;
  }

}

function _getUniqueName( base ) {
  return base + new Date().getTime() + uniqueNumber++;
}
