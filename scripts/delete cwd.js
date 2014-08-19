var fs = require('fs')
  , parent = require( __dirname )
;

var exports = module.exports = Object.create( parent );

exports.TITLE = "Delete the cwd";
exports.QUIT = 'Cancel';

exports.opts = function( ){
  return Object.keys(options);
};

exports.exec = function( selected ){
  var directory = process.cwd();
  process.chdir( process.cwd() + '/..' );
  try {
    options[ selected ]( directory );
    parent.render( 'Directory %s deleted', directory );
  } catch( err ){
    process.chdir( directory );
    this.render( 'Error catched when trying to execute "%s":\n\n%s', selected, err.stack );
  };
}

exports.quit = parent.render.bind( parent );

var options = {
  'yes': fs.rmdirSync,
  '@force': rmdirContentsSync
};

function rmdirContentsSync( path ){
  fs.readdirSync( path ).forEach(function( filename ){
    filename =  path + '/' + filename;
    if( fs.statSync( filename ).isDirectory() ){
      return rmdirContentsSync( filename );
    }
    fs.unlinkSync( filename )
  });
  fs.rmdirSync( path );
}