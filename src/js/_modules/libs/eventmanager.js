import '../polyfills/closest.js';

export default class EventManager {

  constructor( elemEventer ) {
    this.listeners = {};
    this.elemEventer = elemEventer || document;
  }

  on( fullEventTypeNames, selectorTarget, listener, options ) {
    if ( typeof selectorTarget === 'function' ) {
      [ options, listener, selectorTarget ] = [ listener, selectorTarget, null ];
    }
    this.setUp( 'add', fullEventTypeNames, selectorTarget, listener, options );
    return this;
  }

  off( fullEventTypeNames, listener ) {
    this.setUp( 'remove', fullEventTypeNames, null, listener );
    return this;
  }

  trigger( fullEventTypeNames ) {
    this.setUp( 'trigger', fullEventTypeNames );
    return this;
  }

  /**
   * 半角スペースで区切られた、複数分の、name space を含むfull のtype name 毎に処理。
   * "add"、"remove"、"trigger"と、渡されたprefix 引数で処理を分ける。
   */
  setUp( prefix, fullEventTypeNames, selectorTarget, listener, options ) {
    const that = this;

    fullEventTypeNames.split( ' ' ).forEach( ( fullEventTypeName ) => {
      const
        [ eventType, nameSpace ] = fullEventTypeName.split( '.' )
      ;
      let
        objListeners
        ,mapListener
        ,target
      ;

      /**
       *  name space を含めたfull のevent type 名をキーに、
       *  listener を配列に格納したものを値にしたオブジェクトをthis.listeners に格納。
       *  同時にname space を取り除いたevent type 名でaddEventListnerに登録。
       */
      if ( prefix === 'add' && eventType && typeof listener === 'function' ) {
        mapListener = new Map();
        mapListener.set( listener, function( e ) {
          if ( selectorTarget && typeof selectorTarget === 'string' ) {
            target = e.target.closest( selectorTarget );
            if ( !target ) {
              return;
            }
          }
          listener( e, target );
        } );
        if ( !this.listeners[ fullEventTypeName ] ) {
          this.listeners[ fullEventTypeName ] = [];
        }
        this.listeners[ fullEventTypeName ].push( mapListener );
        this.setEventListener( prefix, eventType, mapListener.get( listener ), options );
      } // if( prefix === 'add' )

      /**
       * this.listeners の中からそのkeyに、渡された引数fullEventTypeNames がフルで一致するもの、
       * event type 名だけが渡され、それが部分的に含まれるもの、
       * name space だけが渡され、それが部分的に含まれるものを収集。
       */
      if ( prefix === 'remove' || prefix === 'trigger' ) {
        objListeners = _collectListeners( ( key ) => {
          return ( eventType && nameSpace && fullEventTypeName === key ) ||
                 ( eventType && !nameSpace && key.indexOf( eventType ) === 0 ) ||
                 ( !eventType && nameSpace && key.indexOf( `.${nameSpace}` ) >= 0 )
          ;
        } );

        /**
         * 収集したobject の中からprefix 引数に応じて、"remove" で、removeEventListener"の登録。
         * "trigger"でそのままlistner を実行。
         */
        for ( const [ typeName, arrListeners ] of Object.entries( objListeners ) ) {
          if ( prefix === 'remove' ) {
            delete that.listeners[ typeName ];
          }
          arrListeners.forEach( ( mapListener ) => {
            if ( prefix === 'remove' && ( !listener || mapListener.has( listener ) ) ) {
              this.setEventListener( prefix, typeName, mapListener.values().next().value );
            } else if ( prefix === 'trigger' ) {
              mapListener.values().next().value();
            }
          } );
        }
      } // if ( prefix === 'remove' || prefix === 'trigger' )

    } );

    /**
     * this.listeners の中から渡されたcondition 関数でtrue を返すkey と値を格納したobject を返す。
     */
    function _collectListeners( condition ) {
      const objListeners = {};
      for ( const [ fullTypeName, arrListeners ] of Object.entries( that.listeners ) ) {
        if ( condition.call( null, fullTypeName, arrListeners ) ) {
          const [ typeName ] = fullTypeName.split( '.' );
          if ( !objListeners[ typeName ] ) {
            objListeners[ typeName ] = [];
          }
          objListeners[ typeName ] = objListeners[ typeName ].concat( arrListeners );
        }
      }
      return objListeners;
    }

  }

  setEventListener( prefix, eventType, listener, options ) {
    const arrElements = ( this.elemEventer.length ) ?
      Array.from( this.elemEventer ) : [ this.elemEventer ]
    ;
    arrElements.forEach( ( elem ) => {
      elem[ `${prefix}EventListener` ]( eventType, listener, options );
    } );
  }

}
