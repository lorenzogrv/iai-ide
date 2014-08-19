var iai = require('../../../iai')
  , layout = iai( __dirname )
  , swig = require('swig')
;

module.exports = function( req, res ){
  res.end( swig.renderFile(layout.resolve('screen.swig'), {
  }) );
};
