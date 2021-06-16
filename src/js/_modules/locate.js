import merge from 'lodash/mergeWith';
import parents from './utilities/parents';

export default class Locate {

  constructor( options ) {
    this.defaultSettings = {
      name            : 'locate',
      selectorTarget  : '',
      selectorParents : '',
      indexRegex      : /index\.[^/]+?$/,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.selectorTarget = this.settings.selectorTarget;
    this.selectorParents = this.settings.selectorParents;
    this.elemTargets = document.querySelectorAll( this.selectorTarget );
    this.elemCurrent = null;
    this.elemParents = null;
  }

  run( callback ) {
    const
      hostName = location.host
      ,wPathname = location.pathname.replace( this.settings.indexRegex, '' )
      ,elemTargets = this.elemTargets
    ;
    for ( let i = 0, len = elemTargets.length; i < len; i++ ) {
      const
        elem = elemTargets[ i ]
        ,aPathname = elem.pathname.replace( this.settings.indexRegex, '' )
        ,aHost = elem.host
      ;
      if ( hostName !== aHost ) {
        continue;
      } else if ( aPathname === wPathname ) {
        this.elemCurrent = elem;
        this.elemParents = parents( this.elemCurrent, this.selectorParents, 'body' );
      }
    }
    if ( typeof callback === 'function' ) {
      callback.call( this, this );
    }
    return this;
  }

}
