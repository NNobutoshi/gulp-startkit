'use strict';

import merge from 'lodash/mergeWith';
import './polyfills/closest';
import EM from './utilities/eventmanager';

const doc = document;

export default class Tab {

  constructor( options ) {
    this.defaultSettings = {
      name            : 'tab',
      selectorTrigger : '',
      selectorTarget  : '',
      selectorWrapper : '',
      className       : 'js-selected',
      defaultIndex    : 0,
      onAllChange     : null,
      onChange        : null,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.selectorWrapper = this.settings.selectorWrapper;
    this.selectorTrigger = this.settings.selectorTrigger;
    this.selectorTarget = this.settings.selectorTarget;
    this.elemTriggerAll = doc.querySelectorAll( this.selectorTrigger );
    this.elemWrapperAll = doc.querySelectorAll( this.selectorWrapper );
    this.callbackAllChange = this.settings.onAllChange;
    this.callbackChange = this.settings.onChange;
    this.eventNameLoad = `DOMContentLoaded.${this.id} load.${this.id} hashchange.${this.id}`;
    this.eventNameClick = `click.${this.id}`;
    this.evtWindow = new EM( window );
  }

  /**
   * click event はwindow に登録
   * trigger( タブメニュー ) 以外で、ページ内に該当のリンクが有る可能性を想定。
   */
  on() {
    this.evtWindow
      .on( this.eventNameLoad, ( e, target ) => this.handleLoad( e, target ) )
      .on( this.eventNameClick, 'a', ( e, target ) => this.handleClick( e, target ) )
    ;
  }

  off() {
    this.evtWindow.off( `.${this.id}` );
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
    e.preventDefault();
    if ( !hash ) {
      return;
    }
    for ( let elem of this.elemTriggerAll ) {
      if ( hash === this.getHash( elem.hash ) ) {
        elemCurrentTrigger = elem;
      }
    }
    if ( elemCurrentTrigger === null ) {
      return;
    }
    this.run( elemCurrentTrigger );
  }

  /**
   * trigger と target を内包するwrapper 単位の実行。
   */
  run( elemCurrentTrigger ) {

    const
      elemTarget = doc.querySelector( this.getHash( elemCurrentTrigger.hash ) )
      ,elemWrapper = elemTarget.closest( this.selectorWrapper )
      ,elemTriggerAll = elemWrapper.querySelectorAll( this.selectorTrigger )
      ,elemTargetAll = elemWrapper.querySelectorAll( this.selectorTarget )
    ;

    _setClassName( elemTriggerAll, elemCurrentTrigger, this.settings.className );
    _setClassName( elemTargetAll, elemTarget, this.settings.className );

    if ( typeof this.callbackChange === 'function' ) {
      this.callbackChange.call( this, elemWrapper, this );
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
  runAll() {
    const
      hash = this.getHash() // location.href のハッシュを取得
    ;
    let selectedWrapperByHash = null;

    for ( let elemWrapper of this.elemWrapperAll ) {
      const
        elemTriggerAll = elemWrapper.querySelectorAll( this.selectorTrigger )
      ;
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

      this.run( elemCurrentTrigger || elemTriggerAll[ this.settings.defaultIndex ] );

    } // for

    if ( typeof this.callbackAllChange === 'function' ) {
      this.callbackAllChange.call( this, selectedWrapperByHash, this );
    }

    return this;
  }

  getHash( string ) {
    const hash = string || window.location.hash;
    return hash && hash.replace( /^#?(.*)/, '#$1' );
  }

}
