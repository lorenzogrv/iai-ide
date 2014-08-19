/**
 * exits the current process, intentionally simple
 */

exports.exit = function( ){
  console.log('Bye.');
  process.exit();
}

/*! ---------------------------------- */

var resolve = require('path').resolve
  , fs = require('fs')
  , IOStream = require('../../iai')('async/IOStream')
;

/**
 * touches a file.
 *
 * The file is created if it does not exist, left not modified it it exists.
 */

exports.touch = function( ref ){
  ref = resolve( ref );
  var io = IOStream();
  fs.createWriteStream( ref, { flags: 'a+' })
    .on('open', function( fd ){
      fs.close( fd, io.end.bind(io) );
    })
    // on error?
  ;
  return io;
}


/**
 * changes the current working directory
 */

exports.cd = cd;

var terminal = require('../lib/terminal')
  , keymap = require('../lib/keymap')
;
function cd( ref ){
  var io = IOStream();

  if( ref ){
    process.chdir( resolve(ref) );
    process.nextTick( io.end.bind(io) );
    return io;
  }

  var ui = terminal( process.stdout )
    , keys= { 'q': '.' }
  ;
  fs.readdirSync( process.cwd() )
    .filter(function( filename ){
      return fs.statSync( resolve(filename) ).isDirectory();
    })
    .forEach(function( filename ){
       for( var n in filename ){
         if( 'undefined' == typeof keys[ filename[n] ] ){
           keys[ filename[n] ] = filename;
           break;
         } else if( n === filename.length-1 ){
           ui.log( 'entry for', options[o], 'not set' );
         }
       }
    })
  ;
  // ideally, keymap returns stream? deferred? emitter?
  // something...
  //keymap( ui, keys, cd );
  keymap( ui, keys, function( dirname ){
    cd( dirname );
    console.log('hola')
    io.end();
  })
  return io;
};

exports.error = "gimme an error";

