'use strict';

import merge from 'lodash/mergeWith.js';
import './polyfills/closest.js';
import EM from './libs/eventmanager.js';

const d = document;

export default class Tab {

  constructor( options ) {
    const
      defaultSettings = this.defaultSettings = {
        name              : 'tab',
        selectorTrigger   : '',
        selectorTarget    : '',
        selectorWrapper   : '',
        selectorAnchor    : 'a',
        selectorEventRoot : '',
        elemTriggerAll    : null,
        elemTargetAll     : null,
        elemWrapperAll    : null,
        elemEventRoot     : window,
        eventNameLoad     : 'DOMContentLoaded.{name} load.{name} hashchange.{name}',
        eventNameClick    : 'click.{name}',
        className         : 'js-selected',
        defaultIndex      : 0,
        onAllChange       : null,
        onChange          : null,
      }
      ,settings = this.settings = merge( {}, defaultSettings, options )
    ;
    this.id = settings.name;
    this.selectorWrapper = settings.selectorWrapper;
    this.selectorTrigger = settings.selectorTrigger;
    this.selectorTarget = settings.selectorTarget;
    this.selectorAnchor = settings.selectorAnchor;
    this.selectorEventRoot = settings.selectorEventRoot;
    this.elemTriggerAll = settings.elemTriggerAll || d.querySelectorAll( this.selectorTrigger );
    this.elemWrapperAll = settings.elemWrapperAll || d.querySelectorAll( this.selectorWrapper );
    this.elemEventRoot  = settings.elemEventRoot || d.querySelector( this.selectorEventRoot );
    this.eventNameLoad = settings.eventNameLoad.replaceAll( '{name}', this.id );
    this.eventNameClick = settings.eventNameClick.replaceAll( '{name}', this.id );
    this.eventRoot = null;
  }

  /**
   * click event はwindow に登録
   * trigger( タブメニュー ) 以外で、ページ内に該当のリンクが有る可能性を想定。
   */
  on( callbacks ) {
    this.callbackAllChange = callbacks && callbacks.allChange;
    this.callbackChange = callbacks && callbacks.change;
    this.eventRoot = new EM( this.elemEventRoot );
    this.eventRoot
      .on( this.eventNameLoad, this.handleLoad.bind( this ) )
      .on( this.eventNameClick, this.selectorAnchor, this.handleClick.bind( this ) )
    ;
  }

  off() {
    this.eventRoot.off( `.${this.id}` );
  }

  handleLoad( e ) {
    this.runAll( e );
  }

  /**
   * click された要素のhash と同じ値をもつtrigger をthis.elemTriggerAll から選出し、
   * this.run に引数として渡して実行。
   */
  handleClick( e ,target ) {
    const hash = target && target.hash && this.getHash( target.hash );
    let elemCurrentTrigger = null;
    if ( !hash ) {
      return;
    }
    e.preventDefault();
    for ( let elem of this.elemTriggerAll ) {
      if ( hash === this.getHash( elem.hash ) ) {
        elemCurrentTrigger = elem;
      }
    }
    if ( elemCurrentTrigger === null ) {
      return;
    }
    this.run( elemCurrentTrigger, e );
  }

  /**
   * trigger と target を内包するwrapper 単位の実行。
   */
  run( elemCurrentTrigger, e ) {

    const
      elemTarget = d.querySelector( this.getHash( elemCurrentTrigger.hash ) )
      ,elemWrapper = elemTarget.closest( this.selectorWrapper )
      ,elemTriggerAll = elemWrapper.querySelectorAll( this.selectorTrigger )
      ,elemTargetAll = elemWrapper.querySelectorAll( this.selectorTarget )
    ;

    _setClassName( elemTriggerAll, elemCurrentTrigger, this.settings.className );
    _setClassName( elemTargetAll, elemTarget, this.settings.className );

    if ( typeof this.callbackChange === 'function' ) {
      this.callbackChange.call( this, elemWrapper, e, this );
    }
    return this;

    function _setClassName( elemAll, elemTarget, className ) {
      for ( let elem of elemAll ) {
        if ( elem === elemTarget ) {
          elem.classList.add( className );
        } else {
          elem.classList.remove( className );
        }
      }
    }

  }

  /**
   * 全wrapper 要素毎の実行
   */
  runAll( e ) {
    const
      hash = this.getHash() // location.href のハッシュを取得
    ;
    let selectedWrapperByHash = null;

    for ( let elemWrapper of this.elemWrapperAll ) {
      const elemTriggerAll = elemWrapper.querySelectorAll( this.selectorTrigger );
      let elemCurrentTrigger, elemActived;

      if ( !elemTriggerAll.length ) {
        continue;
      }

      for ( let elem of elemTriggerAll ) {
        if ( this.getHash( elem.hash ) === hash ) {
          elemCurrentTrigger = elem;
          selectedWrapperByHash = elemWrapper;
        }
        if ( elem.classList.contains( this.settings.className ) ) {
          elemActived = elem;
        }
      } // for

      /**
       * location.href のhash を持つtrigger が無く、かつすでに選択済みのtrigger があれば、
       * ループの頭から
       */
      if ( !elemCurrentTrigger && elemActived ) {
        continue;
      }

      this.run( elemCurrentTrigger || elemTriggerAll[ this.settings.defaultIndex ], e );

    } // for

    if ( typeof this.callbackAllChange === 'function' ) {
      this.callbackAllChange.call( this, selectedWrapperByHash, e, this );
    }

    return this;
  }

  getHash( string ) {
    const hash = string || window.location.hash;
    return hash && hash.replace( /^#?(.*)/, '#$1' );
  }

}
