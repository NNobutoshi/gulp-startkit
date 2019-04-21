export default class Locate {

  constructor( options ) {
    this.defaultSettings = {
      name : 'locate',
      target : '',
      indexRegex : /index\.[^/]+?$/,
    };
    this.settings = $.extend( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.targetSelector = this.settings.target;
    this.target = document.querySelectorAll( this.targetSelector );
    this.currentItem = null;
  }

  run() {
    const
      hostName = window.location.host
      ,wPathname = window.location.pathname.replace( this.settings.indexRegex, '' )
    ;
    Array.prototype.forEach.call( this.target, ( self ) => {
      const
        aPathname = self.pathname.replace( this.settings.indexRegex, '' )
        ,aHost = self.host
      ;
      if ( hostName !== aHost ) {
        return this;
      } else {
        if ( aPathname === wPathname ) {
          this.currentItem = self;
        }
      }
    } );
    return this;
  }

}
