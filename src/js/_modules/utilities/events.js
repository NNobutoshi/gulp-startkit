export default class Events {

  constructor( obj, target ) {
    target = target || document;
    target.on = Element.prototype.on = this.on;
    target.off = Element.prototype.off = this.off;
    target._bindObject = obj;
  }

  on( eventName, callBack, options ) {
    callBack = callBack.bind( this._bindObject );
    _runOnOff( 'add', eventName, this, callBack, options );
  }

  off( eventName, callBack ) {
    callBack = callBack.bind( this._bindObject );
    _runOnOff( 'remove', eventName, this, callBack );
  }

}

function _runOnOff( state, eventName, eventElem, callBack, options ) {
  let events = [];
  if ( eventName.indexOf( ' ' ) > -1 ) {
    events = eventName.split( ' ' );
  } else {
    events.push( eventName );
  }
  for ( let i = 0, len = events.length; i < len; i++ ) {
    eventElem[ `${state}EventListener` ]( events[ i ], callBack, options );
  }
}
