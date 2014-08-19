

// this should read available scripts from a directory
// IGNORE = /regexp_to_ignore_filenames/

return fs.readdirSync( __dirname ).filter(function( filename ){
  return IGNORE.test( filename );
}, this);
// this should construct a key map, being options an array of strings
var  keymap = { 'q': 'Exit / Back' };
for( var  in options ){
  for( var n in options[o] ){
    if( keymap[ options[o][n] ] === undefined ){
      keymap[ options[o][n] ] = options[o];
      break;
    } else if( n === options.length-1 ){
      ui.log( 'entry', options[o], 'not set' );
    }
  }
}
// this shoud execute a script file (option)
var filepath = __dirname + '/' + option;
if( process.env.NODE_ENV !== 'production' ){
  delete require.cache[ filepath ];
}
try {
  require( filepath ).render( '' );
} catch( err ){
  delete require.cache[ filepath ];
  this.render( "catched an error while rendering '%s':\n%s", option, err.stack );
}
