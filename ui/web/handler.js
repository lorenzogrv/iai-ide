var swig = require('swig');

module.exports = function( req, res ){
  res.end( swig.renderFile(),{
  } );
};
