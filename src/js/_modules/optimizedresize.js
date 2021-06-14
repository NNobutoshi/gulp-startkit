/*!
 * optimizedresize.js
 * Inspired by https://developer.mozilla.org
 */

import '../_vendor/rAf.js';
import merge from 'lodash/mergeWith';
import EM from './utilities/eventmanager';

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
    this.callBacks = {};
    this.isRunning = false;
    this.eventName = `resize.${this.id}`;
    this.evtRoot = new EM( window );
  }

  runCallBacksAll() {
    for ( const key in this.callBacks ) {
      const
        props = this.callBacks[ key ]
      ;
      let
        query = false
      ;
      if ( !props.query ) {
        props.callBack.call( this, props );
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
        props.callBack.call( this, props );
      }
      props.lastQuery = query;
      if ( props.one === true && query === true ) {
        this.remove( key );
      }
    } // for loop

    this.isRunning = false;
    return this;
  }

  add( callBack, options ) {
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
      this.evtRoot.on( this.eventName, ( e ) => {
        this.handleForSetup( e );
      } );
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
        this.runCallBacksAll();
      } );
    }
    return this;
  }

}

function _getUniqueName( base ) {
  return base + new Date().getTime() + uniqueNumber++;
}
