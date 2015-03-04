var Linear = require('sylvester');

var LinearSupport = function() {};

/*
 * Validate whether each argument is of type Vector
 */
LinearSupport.prototype.isVector = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    if ( !(arguments[i] instanceof Linear.Vector) ) {
      throw new TypeError("Argument needs to be of type Vector");
    }
  }
};

/*
 * Validate whether all of the Vector arguments have the same number
 * of elements in their space
 */
LinearSupport.prototype.hasEqualElementCount = function() {
  var N = arguments[0].elements.length;

  for ( var i = 0; i < arguments.length; i++) {
    if ( N != arguments[i].elements.length ) {
      throw new Error('Vectors must have the same number of elements. Failed at index ' + i.toString());
    }
  }

  return N;
};

module.exports = LinearSupport;
