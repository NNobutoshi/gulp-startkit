import merge from 'lodash/mergeWith';
import EM from './utilities/eventmanager';
import 'regenerator-runtime/runtime';

const doc = document;

export default class VideoGround {

  constructor( options ) {
    this.defaultSettings = {
      name               : 'videoGround',
      src                : '',
      waitTime           : 10000,
      aspectRatio        : 720 / 1280,
      actualHeightRatio  : 1 / 1,
      selectorParent     : '',
      selectorVideoFrame : '',
      attrVideo          : [ 'muted', 'playsinline', 'loop' ],
      onPlay             : null,
      onPlayBefore       : null,
      onLoad             : null,
      onDestroy          : null,
    };
    this.settings = merge( {}, this.defaultSettings, options );
    this.id = this.settings.name;
    this.selectorParent = this.settings.selectorParent;
    this.selectorVideoFrame = this.settings.selectorVideoFrame;
    this.elemVideo = _createVideo( this.settings.attrVideo );
    this.elemVideoFrame = doc.querySelector( this.selectorVideoFrame );
    this.elemParent = this.selectorParent && doc.querySelector( this.selectorParent );
    this.elemParent = this.elemParent || this.elemVideoFrame.parentNode;
    this.evtNamePlay = `play.${this.id}`;
    this.evtNameCanPlay = `canplay.${this.id}`;
    this.isPlaying = false;
    this.destroyTimerId = null;
    this.evtVideo = new EM( this.elemVideo );
  }

  /**
   * play()が可能か事前に調べ、結果を待って各種設定、実行。
   * 無効の場合 this.destroy() 。
   */
  run() {
    const
      settings = this.settings
      ,elemVideo = this.elemVideo
      ,elemVideoFrame = this.elemVideoFrame
    ;

    this.autoDestroy();
    this.on();
    this.eventCall( settings.onBefore );

    /* eslint space-before-function-paren: 0 */
    ( async () => {
      if ( await this.testPlay() === false ) {
        return this.destroy();
      }
      elemVideo.src = settings.src;
      elemVideoFrame.appendChild( elemVideo );
      this.eventCall( settings.onPlayBefore );
      elemVideo.load();
    } )();
    return this;
  }

  /**
   * play()で再生が可能かどうか、ダミーのvideo を作成し、結果を返す
   */
  testPlay() {
    return new Promise( ( resolve ) => {
      const
        retries    = 3
        ,testVideo = _createVideo( this.settings.attrVideo )
      ;
      let
        timeoutId = null
        ,currentTry = 0
      ;
      testVideo.play();
      ( function _try() {
        currentTry += 1;
        clearTimeout( timeoutId );
        timeoutId = null;
        if ( testVideo.paused === false || currentTry > retries ) {
          resolve( !testVideo.paused );
          return;
        }
        timeoutId = setTimeout( _try, 160 );
      } )();
    } );
  }

  on() {
    this.evtVideo.on( this.evtNamePlay,  this.handlePlay.bind( this ) );
    this.evtVideo.on( this.evtNameCanPlay, this.handleCanPlay.bind( this )  );
    return this;
  }

  handlePlay( e ) {
    const
      settings = this.settings
    ;
    clearTimeout( this.destroyTimerId );
    this.destroyTimerId = null;
    this.isPlaying = true;
    this.eventCall( settings.onPlay );
    this.evtVideo.off( this.evtNameCanPlay );
  }

  handleCanPlay( e ) {
    const
      settings = this.settings
    ;
    this.elemVideo.play();
    this.eventCall( settings.onLoad );
  }

  destroy() {
    const
      settings = this.settings
    ;
    clearTimeout( this.destroyTimerId );
    if ( this.elemVideoFrame.querySelector( settings.classNameTarget ) !== null ) {
      this.elemVideoFrame.removeChild( this.elemVideo );
    }
    this.eventCall( settings.onDestroy );
    this.evtVideo.off( `.${this.id}` );
    return this;
  }

  /**
   * 待機時間を過ぎれば、this.destroy() 。
   */
  autoDestroy() {
    this.destroyTimerId = setTimeout( () => {
      clearTimeout( this.destroyTimerId );
      this.destroyTimerId = null;
      this.destroy();
    }, this.settings.waitTime );
  }

  /**
   * ojbect-fit の代替。
   */
  resize() {
    const
      settings = this.settings
      ,frameWidth = this.elemParent.offsetWidth
      ,frameHeight = this.elemParent.offsetHeight
      ,frameAspectRatio = frameHeight / frameWidth
    ;
    if ( frameAspectRatio > settings.aspectRatio ) {
      this.elemVideo.style.width = 'auto';
      this.elemVideo.style.height = frameHeight * settings.actualHeightRatio + 'px';
    } else {
      this.elemVideo.style.width = 100 + '%';
      this.elemVideo.style.height = 'auto';
    }
    return this;
  }

  eventCall( func ) {
    if ( typeof func === 'function' ) {
      func.call( this, this );
    }
  }

}

function _createVideo( props ) {
  const elemVideo = doc.createElement( 'video' );
  for ( let i = 0, len = props.length; i < len; i++ ) {
    elemVideo.setAttribute( props[ i ], '' );
    elemVideo[ props[ i ] ] = true;
  }
  return elemVideo;
}
