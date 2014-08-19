var iai = require( '../../iai' )
  , ide = iai( __dirname, '..' )
  , terminal = require('../lib/terminal')
  , ansi = require('../lib/ansi')
  , read = require('../lib/read')
  , readn = require('../lib/readn')
  , keymap = require('../lib/keymap')
  , execute = require('./execute')
  , IOStream = iai( 'async/IOStream' )
  , stream = require('stream')
  , assert = require('assert')
;

module.exports = view;

/**
 * display a view and wait user interaction
 *
 * @param {string} ref path reference to the view, inside the view dir
 * @returns {} ¿stream? to communicate with the caller
 */

var count = 0;

function view( ref ){
  count ++;
  var name = ref + ' (' + count + ')';
  var meta = view.read( ref )
    , io = IOStream()
    , ui = terminal( io )
  ;
  io.on('error', function( err ){
    console.log( 'view %s io stream notified an error:\n%s', ref, err.stack );
    process.exit(1);
  })
  view.render( meta, ui );
  try {
    meta.operation && execute( meta.operation )
      //.on('error'?)
      //.on('end'?)
      //.resume()?
    ;
  } catch( err ){
    ui.raw( ansi.red )
      .log( "Error while executing '%s'", meta.operation, ansi.reset )
      .ps3( ansi.yellow + 'stack ' + ansi.reset )
      .log( err.stack || err )
      .ps3( )
      .log( )
    ;
  }
/*  return io.on('pipe', function( stdin ){
    console.log('going to read');
    return;
    read({
      input: stdin, output: io, terminal: true, n: 1
    }, function( command ){
      console.log( "received command '%s'", command );
      io.end( 'Bye' );
      io.push( null );
      console.dir( io._readableState );
    });
  });*/
  meta.keymap && io.once('pipe', function( input ){
    console.log( 'detected pipe for view "%s" io. stdin?', name, input === process.stdin );
    input === process.stdin && keymap( ui, meta.keymap, function viewoption( command ){
      try {
        input.unpipe( io );
        var cmd = input.pipe( execute(command) );
        assert( cmd instanceof stream.Duplex,
          'operations must return a DuplexStream intance'
        );

        cmd
        .on( 'error', function( err ){
          console.log( 'view "%s" command error', name );
          console.dir( err );
          console.log( input._readableState );
        })
        .once( 'finish', function(){
          console.log( 'command "%s" finished', command );
          input.pipe( view(ref) ).pipe( io );
        });
      } catch( err ){
        ui
          .clear( )
          .raw( ansi.red )
          .log( "Error while executing '%s'", command )
          .ps3( ansi.yellow + "stack " + ansi.reset )
          .log( err.stack || err )
          .ps3( )
          .raw( ansi.reset )
          .log( "Press a key to view '%s' again", meta.title || ref )
          .log( "Alternativelly, press Ctrl+C to exit" )
        ;
        return readn( 1, view.bind( null, ref ) );
      }
    });
  });
  return io;
}

/**
 * resolves a view referente to its meta info
 *
 * @param {string} ref path reference to the view, inside the view dir
 * @returns {object} the view meta info
 */

view.read = function( ref ){
  ref = ide.resolve( 'view', ref );
  try {
    ref = require.resolve( ref );
    delete require.cache[ ref ];
    return require( ref );
  } catch( err ){
    if( err.code != 'MODULE_NOT_FOUND' ){
      throw err;
    }
    throw new ReferenceError("I can't find the view " + ref);
  }
};

/**
 *
 * @param {object} meta the meta information of the view
 * @param {UserInterface} ui
 */

view.render = function( meta, ui ){
  ui//.clear( )
    .ps3( )
    .log( '/**' )
    .ps3( ' * ' )
    .raw( ' * ' + ansi.blue + '# iai-ide' )
  ;
  meta.title && ui.raw( ' - ' + meta.title );
  ui
    .raw( ' #\n' + ansi.reset )
    .log( )
    .log( ansi.blue + process.cwd() + ansi.reset )
    .log( )
  ;
  meta.message
    && ui.log( meta.message )
    && ui.log( )
  ;
  ui.ps3( ).log( ' */' );
}
