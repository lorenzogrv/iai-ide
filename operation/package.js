var terminal = require('../lib/terminal')
  , ansi = require('../lib/ansi')
  , vim = require('./vim')
  , resolve = require('path').resolve
;

module.exports = package;

function package( ){
  var ui = terminal( process.stdout );
  try {
    var path = resolve( 'package.json' );
    delete require.cache[ path ];
    package.render( require(path), ui );
  } catch( err ){
    if( err.code != 'MODULE_NOT_FOUND' ){
      throw err;
    }
    ui.raw( ansi.red )
      .log( process.cwd() + ' is not a commonjs package' )
      .raw( ansi.reset )
  }
};

package.render = function( pkg, ui ){
  ui
    .log( )
    .raw( ansi.green )
    .log( 'basic info:' )
    .log( '  name: ' + pkg.name )
    .log( '  ver : ' + pkg.version )
    .log( '  desc: ' + pkg.description )
    .log( )
    .log( 'structure: ' + JSON.stringify(pkg.directories, null, 2) )
    .log( )
    .log( 'relevant scripts:' )
    .log( '  start: ' + pkg.scripts.start )
    .log( '  test : ' + pkg.scripts.test )
    .raw( ansi.reset )
  ;
}
