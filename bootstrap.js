var view = require( './operation/view' );
  
process.stdin
  .pipe( view('home') )
  .pipe( process.stdout )
;
