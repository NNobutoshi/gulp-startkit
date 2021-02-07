const
  fs      = require( 'fs' )
  ,mkdirp = require( 'mkdirp' )
;
const
  FILEPATH  = '.last_run/.timestamps'
  ,DATANAME = 'myProjectTasksLastRunTime'
;
module.exports = class LastStamp {

  constructor() {
    this.FILEPATH = FILEPATH;
    this.map = {};
    this.envData = process.env[ DATANAME ];
  }

  read( hash ) {
    if ( !hash ) {
      return false;
    }
    if ( this.envData ) {
      this.map = this.envData;
    } else if ( fs.existsSync( FILEPATH ) ) {
      this.map = JSON.parse( fs.readFileSync( FILEPATH, 'utf-8' ) );
    } else {
      this.map = {};
    }
    if ( this.map && hash in this.map ) {
      return this.map[ hash ];
    } else {
      return new Date( 0 );
    }
  }

  write( hash ) {
    const
      dirName = FILEPATH.replace( /[^\/]+$/, '' )
    ;
    if ( !hash ) {
      return false;
    }
    this.set( hash );
    this.envData = this.map;
    if ( !fs.existsSync( dirName ) ) {
      mkdirp.sync( dirName );
    }
    fs.writeFileSync( FILEPATH, JSON.stringify( this.map ), 'utf-8', ( error ) => {
      if ( error ) {
        console.info( error );
      }
    } );
    return this;
  }

  set( hash ) {
    if ( !hash ) {
      return false;
    }
    this.map[ hash ] = new Date();
  }

};
