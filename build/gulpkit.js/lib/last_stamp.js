const
  fs      = require( 'fs' )
  ,path   = require( 'path' )
  ,mkdirp = require( 'mkdirp' )
;
const
  FILEPATH  = path.resolve( __dirname, '../.last_run/.timestamps' )
  ,DIRNAME = path.dirname( FILEPATH )
  ,DATANAME = 'myProjectTasksLastRunTime'
  ,ZERO     = new Date( 0 )
;
let
  envData = process.env[ DATANAME ]
;
module.exports.default = {
  get : _get,
  set : _set,
};

module.exports.get = _get;
module.exports.set = _set;
module.exports.write = _write;
module.exports.fresh = _fresh;
module.exports.reset = _reset;
module.exports.resetAll = _resetAll;

function _get( hash ) {
  const map = _getAll();
  if ( !hash ) {
    return false;
  }
  if ( hash in map ) {
    if ( typeof map[ hash ] === 'string' ) {
      return new Date( map[ hash ] );
    }
    return map[ hash ];
  } else {
    return ZERO;
  }
}

function _getAll() {
  if ( envData ) {
    return envData;
  } else if ( fs.existsSync( FILEPATH ) ) {
    return JSON.parse( fs.readFileSync( FILEPATH, 'utf-8' ) );
  } else {
    return {};
  }
}

function _set( hash ) {
  const map = _getAll();
  if ( !hash ) {
    return false;
  }
  map[ hash ] = new Date();
  envData = map;
}

function _write() {
  if ( !envData ) {
    return false;
  }
  if ( !fs.existsSync( DIRNAME ) ) {
    mkdirp.sync( DIRNAME );
  }
  fs.writeFileSync( FILEPATH, JSON.stringify( envData ), 'utf-8', ( error ) => {
    if ( error ) {
      throw error;
    }
  } );
}

function _fresh( hash ) {
  const map = _getAll();
  if ( hash in map ) {
    map[ hash ] = ZERO;
    envData = map;
    _write();
  }
}

function _reset( hash ) {
  const map = _getAll();
  delete map[ hash ];
  envData = map;
  _write();
}

function _resetAll( ) {
  if ( fs.existsSync( FILEPATH ) ) {
    fs.unlink( FILEPATH, ( error ) => {
      if ( error ) {
        throw error;
      }
      fs.rmdir( DIRNAME, { recursive : true }, ( error ) => {
        if ( error ) {
          throw error;
        }
      } );
    } );
  }
}
