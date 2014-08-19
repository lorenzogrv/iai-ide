var fs = require('fs')
  , parent = require( __dirname )

var exports = module.exports = Object.create( parent );

exports.TITLE = 'Select a file to duplicate it';
exports.QUIT = 'Cancel';

exports.opts = function( ){
  return fs.readdirSync( process.cwd() ).filter(function( filename ){
    return fs.statSync( process.cwd() + '/' + filename ).isFile();
  });
};

exports.exec = function( selection ){
  //process.chdir( process.cwd() + '/' + selection )
  this.render( "selected '%s', now I should ask for the file name", selection );
};

exports.quit = parent.render.bind( parent );