function spawnScript( script ){
  /**
   * Checks if the script file is executable
   * Uses bitmasks to determine whatever it is executable
   * If desired, Uses bitmasks to change permisions to make it executable
   * See also:
   *   http://www.perlmonks.org/bare/?node_id=323977
   *   http://man7.org/linux/man-pages/man2/chmod.2.html
   */
  var stats = fs.statSync(script);
  //var is_executable = !!(stats.mode & 00400 && stats.mode & 00200 && stats.mode & 00100);
  if( !(stats.mode & 00400 && stats.mode & 00200 && stats.mode & 00100) ){
    terminal
      .log( "the selected script is not executable." )
      .raw( "Do you want to make it executable now? [y/N]: " )
    ;
    return readn( 1, function( key ){
      if( key === 'y' ){
        fs.chmodSync( script, stats.mode | 00400 | 00200 | 00100 );
        return main_menu( "Done. Select the script again from the main menu." );
      }
      main_menu( "Can't execute then." );
    });
  }

  // executes the script on a subprocess
  spawn( script, [], { stdio: 'inherit' })
    .on('close', function( code ){
      if( code ){
        terminal.ps3( ).log( ).log( '/**' ).ps3( ' * ' );
        terminal.log( 'script main-menu/%s exited with code %s', key, code );
        terminal.log( "Press any key to go to the main menu..." )
        return readn( 1, main_menu.bind( null, null ) );
      }
      main_menu( 'script %s completed.', 'main-menu/'+key );
    })
  ;
}
