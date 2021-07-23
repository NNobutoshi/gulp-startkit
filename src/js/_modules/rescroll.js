/*!
 * rescroll.js
 */

import merge from 'lodash/mergeWith';
import position from './utilities/position';
import './polyfills/closest';
import '../_vendor/raf';
import EM from './utilities/eventmanager';

export default class Rescroll {

  constructor( options ) {
    this.defaultSettings = {
      name      : 'rescroll',
      exclude   : '',
      offsetTop : 0,
      selectorShoulder : null, /* スクロール先を肩代わりする要素 */
      animation : true, /* 所謂スムーススクロール */
      animeOption : {
        duration : 1000,
        easing : function( pos ) {
          return 1 - Math.pow( 1 - pos, 5 );
        }
      }
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.offsetTop = this.settings.offsetTop;
    this.id = this.settings.name;
    this.isWorking = false;
    this.enabled = false;
    this.lastScrollY = window.pageYOffset;
    this.evtRoot = new EM( window );
    this.arryShoulderSelector = [];
    this.addShoulder( this.settings.selectorShoulder );
    this.eventNameLoad  = `load.${this.id}`;
    this.eventNameHashChange  = `hashchange.${this.id}`;
    this.eventNameClick = `click.${this.id}`;
    this.eventNameScroll = `scroll.${this.id}`;
  }

  on() {
    this.evtRoot
      .on( this.eventNameLoad, this.handleLoad.bind( this ) )
      .on( this.eventNameHashChange, this.handleHashChange.bind( this ) )
      .on( this.eventNameClick, 'a', this.handleClick.bind( this ) )
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
    this.lastScrollY = window.pageYOffset;
    e.preventDefault();
    window.history.pushState( null ,null, target.href );
    this.preprocess( e, target );
  }

  /**
   * スクロールの起点になるポイントを常に取得しておく。
   */
  handleScroll( e ) {
    const that = this;
    requestAnimationFrame( () => {
      if ( that.enabled === false ) {
        that.lastScrollY = window.pageYOffset;
      }
    } );
  }

  preprocess( e, target ) {
    const
      that = this
    ;
    const
      hash = this.getHash()
      ,arryShoulder = this.arryShoulderSelector
      ,elemByHash = ( hash ) ? document.querySelector( hash ) : null
      ,elemShoulder = arryShoulder.length && elemByHash && _getShoulderElement( elemByHash )
    ;
    let
      lastScrollY = this.lastScrollY
      ,currentScrollY = window.pageYOffset
    ;

    /**
     * クリックされたA要素とジャンプ先を肩代わりする要素のY座標が同一であれば、
     * or すでに実行中であれば、
     * or 実行が許可されていなければ、
     * or ジャンプ先を肩代わりする要素も、hash をセレクターにして得られた要素も、どちらもなければ、
     * return
     */
    if (
      (
        e.type === 'click' &&
        target &&
        target.hash &&
        elemShoulder &&
        position( target ).top === position( elemShoulder ).top
      ) ||
      this.isWorking === true ||
      this.enabled === false ||
      ( !elemByHash && !elemShoulder )
    ) {
      this.isWorking = false;
      return this;
    }

    /**
     * デフォルトのスクロールを終えるのを待って改めてスクロールさせる
     * hashchange やload のevent でキャンセルできないため。
     */
    ( function _retry() {
      requestAnimationFrame( () => {
        if ( currentScrollY !== lastScrollY ) {
          lastScrollY = currentScrollY;
          _retry();
        } else {
          that.isWorking = true;
          lastScrollY = null;
          if ( that.settings.animation ) {
            that.animatedScroll( elemShoulder || elemByHash );
          } else {
            that.scroll( elemShoulder || elemByHash );
          }
        }
      } );
    } )();
    return this;

    /**
     * スクロール先を肩代わりする要素を取得する。
     * 先祖の要素で限定。
     */
    function _getShoulderElement( elemTarget ) {
      const arry = that.arryShoulderSelector;
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
    window.scrollTo( 0, this.lastScrollY );
    window.scrollTo( 0, finishPoint );
    this.isWorking = false;
    this.enabled = false;
    this.lastScrollY = finishPoint;
  }

  /**
   * スムーススクロール
   */
  animatedScroll( elemTarget ) {
    const
      that = this
    ;
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
    window.scrollTo( 0, startPoint );
    requestAnimationFrame( _scrollStep );

    function _scrollStep( time ) {
      startTime = startTime || time;
      currentPoint = startPoint + range * easing.call( null, ( time - startTime ) / duration );
      window.scrollTo( 0, currentPoint );
      if ( time - startTime < duration ) {
        requestAnimationFrame( _scrollStep );
      } else {
        that.isWorking = false;
        that.enabled = false;
        that.lastScrollY = finishPoint;
        window.scrollTo( 0, finishPoint );
      }
    }

    return this;

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
