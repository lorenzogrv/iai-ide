var readline = require('readline');

/**
 * reads characters from any readable stream
 * if !n, it will read until enter is hit
 */

module.exports = read;

function read( opts, callback ){
  var input = opts.input || process.stdin;
  var output = opts.output || process.stdout;

  if( opts.n && !input.setRawMode ){
    throw new Error( "can't use 'n' option on non-TTY input" );
  }

  var rl = readline.createInterface({
    input: input,
    output: output,
    terminal: opts.terminal || output.isTTY
  });

  function done( data ){
    rl.close();
    callback( data );
  }

  if( !opts.n ){
    return rl.on( 'line', done )
  }

  var count = 0, sequence = '';
  input.on( 'keypress', storeKey );

  function storeKey( ch, key ){
    if( key && key.sequence == '\u0003' ){
      rl.write('\n^C\n')
      return process.exit(1)
    }
    sequence += ( key && key.sequence || ch );
    count++;
    if( count == opts.n ){
      this.removeListener( 'keypress', storeKey );
      rl.write('\n');
      done( sequence );
    }
  }
}
