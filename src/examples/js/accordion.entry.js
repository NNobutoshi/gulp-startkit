import Toggle from '../../js/_modules/libs/transitiontoggle.js';

const
  mdls = {}
;
mdls.toggle = new Toggle( {
  // selectorParent  : '.pl-list',
  selectorTrigger : '.pl-list_btn',
  selectorTarget  : '.pl-list_inner',
} );

mdls.toggle.on( {
  before: function() {
    const
      height = this.elemTarget.querySelector( '.pl-list_list' ).getBoundingClientRect().height
    ;
    this.elemTarget.style.height = height + 'px';
    this.elemParent.classList.add( 'js-list--isOpening' );
  },
  after: function() {
    this.elemTarget.style.height = '';
    this.elemParent.classList.remove( 'js-list--isOpening' );
  },
  finish: function() {
    if ( this.isChanged === true ) {
      this.elemParent.classList.add( 'js-list--isOpen' );
    } else {
      this.elemParent.classList.remove( 'js-list--isOpen' );
    }
  }
} );
