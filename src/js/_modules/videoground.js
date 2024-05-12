import merge from 'lodash/mergeWith.js';
import EM from './libs/eventmanager.js';
import 'regenerator-runtime/runtime.js';

const d = document;

export default class VideoGround {

  constructor( options ) {
    const
      defaultSettings = this.defaultSettings = {
        name               : 'videoGround',
        selectorParent     : '',
        selectorVideoFrame : '',
        elemParent         : null,
        elemVideoFrame     : null,
        eventNamePlay      : 'play.{name}',
        eventNameCanPlay   : 'canplay.{name}',
        src                : '',
        waitTime           : 6000,
        aspectRatio        : 720 / 1280,
        actualHeightRatio  : 1 / 1,
        attrVideo          : [ 'muted', 'playsinline', 'loop' ],
      }
      ,settings = this.settings = merge( {}, defaultSettings, options )
    ;
    this.id = settings.name;
    this.selectorParent = settings.selectorParent;
    this.selectorVideoFrame = settings.selectorVideoFrame;
    this.elemVideo = _createVideo( settings.attrVideo );
    this.elemVideoFrame = d.querySelector( this.selectorVideoFrame );
    this.elemParent = settings.elemParent ||
                      this.selectorParent && d.querySelector( this.selectorParent ) ||
                      this.elemVideoFrame.parentNode
    ;
    this.eventNamePlay = settings.eventNamePlay.replaceAll( '{name}', this.id );
    this.eventNameCanPlay = settings.eventNameCanPlay.replaceAll( '{name}', this.id );
    this.isPlaying = false;
    this.destroyTimerId = null;
    this.eventVideo = null;
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
        ,counterOfTries = 0
      ;
      testVideo.play();
      ( function _try() {
        counterOfTries += 1;
        clearTimeout( timeoutId );
        timeoutId = null;
        if ( testVideo.paused === false || counterOfTries > retries ) {
          resolve( !testVideo.paused );
          return;
        }
        timeoutId = setTimeout( _try, 160 );
      } )();
    } );
  }

  on( callbacks ) {
    if ( typeof callbacks === 'object' ) {
      this.callbackPlay = callbacks.play;
      this.callbackBefore = callbacks.before;
      this.callbackLoad = callbacks.load;
      this.callbackDestroy = callbacks.destroy;
    }
    this.eventVideo = new EM( this.elemVideo );
    this.eventVideo
      .on( this.eventNamePlay,  this.handlePlay.bind( this ) )
      .on( this.eventNameCanPlay, this.handleCanPlay.bind( this ) )
    ;
    this.eventCall( this.callbackBefore );
    return this;
  }

  handlePlay( e ) {
    clearTimeout( this.destroyTimerId );
    this.destroyTimerId = null;
    this.isPlaying = true;
    this.eventCall( this.callbackPlay );
    this.eventVideo.off( this.eventNameCanPlay );
  }

  handleCanPlay( e ) {
    this.elemVideo.play();
    this.eventCall( this.callbackLoad );
  }

  destroy() {
    clearTimeout( this.destroyTimerId );
    if ( this.elemVideoFrame.querySelector( this.settings.classNameTarget ) !== null ) {
      this.elemVideoFrame.removeChild( this.elemVideo );
    }
    this.eventCall( this.callbackDestroy );
    this.eventVideo.off( `.${ this.id }` );
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
  const elemVideo = d.createElement( 'video' );
  for ( let i = 0, len = props.length; i < len; i++ ) {
    elemVideo.setAttribute( props[ i ], '' );
    elemVideo[ props[ i ] ] = true;
  }
  return elemVideo;
}
