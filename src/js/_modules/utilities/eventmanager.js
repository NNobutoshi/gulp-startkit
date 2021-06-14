export default class EventManager {

  constructor( elemEvent ) {
    this.listeners = {};
    this.elemEvent = elemEvent || document;
  }

  on( strEventName, callBack, options ) {
    this.setEventListener( 'add', strEventName, callBack, options );
  }

  off( strEventName, callBack ) {
    this.setEventListener( 'remove', strEventName, callBack );
  }

  setEventListener( prefix, strEventName, callBack, options ) {
    const that = this;
    const arryEventNames = strEventName.split( ' ' );
    for ( let i = 0, len = arryEventNames.length; i < len; i++ ) {
      const
        strEventName = arryEventNames[ i ]
        ,spritedNames = strEventName.split( '.' )
        ,eventName = spritedNames[ 0 ]
        ,nameSpace = spritedNames[ 1 ]
      ;

      if ( prefix === 'add' && eventName ) {
        if ( !this.listeners[ strEventName ] ) {
          this.listeners[ strEventName ] = [];
        }
        this.listeners[ strEventName ].push( callBack );
        this.eventListener( prefix, eventName, callBack, options );
      }

      if ( prefix === 'remove' ) {
        let listeners = {};
        if ( eventName && nameSpace ) {
          listeners = _createListeners( key => key === strEventName );
        } else if ( eventName ) {
          listeners = _createListeners( key => key.indexOf( eventName ) === 0 );
        } else {
          listeners = _createListeners( key => key.indexOf( '.' ) <= key.lastIndexOf( nameSpace ) );
        }

        for ( const [ key, val ] of Object.entries( listeners ) ) {
          for ( let i = 0, len = val.length; i < len; i++ ) {
            if ( typeof callBack !== 'function' || val[ i ] === callBack ) {
              this.eventListener( prefix, key, val[ i ] );
            }
          }
        }

      } // if ( prefix === 'remove' )

    } // for

    function _createListeners( condition ) {
      const listeners = {};
      for ( const [ key, value ] of Object.entries( that.listeners ) ) {
        if ( condition.call( null, key, value ) ) {
          const splitedKey = key.split( '.' );
          if ( !listeners[ splitedKey[ 0 ] ] ) {
            listeners[ splitedKey[ 0 ] ] = [];
          }
          listeners[ splitedKey[ 0 ] ] = listeners[ splitedKey[ 0 ] ].concat( value );
          delete that.listeners[ key ];
        }
      }
      return listeners;
    }

  }

  eventListener( prefix, eventName, callBack, options ) {
    let arryElem;
    if ( this.elemEvent.length ) {
      arryElem = this.elemEvent;
    } else {
      arryElem = [ this.elemEvent ];
    }
    Array.prototype.forEach.call( arryElem, ( elem ) => {
      elem[ `${prefix}EventListener` ]( eventName, callBack, options );
    } );
  }
}

