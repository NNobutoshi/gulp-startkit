// import $ from 'jquery';
import merge from 'lodash/mergeWith';

export default class Locate {

  constructor( options ) {
    this.defaultSettings = {
      name       : 'locate',
      target     : '',
      indexRegex : /index\.[^/]+?$/,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.targetSelector = this.settings.target;
    this.target = document.querySelectorAll( this.targetSelector );
    this.currentItem = null;
  }

  run( callBack ) {
    const
      hostName = location.host
      ,wPathname = location.pathname.replace( this.settings.indexRegex, '' )
      ,targets = this.target
    ;
    for ( let i = 0, len = targets.length; i < len; i++ ) {
      const
        self = targets[ i ]
        ,aPathname = self.pathname.replace( this.settings.indexRegex, '' )
        ,aHost = self.host
      ;
      if ( hostName !== aHost ) {
        continue;
      } else if ( aPathname === wPathname ) {
        this.currentItem = self;
      }
    }
    if ( typeof callBack === 'function' ) {
      callBack.call( this, this );
    }
    return this;
  }

}
