import merge from 'lodash/mergeWith.js';
import parents from './utilities/parents.js';

export default class Locate {

  constructor( options ) {
    const
      defaultSettings = this.defaultSettings = {
        name            : 'locate',
        selectorTarget  : '',
        selectorParent  : '',
        elemTargetAll   : null,
        indexRegex      : /index\.[^/]+?$/,
      }
      ,settings = this.settings = merge( {}, defaultSettings, options )
    ;
    this.id = settings.name;
    this.selectorTarget = settings.selectorTarget;
    this.selectorParent = settings.selectorParent;
    this.elemTargetAll = settings.elemTargetAll || document.querySelectorAll( this.selectorTarget );
    this.elemCurrent = null;
    this.elemParentAll = null;
  }

  run( callback ) {
    const
      hostNameByLocal = location.host
      ,pathnameByLocal = location.pathname.replace( this.settings.indexRegex, '' )
    ;
    this.elemCurrent = null;
    this.elemParentAll = null;
    for ( const elemTarget of this.elemTargetAll ) {
      const
        pathNameByElement = elemTarget.pathname.replace( this.settings.indexRegex, '' )
        ,hostNameByElement = elemTarget.host
      ;
      if ( hostNameByLocal !== hostNameByElement ) {
        continue;
      } else if ( pathNameByElement === pathnameByLocal ) {
        this.elemCurrent = elemTarget;
        this.elemParentAll = parents( this.elemCurrent, this.selectorParent, 'body' );
      }
    } // for
    if ( typeof callback === 'function' ) {
      callback.call( this, this );
    }
    return this;
  }

}
