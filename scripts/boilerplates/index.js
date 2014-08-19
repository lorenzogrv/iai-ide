var fs = require('fs')
  , spawn = require('child_process').spawn
  , terminal = require('../../lib/terminal')(process.stdout)
  , readn = require('../../lib/readn')
;

var parent = require( __dirname + '/..' )
  , exports = module.exports = Object.create( parent )
;

exports.TITLE = 'Create resource - boilerplate selection';

var BOIL_DIR = __dirname;
exports.opts = function( ){
  return fs.readdirSync( BOIL_DIR ).filter(function( filename ){
    return fs.statSync( BOIL_DIR + '/' + filename).isDirectory();
  });
};

exports.exec = function( selected ){
  console.log( "selected", selected )
  var boilerplate = BOIL_DIR + '/' + selected;
  var stats = fs.statSync( boilerplate );
  if( ! stats.isDirectory() ){
    throw Error(
      boilerplate + '\n'
      + 'This file is not a directory.\n'
      + 'Boilerplates must be resources, and resources must be directories.'
      //+ 'Do you want to delete it now? => this should be a confirmation dialog'
    );
  }

  if( ! fs.existsSync( boilerplate+'/README.md' ) ){
    throw Error( 'README file not found. Aborted.' );
  }
  if( ! fs.existsSync( boilerplate+'/create' ) ){
    throw Error( 'create script not found. Aborted.' );
  }

  terminal
    .clear( )
    .log( fs.readFileSync( boilerplate+'/README.md' )+'' )
    .log( )
    .save( )
  ;

  read_name(function(resource){
    fs.mkdirSync( resource );
    terminal.log( 'directory "%s" created.', resource );
    spawn( boilerplate+'/create', [], { stdio: 'inherit' } ).on('close', function(code){
      terminal.log( 'boilerplate create completed with code %s', code );
      if( ! fs.exists( resource+'/README.md' ) ){
        terminal.log( 'Warning: The new resource does not have a README file' );
        process.exit(1);
      }
    })
  })
};

function read_name( callback ){
  terminal
    .restore( )
    .clearEnd( )
    .raw( "Resource name: " )
  ;
  readn(null, function( name ){
    var resource = process.cwd() + '/' + name;
    if( fs.existsSync(resource) ){
      terminal
        .log( 'resource "%s" already exists.', name )
        .log( 'Press any key to input another resource name.' )
      ;
      return readn( 1, read_name.bind( null, callback ) );
    }
    callback( resource )
  })
}

exports.quit = parent.render.bind( parent );
