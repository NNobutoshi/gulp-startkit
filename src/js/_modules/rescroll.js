/*!
 * rescroll.js
 */

import merge from 'lodash/mergeWith';
import position from './utilities/position';
import './polyfills/closest';
import '../_vendor/raf';
import EM from './libs/eventmanager';

const d = document;

export default class Rescroll {

  constructor( options ) {
    const
      defaultSettings = this.defaultSettings = {
        name             : 'rescroll',
        selectorTrigger  : 'a',
        selectorShoulder : '', /* スクロール先を肩代わりする要素 */
        selectorEventRoot : '',
        elemEventRoot : window,
        elemShoudler : null,
        eventNameLoad  : 'load.{name}',
        eventNameHashChange  : 'hashchange.{name}',
        eventNameClick : 'click.{name}',
        eventNameScroll : 'scroll.{name}',
        exclude   : '',
        offsetTop : 0,
        animation : true, /* 所謂スムーススクロール */
        animeOption : {
          duration : 1000,
          easing : function( pos ) {
            return 1 - Math.pow( 1 - pos, 5 );
          }
        }
      }
      ,settings = this.settings = merge( {}, defaultSettings, options )
    ;
    this.id = settings.name;
    this.selectorTrigger = settings.selectorTrigger;
    this.selectorShoulder = settings.selectorShoulder;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemEventRoot = settings.elemEventRoot || d.querySelector( settings.selectorEventRoot );
    this.offsetTop = settings.offsetTop;
    this.isWorking = false;
    this.enabled = false;
    this.lastScrollY = this.elemEventRoot.pageYOffset;
    this.arryShoulderSelector = [];
    this.eventNameLoad  = settings.eventNameLoad.replaceAll( '{name}', this.id );
    this.eventNameHashChange = settings.eventNameHashChange.replaceAll( '{name}', this.id );
    this.eventNameClick = settings.eventNameClick.replaceAll( '{name}', this.id );
    this.eventNameScroll = settings.eventNameScroll.replaceAll( '{name}', this.id );
    this.addShoulder( this.selectorShoulder );
    this.eventRoot = null;
  }

  on() {
    this.eventRoot = new EM( this.elemEventRoot );
    this.eventRoot
      .on( this.eventNameLoad, this.handleLoad.bind( this ) )
      .on( this.eventNameHashChange, this.handleHashChange.bind( this ) )
      .on( this.eventNameClick, this.selectorTrigger, this.handleClick.bind( this ) )
      .on( this.eventNameScroll, this.handleScroll.bind( this ) )
    ;
    return this;
  }

  off() {
    this.evtRoot.off( `.${this.id}` );
    this.lastScrollY = null;
    this.enabled = false;
    this.isWorking = false;
    return this;
  }

  handleLoad( e ) {
    this.enabled = true;
    this.preprocess( e );
  }

  handleHashChange( e ) {
    this.enabled = true;
    this.preprocess( e );
  }

  handleClick( e, target ) {
    const hash = target && target.hash && this.getHash( target.hash );
    if ( !hash && !document.querySelector( hash ) ) {
      return;
    }
    this.enabled = true;
    this.lastScrollY = this.elemEventRoot.pageYOffset;
    e.preventDefault();
    window.history.pushState( null ,null, target.href );
    this.preprocess( e, target );
  }

  /**
   * スクロールの起点になるポイントを常に取得しておく。
   */
  handleScroll( e ) {
    requestAnimationFrame( () => {
      if ( this.enabled === false ) {
        this.lastScrollY = this.elemEventRoot.pageYOffset;
      }
    } );
  }

  preprocess( e, target ) {
    const
      hash = this.getHash()
      ,arryShoulder = this.arryShoulderSelector
      ,elemByHash = ( hash ) ? document.querySelector( hash ) : null
      ,elemShoulder = arryShoulder.length && elemByHash &&
                      _getShoulderElement.bind( this )( elemByHash )
    ;
    let
      lastScrollY = this.lastScrollY
      ,currentScrollY = this.elemEventRoot.pageYOffset
    ;

    /**
     * クリックされたA要素とジャンプ先を肩代わりする要素のY座標が同一であれば、
     * or すでに実行中であれば、
     * or 実行が許可されていなければ、
     * or ジャンプ先を肩代わりする要素も、hash をセレクターにして得られた要素も、どちらもなければ、
     * return
     */
    if ( (
      e.type === 'click' && target && target.hash && elemShoulder &&
        position( target ).top === position( elemShoulder ).top
    ) ||
      this.isWorking === true || this.enabled === false || ( !elemByHash && !elemShoulder )
    ) {
      this.isWorking = false;
      return this;
    }

    /**
     * デフォルトのスクロールを終えるのを待って改めてスクロールさせる
     * hashchange やload のevent でキャンセルできないため。
     */
    requestAnimationFrame( _retry.bind( this ) );

    return this;

    function _retry() {
      if ( currentScrollY !== lastScrollY ) {
        lastScrollY = currentScrollY;
        requestAnimationFrame( _retry.bind( this ) );
      } else {
        this.isWorking = true;
        lastScrollY = null;
        if ( this.settings.animation ) {
          this.animatedScroll( elemShoulder || elemByHash );
        } else {
          this.scroll( elemShoulder || elemByHash );
        }
      }
    }

    /**
     * スクロール先を肩代わりする要素を取得する。
     * 先祖の要素で限定。
     */
    function _getShoulderElement( elemTarget ) {
      const arry = this.arryShoulderSelector;
      let elemClosest = null;
      if ( !elemTarget ) {
        return elemClosest;
      }
      for ( let i = 0, len = arry.length; i < len; i++ ) {
        elemClosest = elemTarget.closest( arry[ i ] );
        if ( elemClosest ) {
          break;
        }
      }
      return elemClosest;
    }

  }

  /**
   * 通常のスクロール
   */
  scroll( elemTarget ) {
    const finishPoint = position( elemTarget ).top - this.offset();
    this.elemEventRoot.scrollTo( 0, this.lastScrollY );
    this.elemEventRoot.scrollTo( 0, finishPoint );
    this.isWorking = false;
    this.enabled = false;
    this.lastScrollY = finishPoint;
  }

  /**
   * スムーススクロール
   */
  animatedScroll( elemTarget ) {
    const
      duration = this.settings.animeOption.duration
      ,easing = this.settings.animeOption.easing
      ,startPoint = this.lastScrollY
      ,finishPoint = position( elemTarget ).top - this.offset()
      ,range = finishPoint - startPoint
    ;
    let
      currentPoint = 0
      ,startTime = null
    ;
    this.elemEventRoot.scrollTo( 0, startPoint );

    requestAnimationFrame( _scrollStep.bind( this ) );

    return this;

    function _scrollStep( time ) {
      startTime = startTime || time;
      currentPoint = startPoint + range * easing.call( null, ( time - startTime ) / duration );
      this.elemEventRoot.scrollTo( 0, currentPoint );
      if ( time - startTime < duration ) {
        requestAnimationFrame( _scrollStep.bind( this ) );
      } else {
        this.isWorking = false;
        this.enabled = false;
        this.lastScrollY = finishPoint;
        this.elemEventRoot.scrollTo( 0, finishPoint );
      }
    }

  }

  /**
   * ビューポート上部でfixed されている要素等の、スクロール量から差し引かなければならないオフセットを取得する
   */
  offset() {
    let offsetTop = 0;
    if ( typeof this.offsetTop === 'number' ) {
      offsetTop = this.offsetTop;
    } else if ( typeof this.offsetTop === 'string' ) {
      offsetTop = _getMaxOffset( document.querySelectorAll( this.offsetTop ) );
    } else if ( typeof this.offsetTop === 'function' ) {
      offsetTop = this.offsetTop.call( this, this );
    }
    return offsetTop;
  }

  getHash( string ) {
    const hash = string || window.location.hash;
    return hash && hash.replace( /^#?(.*)/, '#$1' );
  }

  addShoulder( selector ) {
    if ( selector && typeof selector === 'string' ) {
      this.arryShoulderSelector.push( selector );
    }
  }

}

function _getMaxOffset( elems ) {
  let
    bottoms = []
  ;
  for ( let elem of elems ) {
    bottoms.push( elem.getBoundingClientRect().bottom );
  }
  return Math.max.apply( null, bottoms );
}
