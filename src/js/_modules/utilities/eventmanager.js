export default class EventManager {

  constructor( elemEventer ) {
    this.listeners = {};
    this.elemEventer = elemEventer || document;
  }

  on( strEventName, callback, options ) {
    this.setUp( 'add', strEventName, callback, options );
    return this;
  }

  off( strEventName, callback ) {
    this.setUp( 'remove', strEventName, callback );
    return this;
  }

  trigger( strEventName ) {
    this.setUp( 'trigger', strEventName );
    return this;
  }

  setUp( prefix, strEventName, callback, options ) {
    const
      that = this
      ,arryEventNames = strEventName.split( ' ' )
    ;

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
        this.listeners[ strEventName ].push( callback );
        this.setEventListener( prefix, eventName, callback, options );
      } // if( prefix == 'add' )

      if ( prefix === 'remove' ) {
        let listeners = {};
        if ( eventName && nameSpace ) {
          listeners = _collectListeners(
            key => key === strEventName
          );
        } else if ( eventName ) {
          listeners = _collectListeners(
            key => key.indexOf( eventName ) === 0
          );
        } else {
          listeners = _collectListeners(
            key => key.indexOf( '.' ) <= key.lastIndexOf( nameSpace )
          );
        }

        for ( const [ key, val ] of Object.entries( listeners ) ) {
          for ( let i = 0, len = val.length; i < len; i++ ) {
            if ( typeof callback !== 'function' || val[ i ] === callback ) {
              this.setEventListener( prefix, key, val[ i ] );
            }
          }
        }

      } // if ( prefix === 'remove' )

      if ( prefix === 'trigger' ) {
        if ( eventName && nameSpace ) {
          _collectListeners( key => key === strEventName, true );
        } else if ( eventName ) {
          _collectListeners( key => key.indexOf( eventName ) === 0, true );
        } else {
          _collectListeners( key => key.indexOf( '.' ) <= key.lastIndexOf( nameSpace ), true );
        }

      } // if ( prefix === 'trigger' )

    } // for

    function _collectListeners( condition, calling ) {
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
      if ( calling ) {
        for ( const value of Object.values( listeners ) ) {
          const arry = value;
          Array.prototype.forEach.call( arry, ( func ) => {
            func( null );
          } );
        }
      } else {
        return listeners;
      }
    }

  }

  setEventListener( prefix, eventName, callback, options ) {
    let arryElements;
    if ( this.elemEventer.length ) {
      arryElements = this.elemEventer;
    } else {
      arryElements = [ this.elemEventer ];
    }
    Array.prototype.forEach.call( arryElements, ( elem ) => {
      elem[ `${prefix}EventListener` ]( eventName, callback, options );
    } );
  }

}

