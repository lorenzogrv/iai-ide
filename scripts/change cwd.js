var fs = require('fs')
  , main = require( __dirname )

var exports = module.exports = Object.create(main);

exports.TITLE = 'Resource selection';
exports.QUIT = 'Cancel';

exports.opts = function( ){
  return fs.readdirSync( process.cwd() ).filter(function( filename ){
    return fs.statSync( process.cwd() + '/' + filename ).isDirectory();
  }).concat( [ '..', './' ] );
};

exports.exec = function( selection ){
  process.chdir( process.cwd() + '/' + selection )
  main.render( "cwd changed to '%s'", selection );
};

exports.quit = main.render.bind( main );
