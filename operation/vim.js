var iai = require( '../../iai' )
  , terminal = require('../lib/terminal')
  , ansi = require('../lib/ansi' )
  , path = require( 'path' )
  , spawn = require( 'pty.js' ).spawn
;

module.exports = vim;

function vim( file ){
  file = file? path.resolve( file ) : '';

  var vim = spawn( 'vim', [ file ], {
    cols: process.stdout.columns,
    rows: process.stdout.rows,
    cwd: process.cwd()
  });

  process.stdout.on( 'resize', refresh );
  function refresh(){
    vim.resize( process.stdout.columns, process.stdout.rows );
  }

  process.stdin.setRawMode( true );
  process.stdin.resume();
  process.stdin.pipe(vim);

  var ui = terminal( process.stdout )
//    .raw( require('util').format(ansi.moveTo, 1, 4) )
  ;

  vim.on('data', function( buffer ){
    ui.raw( buffer );
  });

  vim.on('close', function( code ){
    process.stdout.removeListener( 'resize', refresh );
    process.stdin.unpipe( vim );
    process.stdin.setRawMode( false );
    process.stdin.pause();
  });

  return vim.socket;
}
